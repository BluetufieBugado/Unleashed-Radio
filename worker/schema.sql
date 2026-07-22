-- Tabela que guarda quem mandou sinal de vida por último, em qual página
-- e em qual variante (dia/noite). Cole isso no console SQL do D1
-- (Cloudflare Dashboard > Workers & Pages > D1 > seu banco > "Console").

CREATE TABLE IF NOT EXISTS presence (
  session_id TEXT PRIMARY KEY,
  scene TEXT NOT NULL,
  variant INTEGER NOT NULL DEFAULT 0,
  last_seen INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_presence_scene_variant ON presence (scene, variant);
