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

  // identificador único desta aba/visita — usado para saber quem entrou
  // e quem saiu de cada página+variante
  const sessionId = (crypto.randomUUID ? crypto.randomUUID() : "s" + Math.random().toString(36).slice(2));

  let presenceRef = null;
  let presenceCountRef = null;
  let presenceCountHandler = null;

  function firebaseReady() {
    return typeof firebase !== "undefined" && firebase.apps && firebase.apps.length > 0;
  }

  function updatePresence(id, variantIdx) {
    if (!firebaseReady()) return; // firebase-config.js ainda não foi preenchido

    // sai da posição anterior (página+variante que o usuário deixou)
    if (presenceRef) {
      presenceRef.onDisconnect().cancel();
      presenceRef.remove();
    }
    if (presenceCountRef && presenceCountHandler) {
      presenceCountRef.off("value", presenceCountHandler);
    }

    // entra na nova posição (página+variante atual)
    const path = `presence/${id}/${variantIdx}`;
    presenceRef = firebase.database().ref(path).child(sessionId);
    presenceRef.set(true);
    presenceRef.onDisconnect().remove(); // some sozinho se a pessoa fechar a aba

    presenceCountRef = firebase.database().ref(path);
    presenceCountHandler = presenceCountRef.on("value", snap => {
      const count = snap.exists() ? Object.keys(snap.val()).length : 0;
      onlineCountEl.textContent = count;
    });
  }

  window.addEventListener("beforeunload", () => {
    if (presenceRef) presenceRef.remove();
  });

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
    const el = document.createElement("div");
    el.className = "scene";
    el.style.backgroundImage = `url("${getSceneBackground(id, scene)}")`;
    el.dataset.sceneId = id;

    (scene.buttons || []).forEach(btn => {
      const b = document.createElement("button");
      b.className = "scene-btn";
      b.style.left = btn.x + "%";
      b.style.top = btn.y + "%";
      b.style.width = btn.width + "vw";
      b.setAttribute("aria-label", "Ir para " + btn.target);

      const img = document.createElement("img");
      img.src = btn.image;
      img.alt = "";
      b.appendChild(img);

      b.addEventListener("click", () => goToScene(btn.target));
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
      b.style.width = tb.width + "vw";
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
})();
