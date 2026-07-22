/*
  WORKER: unleashed-radio
  =================================
  Isso roda na Cloudflare (fora do seu site), e é o que substitui o
  Firebase pro contador de pessoas online.

  Duas rotas:
    POST /heartbeat  -> "eu ainda estou aqui, nesta página, nesta variante"
    GET  /count      -> "quantas pessoas mandaram sinal recentemente aqui?"

  Cada visitante manda um heartbeat a cada ~20s (ver script.js). Se alguém
  fica mais de HEARTBEAT_TTL_SECONDS sem mandar sinal (fechou a aba, caiu
  a internet, etc.), ele deixa de contar automaticamente — sem precisar
  de nenhuma ação de "saída" explícita.
*/

const HEARTBEAT_TTL_SECONDS = 45;

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(data, origin, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    // ---------- POST /heartbeat ----------
    if (url.pathname === "/heartbeat" && request.method === "POST") {
      const body = await request.json().catch(() => null);
      if (!body || !body.session || !body.scene) {
        return json({ error: "dados inválidos" }, origin, 400);
      }

      const now = Math.floor(Date.now() / 1000);
      await env.DB.prepare(
        `INSERT INTO presence (session_id, scene, variant, last_seen)
         VALUES (?1, ?2, ?3, ?4)
         ON CONFLICT(session_id) DO UPDATE SET
           scene = excluded.scene,
           variant = excluded.variant,
           last_seen = excluded.last_seen`
      )
        .bind(body.session, body.scene, body.variant ?? 0, now)
        .run();

      return json({ ok: true }, origin);
    }

    // ---------- GET /count ----------
    if (url.pathname === "/count" && request.method === "GET") {
      const scene = url.searchParams.get("scene");
      const variant = url.searchParams.get("variant") ?? "0";
      if (!scene) {
        return json({ error: "faltou o parâmetro scene" }, origin, 400);
      }

      const cutoff = Math.floor(Date.now() / 1000) - HEARTBEAT_TTL_SECONDS;
      const row = await env.DB.prepare(
        `SELECT COUNT(*) AS count FROM presence
         WHERE scene = ?1 AND variant = ?2 AND last_seen > ?3`
      )
        .bind(scene, variant, cutoff)
        .first();

      return json({ count: row ? row.count : 0 }, origin);
    }

    return json({ error: "rota não encontrada" }, origin, 404);
  },

  // roda automaticamente 1x por hora (configurado no wrangler.toml),
  // só pra apagar sessões bem antigas e manter a tabela pequena
  async scheduled(event, env) {
    const cutoff = Math.floor(Date.now() / 1000) - 3600;
    await env.DB.prepare(`DELETE FROM presence WHERE last_seen < ?1`).bind(cutoff).run();
  },
};
