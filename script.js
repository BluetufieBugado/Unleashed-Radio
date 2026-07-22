(() => {
  const stage = document.getElementById("stage");
  const backBtn = document.getElementById("back-btn");
  const startOverlay = document.getElementById("start-overlay");
  const startBtn = document.getElementById("start-btn");
  const audioA = document.getElementById("bg-audio-a");
  const audioB = document.getElementById("bg-audio-b");

  let activeAudio = audioA;
  let idleAudio = audioB;
  let currentSceneId = null;
  const FADE_MS = 900;
  const FADE_STEPS = 18;

  // guarda em qual "variante" (ex: dia/noite) cada cena está no momento
  // 0 = primeira variante da lista, 1 = segunda, etc.
  // só existe uma entrada aqui DEPOIS que o usuário clica no botão de
  // alternância manualmente — antes disso, a variante é decidida pelo
  // horário automático (função getAutoVariantIndex)
  const sceneVariant = {};

  // horário local do usuário que define dia/noite.
  // por padrão: dia = 06:00 até 16:59, noite = 17:00 até 05:59
  const DAY_START_HOUR = 6;
  const DAY_END_HOUR = 17;

  function getAutoVariantIndex(scene) {
    // só faz sentido decidir "automaticamente" quando a cena tem
    // exatamente duas variantes, no padrão [dia, noite]
    if (!scene.variants || scene.variants.length < 2) return 0;
    const hour = new Date().getHours();
    const isDay = hour >= DAY_START_HOUR && hour < DAY_END_HOUR;
    return isDay ? 0 : 1;
  }

  function getVariantIndex(id, scene) {
    if (!scene.variants) return 0;
    // se o usuário já alternou manualmente essa cena, respeita a escolha dele
    if (Object.prototype.hasOwnProperty.call(sceneVariant, id)) {
      return sceneVariant[id];
    }
    // senão, decide pela hora atual do dispositivo do usuário
    return getAutoVariantIndex(scene);
  }

  function getSceneBackground(id, scene) {
    if (scene.variants) return scene.variants[getVariantIndex(id, scene)].background;
    return scene.background;
  }

  function getSceneMusic(id, scene) {
    if (scene.variants) return scene.variants[getVariantIndex(id, scene)].music;
    return scene.music;
  }

  const onlineCountEl = document.getElementById("online-count");
  const clockEl = document.getElementById("clock");
  const clockTimeEl = document.getElementById("clock-time");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tickClock() {
    const now = new Date();
    clockTimeEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  }
  tickClock();
  setInterval(tickClock, 1000);

  function updateClockVisibility(scene) {
    clockEl.classList.toggle("visible", !!scene.showClock);
  }

  // ---------- CONTADOR DE PRESENÇA (via Cloudflare Worker + D1) ----------
  // Troque pela URL que a Cloudflare te der depois do deploy do Worker
  // (ver worker/README dentro do projeto). Enquanto estiver com o valor
  // de exemplo, o contador simplesmente fica mostrando "0", sem travar
  // nada no resto do site.
  const PRESENCE_API = "https://unleashed-radio.fenixp2br22096627.workers.dev";
  const HEARTBEAT_INTERVAL_MS = 20000; // a cada 20s

  // identificador único desta aba/visita
  const sessionId = (crypto.randomUUID ? crypto.randomUUID() : "s" + Math.random().toString(36).slice(2));

  let presenceTimer = null;

  function sendHeartbeat(id, variantIdx) {
    fetch(`${PRESENCE_API}/heartbeat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session: sessionId, scene: id, variant: variantIdx }),
    }).catch(() => {});
  }

  function fetchCount(id, variantIdx) {
    fetch(`${PRESENCE_API}/count?scene=${encodeURIComponent(id)}&variant=${variantIdx}`)
      .then(r => r.json())
      .then(data => {
        if (typeof data.count === "number") onlineCountEl.textContent = data.count;
      })
      .catch(() => {});
  }

  function updatePresence(id, variantIdx) {
    if (presenceTimer) clearInterval(presenceTimer);

    const tick = () => {
      sendHeartbeat(id, variantIdx);
      fetchCount(id, variantIdx);
    };
    tick(); // manda o primeiro sinal na hora, sem esperar o intervalo
    presenceTimer = setInterval(tick, HEARTBEAT_INTERVAL_MS);
  }

  function fadeAudio(el, from, to, ms) {
    const steps = FADE_STEPS;
    const stepTime = ms / steps;
    let i = 0;
    clearInterval(el._fadeInterval);
    el._fadeInterval = setInterval(() => {
      i++;
      const v = from + (to - from) * (i / steps);
      el.volume = Math.min(1, Math.max(0, v));
      if (i >= steps) {
        clearInterval(el._fadeInterval);
        if (to === 0) el.pause();
      }
    }, stepTime);
  }

  function playSceneMusic(src) {
    if (!src) return;
    // se a música pedida já é a que está tocando, não reinicia
    if (activeAudio.getAttribute("data-src") === src && !activeAudio.paused) return;

    idleAudio.pause();
    idleAudio.currentTime = 0;
    idleAudio.setAttribute("data-src", src);
    idleAudio.src = src;
    idleAudio.volume = 0;
    idleAudio.play().catch(() => {});

    fadeAudio(idleAudio, 0, 1, FADE_MS);
    fadeAudio(activeAudio, 1, 0, FADE_MS);

    const tmp = activeAudio;
    activeAudio = idleAudio;
    idleAudio = tmp;
  }

  function buildSceneEl(id, scene) {
    const bgUrl = getSceneBackground(id, scene);

    const el = document.createElement("div");
    el.className = "scene";
    el.style.backgroundImage = `url("${bgUrl}")`;
    el.dataset.sceneId = id;

    (scene.buttons || []).forEach(btn => {
      const b = document.createElement("button");
      b.className = "scene-btn";
      b.style.left = btn.x + "%";
      b.style.top = btn.y + "%";
      b.style.width = btn.width + "%";

      const img = document.createElement("img");
      img.src = btn.image;
      img.alt = "";
      b.appendChild(img);

      if (btn.href) {
        // link externo (ex: GitHub) — abre em uma aba nova
        b.setAttribute("aria-label", "Abrir link externo");
        b.addEventListener("click", () => {
          window.open(btn.href, "_blank", "noopener");
        });
      } else {
        // navegação interna, entre as páginas do site
        b.setAttribute("aria-label", "Ir para " + btn.target);
        b.addEventListener("click", () => goToScene(btn.target));
      }

      el.appendChild(b);
    });

    // botão de alternância (ex: dia/noite) — troca o fundo e a música
    // da MESMA página, sem navegar para outra
    if (scene.toggleButton && scene.variants && scene.variants.length > 1) {
      const tb = scene.toggleButton;
      const b = document.createElement("button");
      b.className = "scene-btn";
      b.style.left = tb.x + "%";
      b.style.top = tb.y + "%";
      b.style.width = tb.width + "%";
      b.setAttribute("aria-label", "Alternar cenário");

      const img = document.createElement("img");
      img.src = tb.image;
      img.alt = "";
      b.appendChild(img);

      b.addEventListener("click", () => {
        const total = scene.variants.length;
        sceneVariant[id] = (getVariantIndex(id, scene) + 1) % total;
        goToScene(id); // re-renderiza a mesma cena já com a nova variante
      });

      el.appendChild(b);
    }

    return el;
  }

  function goToScene(id) {
    const scene = scenes[id];
    if (!scene) {
      console.warn("Cena não encontrada no config.js:", id);
      return;
    }

    // remove cena antiga (com um pequeno atraso pra transição terminar)
    const old = stage.querySelector(".scene.active");
    if (old) {
      old.classList.remove("active");
      setTimeout(() => old.remove(), FADE_MS);
    }

    const newEl = buildSceneEl(id, scene);
    stage.appendChild(newEl);
    // força reflow para a transição funcionar
    void newEl.offsetWidth;
    requestAnimationFrame(() => newEl.classList.add("active"));

    playSceneMusic(getSceneMusic(id, scene));
    updatePresence(id, getVariantIndex(id, scene));
    updateClockVisibility(scene);

    backBtn.onclick = scene.back ? () => goToScene(scene.back) : null;
    backBtn.classList.toggle("visible", !!scene.back);

    currentSceneId = id;
    location.hash = id;
  }

  startBtn.addEventListener("click", () => {
    startOverlay.classList.add("hidden");
    const initial = location.hash ? location.hash.slice(1) : "inicio";
    goToScene(scenes[initial] ? initial : "inicio");
  });

  window.addEventListener("hashchange", () => {
    const id = location.hash.slice(1);
    if (id && id !== currentSceneId && scenes[id]) goToScene(id);
  });

  // ---------- BOTÃO DE TELA CHEIA ----------
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const iconEnter = document.getElementById("fullscreen-icon-enter");
  const iconExit = document.getElementById("fullscreen-icon-exit");

  function isFullscreen() {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );
  }

  function updateFullscreenIcon() {
    const active = isFullscreen();
    iconEnter.style.display = active ? "none" : "";
    iconExit.style.display = active ? "" : "none";
    fullscreenBtn.setAttribute("aria-label", active ? "Sair da tela cheia" : "Tela cheia");
  }

  function toggleFullscreen() {
    const el = document.documentElement;
    if (!isFullscreen()) {
      const request =
        el.requestFullscreen ||
        el.webkitRequestFullscreen ||
        el.msRequestFullscreen;
      if (request) request.call(el).catch(() => {});
    } else {
      const exit =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen;
      if (exit) exit.call(document).catch(() => {});
    }
  }

  fullscreenBtn.addEventListener("click", toggleFullscreen);

  // mantém o ícone certo mesmo se o usuário sair com ESC, F11, etc.
  ["fullscreenchange", "webkitfullscreenchange", "msfullscreenchange"].forEach(evt =>
    document.addEventListener(evt, updateFullscreenIcon)
  );
  updateFullscreenIcon();
})();
