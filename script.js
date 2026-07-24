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

  // usado pelo music player: silencia a música ambiente da cena enquanto
  // uma faixa do player está tocando, e retoma de onde parou ao fechar
  let ambientWasPlaying = false;

  function pauseAmbientMusic() {
    if (!activeAudio.paused) {
      ambientWasPlaying = true;
      fadeAudio(activeAudio, activeAudio.volume, 0, FADE_MS);
    }
  }

  function resumeAmbientMusic() {
    if (!ambientWasPlaying) return;
    ambientWasPlaying = false;
    activeAudio.play().catch(() => {});
    fadeAudio(activeAudio, 0, 1, FADE_MS);
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
      } else if (btn.gallery) {
        // abre uma galeria de imagens (definida em "galleries" no config.js)
        b.setAttribute("aria-label", "Abrir galeria");
        b.addEventListener("click", () => openGallery(btn.gallery));
      } else if (btn.player) {
        // abre um player de música (definido em "musicPlayers" no config.js)
        b.setAttribute("aria-label", "Abrir player de música");
        b.addEventListener("click", () => openMusicPlayer(btn.player));
      } else if (btn.videoGallery) {
        // abre uma galeria de cutscenes (definida em "videoGalleries" no config.js)
        b.setAttribute("aria-label", "Abrir cutscenes");
        b.addEventListener("click", () => openVideoGallery(btn.videoGallery));
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

    // personagem estático por cima do fundo (ex: Tails, Amy) — sem clique,
    // só decorativo/narrativo. x/y marcam onde os "pés" tocam o chão.
    if (scene.character) {
      const ch = scene.character;
      const wrap = document.createElement("div");
      wrap.className = "scene-character";
      wrap.style.left = ch.x + "%";
      wrap.style.top = ch.y + "%";
      wrap.style.width = ch.width + "%";

      const img = document.createElement("img");
      img.src = ch.image;
      img.alt = "";
      wrap.appendChild(img);

      el.appendChild(wrap);
    }

    // caixa de texto real (não é imagem) — dá pra traduzir com o navegador.
    // x = centro horizontal em %, y = topo em %, width = largura em %.
    // "text" é uma lista de parágrafos; "logos" (opcional) é uma lista de
    // { image, width } mostrada em linha, embaixo do texto.
    if (scene.textbox) {
      const tb = scene.textbox;
      const box = document.createElement("div");
      box.className = "textbox";
      box.style.left = tb.x + "%";
      box.style.top = tb.y + "%";
      box.style.width = tb.width + "%";
      if (tb.align) box.style.textAlign = tb.align;

      (tb.text || []).forEach(paragraph => {
        const p = document.createElement("p");
        p.textContent = paragraph;
        box.appendChild(p);
      });

      if (tb.logos && tb.logos.length) {
        const logosRow = document.createElement("div");
        logosRow.className = "textbox-logos";
        tb.logos.forEach(logo => {
          const img = document.createElement("img");
          img.src = logo.image;
          img.alt = "";
          if (logo.width) img.style.width = logo.width + "%";
          logosRow.appendChild(img);
        });
        box.appendChild(logosRow);
      }

      el.appendChild(box);
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

  // ---------- GALERIA DE IMAGENS + VISUALIZADOR EM TELA CHEIA ----------
  // "galleries" vem do config.js (mesmo esquema de "scenes"): cada galeria
  // tem um título e uma lista de imagens. Um botão em qualquer cena pode
  // abrir uma galeria usando { gallery: "id-da-galeria", ... } em vez de
  // "target" (navegação) ou "href" (link externo).
  const galleryOverlay = document.getElementById("gallery-overlay");
  const galleryTitleEl = document.getElementById("gallery-title");
  const galleryGridEl = document.getElementById("gallery-grid");
  const galleryCloseBtn = document.getElementById("gallery-close-btn");

  const lightboxOverlay = document.getElementById("lightbox-overlay");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCloseBtn = document.getElementById("lightbox-close-btn");
  const lightboxPrevBtn = document.getElementById("lightbox-prev-btn");
  const lightboxNextBtn = document.getElementById("lightbox-next-btn");

  let currentGalleryImages = [];
  let currentLightboxIndex = 0;

  function openGallery(id) {
    const gallery = (typeof galleries !== "undefined") ? galleries[id] : null;
    if (!gallery) {
      console.warn("Galeria não encontrada no config.js:", id);
      return;
    }

    currentGalleryImages = gallery.images || [];
    galleryTitleEl.textContent = gallery.title || "";
    galleryGridEl.innerHTML = "";

    currentGalleryImages.forEach((src, index) => {
      const thumb = document.createElement("button");
      thumb.className = "gallery-thumb";
      thumb.setAttribute("aria-label", "Ver imagem em tela cheia");

      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      thumb.appendChild(img);

      thumb.addEventListener("click", () => openLightbox(index));
      galleryGridEl.appendChild(thumb);
    });

    galleryOverlay.classList.add("visible");
  }

  function closeGallery() {
    galleryOverlay.classList.remove("visible");
  }

  function openLightbox(index) {
    currentLightboxIndex = index;
    showLightboxImage();
    lightboxOverlay.classList.add("visible");
  }

  function closeLightbox() {
    lightboxOverlay.classList.remove("visible");
  }

  function showLightboxImage() {
    lightboxImg.src = currentGalleryImages[currentLightboxIndex];
  }

  function showNextImage() {
    if (!currentGalleryImages.length) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % currentGalleryImages.length;
    showLightboxImage();
  }

  function showPrevImage() {
    if (!currentGalleryImages.length) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    showLightboxImage();
  }

  galleryCloseBtn.addEventListener("click", closeGallery);
  lightboxCloseBtn.addEventListener("click", closeLightbox);
  lightboxNextBtn.addEventListener("click", showNextImage);
  lightboxPrevBtn.addEventListener("click", showPrevImage);

  // fecha clicando fora da imagem (mas não ao clicar na grade em si)
  lightboxOverlay.addEventListener("click", (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
  });

  // atalhos de teclado: setas pra navegar, Esc pra fechar
  document.addEventListener("keydown", (e) => {
    if (lightboxOverlay.classList.contains("visible")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNextImage();
      if (e.key === "ArrowLeft") showPrevImage();
    } else if (galleryOverlay.classList.contains("visible")) {
      if (e.key === "Escape") closeGallery();
    } else if (playerOverlay.classList.contains("visible")) {
      if (e.key === "Escape") closeMusicPlayer();
    }
  });

  // ---------- MUSIC PLAYER (capa + next/prev) ----------
  // "musicPlayers" vem do config.js: cada player tem uma lista de faixas
  // ({ title, region, cover, src }). Um botão abre o player usando
  // { player: "id-do-player", ... } em vez de "target"/"href"/"gallery".
  const playerOverlay = document.getElementById("player-overlay");
  const playerCloseBtn = document.getElementById("player-close-btn");
  const playerCoverEl = document.getElementById("player-cover");
  const playerTitleEl = document.getElementById("player-track-title");
  const playerRegionEl = document.getElementById("player-track-region");
  const playerAudio = document.getElementById("player-audio");
  const playerProgressTrack = document.getElementById("player-progress-track");
  const playerProgressFill = document.getElementById("player-progress-fill");
  const playerTimeCurrent = document.getElementById("player-time-current");
  const playerTimeDuration = document.getElementById("player-time-duration");
  const playerPlayPauseBtn = document.getElementById("player-playpause-btn");
  const playerPlayIcon = document.getElementById("player-play-icon");
  const playerPauseIcon = document.getElementById("player-pause-icon");
  const playerPrevBtn = document.getElementById("player-prev-btn");
  const playerNextBtn = document.getElementById("player-next-btn");
  const playerLoopBtn = document.getElementById("player-loop-btn");

  let currentPlayerTracks = [];
  let currentTrackIndex = 0;

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${pad(s)}`;
  }

  function openMusicPlayer(id) {
    const player = (typeof musicPlayers !== "undefined") ? musicPlayers[id] : null;
    if (!player || !player.tracks || !player.tracks.length) {
      console.warn("Player não encontrado no config.js:", id);
      return;
    }

    currentPlayerTracks = player.tracks;
    pauseAmbientMusic();
    playerOverlay.classList.add("visible");
    loadTrack(0, true);
  }

  function closeMusicPlayer() {
    playerOverlay.classList.remove("visible");
    playerAudio.pause();
    resumeAmbientMusic();
  }

  function loadTrack(index, autoplay) {
    currentTrackIndex = index;
    const track = currentPlayerTracks[currentTrackIndex];
    if (!track) return;

    playerCoverEl.src = track.cover || "";
    playerTitleEl.textContent = track.title || "";
    playerRegionEl.textContent = track.region || "";

    playerAudio.src = track.src;
    playerProgressFill.style.width = "0%";
    playerTimeCurrent.textContent = "0:00";
    playerTimeDuration.textContent = "0:00";

    if (autoplay) {
      playerAudio.play().catch(() => {});
    }
  }

  function updatePlayPauseIcon() {
    const playing = !playerAudio.paused && !playerAudio.ended;
    playerPlayIcon.style.display = playing ? "none" : "";
    playerPauseIcon.style.display = playing ? "" : "none";
    playerPlayPauseBtn.setAttribute("aria-label", playing ? "Pausar" : "Tocar");
  }

  function togglePlayPause() {
    if (playerAudio.paused) {
      playerAudio.play().catch(() => {});
    } else {
      playerAudio.pause();
    }
  }

  function playNextTrack() {
    const next = (currentTrackIndex + 1) % currentPlayerTracks.length;
    loadTrack(next, true);
  }

  function playPrevTrack() {
    const prev = (currentTrackIndex - 1 + currentPlayerTracks.length) % currentPlayerTracks.length;
    loadTrack(prev, true);
  }

  // repete a faixa atual em loop (não passa pra próxima quando termina)
  function toggleLoop() {
    playerAudio.loop = !playerAudio.loop;
    playerLoopBtn.classList.toggle("active", playerAudio.loop);
    playerLoopBtn.setAttribute("aria-label", playerAudio.loop ? "Repetir música: ativado" : "Repetir música: desativado");
  }

  playerLoopBtn.addEventListener("click", toggleLoop);

  playerCloseBtn.addEventListener("click", closeMusicPlayer);
  playerPlayPauseBtn.addEventListener("click", togglePlayPause);
  playerNextBtn.addEventListener("click", playNextTrack);
  playerPrevBtn.addEventListener("click", playPrevTrack);

  playerAudio.addEventListener("play", updatePlayPauseIcon);
  playerAudio.addEventListener("pause", updatePlayPauseIcon);
  playerAudio.addEventListener("ended", playNextTrack);

  playerAudio.addEventListener("loadedmetadata", () => {
    playerTimeDuration.textContent = formatTime(playerAudio.duration);
  });

  playerAudio.addEventListener("timeupdate", () => {
    if (!playerAudio.duration) return;
    const pct = (playerAudio.currentTime / playerAudio.duration) * 100;
    playerProgressFill.style.width = pct + "%";
    playerTimeCurrent.textContent = formatTime(playerAudio.currentTime);
  });

  playerProgressTrack.addEventListener("click", (e) => {
    if (!playerAudio.duration) return;
    const rect = playerProgressTrack.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    playerAudio.currentTime = ratio * playerAudio.duration;
  });

  // ---------- GALERIA DE CUTSCENES (grade + vídeo em tela cheia com setas) ----------
  // "videoGalleries" vem do config.js: cada galeria tem título e uma lista
  // de vídeos ({ title, thumbnail, src }). Abre com { videoGallery: "id", ... }
  // em vez de "target"/"href"/"gallery"/"player".
  const videoGalleryOverlay = document.getElementById("video-gallery-overlay");
  const videoGalleryTitleEl = document.getElementById("video-gallery-title");
  const videoGalleryGridEl = document.getElementById("video-gallery-grid");
  const videoGalleryCloseBtn = document.getElementById("video-gallery-close-btn");

  const videoLightboxOverlay = document.getElementById("video-lightbox-overlay");
  const videoLightboxPlayer = document.getElementById("video-lightbox-player");
  const videoLightboxCloseBtn = document.getElementById("video-lightbox-close-btn");
  const videoLightboxPrevBtn = document.getElementById("video-lightbox-prev-btn");
  const videoLightboxNextBtn = document.getElementById("video-lightbox-next-btn");
  const videoLightboxYoutubeWrap = document.getElementById("video-lightbox-youtube-wrap");

  let currentVideoList = [];
  let currentVideoIndex = 0;

  function openVideoGallery(id) {
    const gallery = (typeof videoGalleries !== "undefined") ? videoGalleries[id] : null;
    if (!gallery) {
      console.warn("Galeria de vídeos não encontrada no config.js:", id);
      return;
    }

    currentVideoList = gallery.videos || [];
    videoGalleryTitleEl.textContent = gallery.title || "";
    videoGalleryGridEl.innerHTML = "";

    currentVideoList.forEach((video, index) => {
      const thumb = document.createElement("button");
      thumb.className = "video-thumb";
      thumb.setAttribute("aria-label", "Assistir " + (video.title || "cutscene"));

      const imgWrap = document.createElement("div");
      imgWrap.className = "video-thumb-image-wrap";

      const img = document.createElement("img");
      img.src = video.thumbnail || (video.youtubeId ? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg` : "");
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      imgWrap.appendChild(img);

      const playIcon = document.createElement("div");
      playIcon.className = "video-thumb-play-icon";
      playIcon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7 4l14 8-14 8V4z" fill="currentColor"/></svg>';
      imgWrap.appendChild(playIcon);

      thumb.appendChild(imgWrap);

      const title = document.createElement("span");
      title.className = "video-thumb-title";
      title.textContent = video.title || "";
      thumb.appendChild(title);

      thumb.addEventListener("click", () => openVideoLightbox(index));
      videoGalleryGridEl.appendChild(thumb);
    });

    // vídeos costumam ter som próprio, então silencia o ambiente da cena
    // enquanto a galeria de cutscenes estiver aberta (grade ou vídeo)
    pauseAmbientMusic();
    videoGalleryOverlay.classList.add("visible");
  }

  function closeVideoGallery() {
    videoGalleryOverlay.classList.remove("visible");
    resumeAmbientMusic();
  }

  function openVideoLightbox(index) {
    currentVideoIndex = index;
    playCurrentVideo();
    videoLightboxOverlay.classList.add("visible");
  }

  function closeVideoLightbox() {
    videoLightboxOverlay.classList.remove("visible");
    videoLightboxPlayer.pause();
    videoLightboxPlayer.removeAttribute("src");
    videoLightboxPlayer.load();
    stopYoutubeVideo();
  }

  // ---------- suporte a cutscenes do YouTube ----------
  // a API do YouTube só é carregada na primeira vez que uma cutscene com
  // "youtubeId" é aberta — cutscenes com vídeo local nunca carregam isso
  let ytApiReady = false;
  let ytApiLoading = false;
  let ytApiQueue = [];
  let ytPlayer = null;

  function ensureYoutubeApi(callback) {
    if (window.YT && window.YT.Player) {
      callback();
      return;
    }
    ytApiQueue.push(callback);
    if (ytApiLoading) return;
    ytApiLoading = true;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      ytApiReady = true;
      ytApiQueue.forEach(cb => cb());
      ytApiQueue = [];
    };
  }

  function playYoutubeVideo(videoId) {
    ensureYoutubeApi(() => {
      if (ytPlayer) {
        ytPlayer.loadVideoById(videoId);
      } else {
        ytPlayer = new YT.Player("video-lightbox-youtube", {
          videoId: videoId,
          playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
          events: {
            // reforça a referrerpolicy direto no iframe (evita Erro 153)
            onReady: (e) => {
              const iframe = e.target.getIframe();
              if (iframe) iframe.referrerPolicy = "strict-origin-when-cross-origin";
            },
            // quando a cutscene do YouTube termina sozinha, fecha e volta
            // pra grade, igual acontece com os vídeos locais
            onStateChange: (e) => {
              if (e.data === YT.PlayerState.ENDED) closeVideoLightbox();
            }
          }
        });
      }
    });
  }

  function stopYoutubeVideo() {
    if (ytPlayer && typeof ytPlayer.stopVideo === "function") {
      ytPlayer.stopVideo();
    }
  }

  function playCurrentVideo() {
    const video = currentVideoList[currentVideoIndex];
    if (!video) return;

    if (video.youtubeId) {
      // cutscene do YouTube: esconde o <video> local, mostra o player embutido
      videoLightboxPlayer.pause();
      videoLightboxPlayer.removeAttribute("src");
      videoLightboxPlayer.style.display = "none";
      videoLightboxYoutubeWrap.classList.add("visible");
      playYoutubeVideo(video.youtubeId);
    } else {
      // vídeo local: esconde o player do YouTube, mostra o <video>
      stopYoutubeVideo();
      videoLightboxYoutubeWrap.classList.remove("visible");
      videoLightboxPlayer.style.display = "";
      videoLightboxPlayer.src = video.src;
      videoLightboxPlayer.currentTime = 0;
      videoLightboxPlayer.play().catch(() => {});
    }
  }

  function showNextVideo() {
    if (!currentVideoList.length) return;
    currentVideoIndex = (currentVideoIndex + 1) % currentVideoList.length;
    playCurrentVideo();
  }

  function showPrevVideo() {
    if (!currentVideoList.length) return;
    currentVideoIndex = (currentVideoIndex - 1 + currentVideoList.length) % currentVideoList.length;
    playCurrentVideo();
  }

  videoGalleryCloseBtn.addEventListener("click", closeVideoGallery);
  videoLightboxCloseBtn.addEventListener("click", closeVideoLightbox);
  videoLightboxNextBtn.addEventListener("click", showNextVideo);
  videoLightboxPrevBtn.addEventListener("click", showPrevVideo);

  // quando o vídeo termina sozinho, volta pra grade (não passa pra próxima)
  videoLightboxPlayer.addEventListener("ended", closeVideoLightbox);

  // fecha clicando fora do vídeo (mas não nos controles/setas)
  videoLightboxOverlay.addEventListener("click", (e) => {
    if (e.target === videoLightboxOverlay) closeVideoLightbox();
  });

  // atalhos de teclado: setas pra navegar entre cutscenes, Esc pra fechar
  document.addEventListener("keydown", (e) => {
    if (videoLightboxOverlay.classList.contains("visible")) {
      if (e.key === "Escape") closeVideoLightbox();
      if (e.key === "ArrowRight") showNextVideo();
      if (e.key === "ArrowLeft") showPrevVideo();
    } else if (videoGalleryOverlay.classList.contains("visible")) {
      if (e.key === "Escape") closeVideoGallery();
    }
  });

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
