/*
  CONFIG.JS
  =========
  Aqui você define TODAS as suas páginas ("cenas").
  Não precisa mexer no script.js nem no index.html — só neste arquivo.

  Cada cena tem:
    background : caminho da imagem de fundo (assets/images/...)
                 — só é usado se a cena NÃO tiver "variants"
    music      : caminho da música de fundo (assets/audio/...)
                 — só é usado se a cena NÃO tiver "variants"
    back       : (opcional) para qual cena o botão de "voltar" leva
    buttons    : lista de botões-imagem (navegação interna OU links externos)
    showClock  : (opcional) true para mostrar o relógio em tempo real
                 no canto superior esquerdo dessa página

    variants      : (opcional) lista de versões da mesma página, cada uma
                    com seu background + music. Ex: [dia, noite]. Quando
                    existe "variants", ele substitui "background"/"music".
    toggleButton  : (opcional, exige "variants") botão que troca a página
                    para a próxima variante da lista, sem navegar para
                    outra cena — a imagem de fundo e a música mudam com
                    fade, na mesma página. Ao clicar de novo, avança para
                    a variante seguinte (e volta ao início da lista depois
                    da última).

    character     : (opcional) uma imagem de personagem por cima do fundo
                    (ex: Tails, Amy). Não tem interação, é só visual/narrativo.
                      image : caminho da imagem (com fundo transparente)
                      x, y  : posição em % — aqui "y" marca onde os PÉS do
                              personagem tocam o chão (a imagem cresce pra
                              cima a partir desse ponto)
                      width : largura em % da largura da tela

    textbox       : (opcional) uma caixa de texto DE VERDADE (não é imagem),
                    então dá pra traduzir com o navegador (Google Tradutor,
                    etc) e usa a fonte Seurat Pro.
                      x, y  : x = centro horizontal em %, y = topo da caixa em %
                      width : largura da caixa em %
                      align : (opcional) "left" (padrão) / "center" / "right"
                      text  : lista de parágrafos (cada item vira um <p>)
                      logos : (opcional) lista de { image, width } mostrada
                              em linha, embaixo do texto (ex: logo da SEGA)

  Cada botão tem:
    image  : caminho da imagem do botão (assets/images/...)
    x      : posição horizontal em % da tela (0 = esquerda, 100 = direita)
    y      : posição vertical em % da tela (0 = topo, 100 = embaixo)
    width  : largura do botão em % da largura da tela (ex: 10 = 10%)

    E só UM dos dois abaixo:
    target : id de outra cena deste site — navega internamente, com fade
    href   : um link (ex: "https://github.com/seu-usuario/seu-repo") —
             abre em uma aba nova, sem sair do site. Use isso pra links
             externos como GitHub, redes sociais, etc.

  A cena inicial DEVE se chamar "inicio".

  Para adicionar uma cena nova, copie um bloco inteiro (do "nome-da-cena: {"
  até o "}," que fecha ele) e cole antes do fechamento do objeto "scenes".
*/

const scenes = {

  inicio: {
    background: "assets/images/hubworld.png",
    music: "assets/audio/menu.mp3",
    buttons: [
      { image: "assets/images/flags/apotos-flag.png", target: "pagina-1", x: 40, y: 50, width: 7 },
      { image: "assets/images/flags/mazuri-flag.png", target: "pagina-2", x: 55, y: 75, width: 7 },
      { image: "assets/images/flags/spagonia-flag.png", target: "pagina-3", x: 55, y: 30, width: 7 },
      { image: "assets/images/flags/chun-nan-flag.png", target: "pagina-4", x: 65, y: 50, width: 7 },
      { image: "assets/images/flags/shamar-flag.png", target: "pagina-5", x: 20, y: 50, width: 7 },
      { image: "assets/images/flags/adabat-flag.png", target: "pagina-6", x: 65, y: 75, width: 7 },
      { image: "assets/images/flags/holoska-flag.png", target: "pagina-7", x: 45, y: 12, width: 7},
      { image: "assets/images/UI_Buttons/sign-disclaimer.png", target: "disclaimer", x: 95, y: 90, width: 7},
      { image: "assets/images/UI_Buttons/github-icon.png", href: "https://github.com/BluetufieBugado/Unleashed-Radio", x: 5, y: 90, width: 6 }
    ]
  },

  "pagina-1": {
    variants: [
      { background: "assets/images/hubs/apotos-day-hub.png", music: "assets/audio/apotos-day.mp3" },
      { background: "assets/images/hubs/apotos-night-hub.png", music: "assets/audio/apotos-night.mp3" }
    ],
    toggleButton: { image: "assets/images/UI_Buttons/day-night-toggle.png", x: 90, y: 12, width: 10 },
    showClock: true,
    back: "inicio",
    buttons: []
  },

  "pagina-2": {
    variants: [
      { background: "assets/images/hubs/mazuri-day-hub.png", music: "assets/audio/mazuri-day.mp3" },
      { background: "assets/images/hubs/mazuri-night-hub.png", music: "assets/audio/mazuri-night.mp3" }
    ],
    toggleButton: { image: "assets/images/UI_Buttons/day-night-toggle.png", x: 90, y: 12, width: 10 },
    showClock: true,
    back: "inicio",
    buttons: []
  },

  "pagina-3": {
    variants: [
      { background: "assets/images/hubs/spagonia-day-hub.png", music: "assets/audio/spagonia-day.mp3" },
      { background: "assets/images/hubs/spagonia-night-hub.png", music: "assets/audio/spagonia-night.mp3" }
    ],
    toggleButton: { image: "assets/images/UI_Buttons/day-night-toggle.png", x: 90, y: 12, width: 10 },
    showClock: true,
    back: "inicio",
    buttons: [
      { image: "assets/images/UI_Buttons/library-icon.png", target: "biblioteca-spagonia", x: 90, y: 40, width: 15 },
    ],
    textbox: {
      x: 90,
      y: 31,
      width: 20,
      align: "center",
      text: ["Laboratório"]
    }
  },

  "pagina-4": {
    variants: [
      { background: "assets/images/hubs/chun-nan-day-hub.png", music: "assets/audio/chun-nan-day.mp3" },
      { background: "assets/images/hubs/chun-nan-night-hub.png", music: "assets/audio/chun-nan-night.mp3" }
    ],
    toggleButton: { image: "assets/images/UI_Buttons/day-night-toggle.png", x: 90, y: 12, width: 10 },
    showClock: true,
    back: "inicio",
    buttons: []
  },

  "pagina-5": {
    variants: [
      { background: "assets/images/hubs/shamar-day-hub.png", music: "assets/audio/shamar-day.mp3" },
      { background: "assets/images/hubs/shamar-night-hub.png", music: "assets/audio/shamar-night.mp3" }
    ],
    toggleButton: { image: "assets/images/UI_Buttons/day-night-toggle.png", x: 90, y: 12, width: 10 },
    showClock: true,
    back: "inicio",
    buttons: []
  },

  "pagina-6": {
    variants: [
      { background: "assets/images/hubs/adabat-day-hub.png", music: "assets/audio/adabat-day.mp3" },
      { background: "assets/images/hubs/adabat-night-hub.png", music: "assets/audio/adabat-night.mp3" }
    ],
    toggleButton: { image: "assets/images/UI_Buttons/day-night-toggle.png", x: 90, y: 12, width: 10 },
    showClock: true,
    back: "inicio",
    buttons: []
  },

  "pagina-7": {
    variants: [
      { background: "assets/images/hubs/holoska-day-hub.png", music: "assets/audio/holoska-day.mp3" },
      { background: "assets/images/hubs/holoska-night-hub.png", music: "assets/audio/holoska-night.mp3" }
    ],
    toggleButton: { image: "assets/images/UI_Buttons/day-night-toggle.png", x: 90, y: 12, width: 10 },
    showClock: true,
    back: "inicio",
    buttons: []
  },
  "biblioteca-spagonia": {
    background: "assets/images/cenários/pickle-lab-full.png",
    music: "assets/audio/world-adventure-piano.mp3",
    showClock: false,
    back: "pagina-3",
    buttons: [
      { image: "assets/images/UI_Buttons/gallery-icon.png", gallery: "artes-conceituais-spagonia", x: 36, y: 40, width: 8 },
      { image: "assets/images/UI_Buttons/music-player-icon.png", player: "trilha-sonic-unleashed", x: 90, y: 55, width: 8 },
      { image: "assets/images/UI_Buttons/movie-icon.png", videoGallery: "cutscenes-sonic-unleashed", x: 75, y: 50, width: 8 }
    ]
  },

  "disclaimer": {
    background: "assets/images/disclaimer-bg-unleashedradio.png",
    music: "assets/audio/world-adventure-piano.mp3",
    showClock: false,
    back: "inicio",
    buttons: [],
    character: {
      image: "assets/images/tails-talk-sprite.png",
      x: 30,
      y: 101,
      width: 38
    },
    textbox: {
      x: 84,
      y: 6,
      width: 27,
      text: [
        "O intuito deste site não é em hipótese alguma se passar por algo oficial ou roubar a marca Sonic.",
        "Este é um projeto de fan para fans, voltado com o intuito de criar um espaço virtual coletivo, para ouvir as músicas de Sonic Unleashed e explorar outras mídias do jogo.",
        "Todos os direitos das faixas, imagens e personagens são reservados a:"
      ],
      logos: [
        { image: "assets/images/logos/sega-logo.png", width: 60 },
        { image: "assets/images/logos/sonicteam-logo.png", width: 60 }
        // depois que você tiver os arquivos, é só descomentar e ajustar:
        // { image: "assets/images/logos/sega-logo.png", width: 40 },
        // { image: "assets/images/logos/sonicteam-logo.png", width: 40 }
      ]
    }
  }

};

/*
  GALLERIES
  =========
  Cada galeria tem:
    title  : título mostrado no topo da galeria
    images : lista de caminhos de imagem (assets/images/...) — a ordem
             aqui é a mesma ordem usada nas setas de navegação da tela cheia

  Um botão em qualquer cena abre uma galeria usando "gallery" (em vez de
  "target" ou "href"), ex:
    { image: "...", gallery: "id-da-galeria", x: 50, y: 50, width: 10 }
*/

const galleries = {

  "artes-conceituais-spagonia": {
    title: "Artes Conceituais",
    images: [
      "assets/images/gallery/1.png",
      "assets/images/gallery/2.png",
      "assets/images/gallery/3.png",
      "assets/images/gallery/4.png",
      "assets/images/gallery/5.png",
      "assets/images/gallery/6.png",
      "assets/images/gallery/7.png",
      "assets/images/gallery/8.png",
      "assets/images/gallery/9.png",
      "assets/images/gallery/10.png",
      "assets/images/gallery/11.png",
      "assets/images/gallery/12.png",
      "assets/images/gallery/13.png",
      "assets/images/gallery/14.png",
      "assets/images/gallery/15.png",
      "assets/images/gallery/16.png",
      "assets/images/gallery/17.png",
      "assets/images/gallery/18.png",
      "assets/images/gallery/19.png",
      "assets/images/gallery/20.png",
      "assets/images/gallery/21.png",
      "assets/images/gallery/22.png",
      "assets/images/gallery/23.png",
      "assets/images/gallery/24.png",
      "assets/images/gallery/25.png",
      "assets/images/gallery/26.png",
      "assets/images/gallery/27.png",
      "assets/images/gallery/28.png",
      "assets/images/gallery/29.png",
      "assets/images/gallery/30.png",
      "assets/images/gallery/31.png",
      "assets/images/gallery/32.png",
      "assets/images/gallery/33.png",
      "assets/images/gallery/34.png",
      "assets/images/gallery/35.png",
      "assets/images/gallery/36.png",
      "assets/images/gallery/37.png",
      "assets/images/gallery/38.png",
      "assets/images/gallery/39.png",
      "assets/images/gallery/40.png",
      "assets/images/gallery/41.png",
      "assets/images/gallery/42.png",
      "assets/images/gallery/43.png",
      "assets/images/gallery/44.png",
      "assets/images/gallery/45.png",
      "assets/images/gallery/46.png",
      "assets/images/gallery/47.png",
      "assets/images/gallery/48.png",
      "assets/images/gallery/49.png",
      "assets/images/gallery/50.png",
      "assets/images/gallery/51.png",
      "assets/images/gallery/52.png",
      "assets/images/gallery/53.png",
      "assets/images/gallery/54.png",
      "assets/images/gallery/55.png",
      "assets/images/gallery/56.png",
      "assets/images/gallery/57.png",
      "assets/images/gallery/58.png",
      "assets/images/gallery/59.png",
      "assets/images/gallery/60.png",
      "assets/images/gallery/61.png",
      "assets/images/gallery/62.png",
      "assets/images/gallery/63.png",
      "assets/images/gallery/64.png",
      "assets/images/gallery/65.png",
      "assets/images/gallery/66.png",
      "assets/images/gallery/67.png",
      "assets/images/gallery/68.png",
      "assets/images/gallery/69.png",
      "assets/images/gallery/70.png",
      "assets/images/gallery/71.png",
      "assets/images/gallery/72.png",
      "assets/images/gallery/73.png",
      "assets/images/gallery/74.png",
      "assets/images/gallery/75.png",
      "assets/images/gallery/76.png",
      "assets/images/gallery/77.png",
      "assets/images/gallery/78.png",
      "assets/images/gallery/79.png",
      "assets/images/gallery/80.png",
      "assets/images/gallery/81.png",
      "assets/images/gallery/82.png",
      "assets/images/gallery/83.png",
      "assets/images/gallery/84.png",
      "assets/images/gallery/85.png",
      "assets/images/gallery/86.png",
      "assets/images/gallery/87.png",
      "assets/images/gallery/88.png",
      "assets/images/gallery/89.png",
      "assets/images/gallery/90.png",
      "assets/images/gallery/91.png",
      "assets/images/gallery/92.png",
      "assets/images/gallery/93.png",
      "assets/images/gallery/94.png",
      "assets/images/gallery/95.png",
      "assets/images/gallery/96.png"
      // adicione quantas imagens quiser, seguindo o mesmo formato
    ]
  }

};

/*
  MUSIC PLAYERS
  =============
  Cada player tem:
    title  : (opcional, não aparece na tela hoje, é só organizacional)
    tracks : lista de faixas, cada uma com:
               title  : nome da música
               region : região/mundo da música (ex: "Apotos - Dia")
               cover  : imagem de capa mostrada no player (assets/images/...)
               src    : caminho do arquivo de áudio (assets/audio/...)

  A ordem da lista é a ordem usada pelas setas de next/prev.

  Um botão em qualquer cena abre um player usando "player" (em vez de
  "target", "href" ou "gallery"), ex:
    { image: "...", player: "id-do-player", x: 50, y: 50, width: 10 }
*/

const musicPlayers = {

  "trilha-sonic-unleashed": {
    title: "Sonic Unleashed - Trilha Sonora Completa",
    tracks: [
      // troque os nomes -PLACEHOLDER pelos arquivos reais e ajuste
      // title/region de cada faixa. Copie o bloco quantas vezes precisar.
      { title: "Endless Possibility", region: "Tema Principal", cover: "assets/images/albums/main-theme.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/audio/tracks/101 - Tomoya Ohtani, Jaret Reddick - Endless Possibility (Vocal Theme).mp3" },
      { title: "Tema Principal", region: "Tela de Titulo e Mapa mundial", cover: "assets/images/albums/world-adventure-theme.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/audio/tracks/201a - Takahito Eguchi, Tomoya Ohtani, Tokyo Philharmonic Orchestra - The World Adventure.mp3" },
      { title: "Super Sonic vs. Perfect Dark Gaia", region: "Batalha Final", cover: "assets/images/albums/super-sonic-vs-dark-gaia.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/audio/tracks/325 - Tomoya Ohtani - Super Sonic vs. Perfect Dark Gaia.mp3" },
      { title: "Dear My Friend", region: "Tema de Encerramento", cover: "assets/images/albums/dear-my-friend.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/audio/tracks/330 - Mariko Nanba, Candie Y, Takahito Eguchi, Brent Cash - Dear My Friend (Ending Theme).mp3" },
      
      
      { title: "Windmill Isle (Day - Act 2)", region: "Apotos", cover: "assets/images/albums/windmill-isle-day.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/audio/tracks/105c - Tomoya Ohtani - Windmill Isle (Day - Act 2).mp3" },
      { title: "Windmill Isle (Night)", region: "Apotos", cover: "assets/images/albums/windmill-isle-night.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/audio/tracks/109 - Fumie Kumatani - Windmill Isle (Night).mp3" },
      
      { title: "Savannah Citadel (Night)", region: "Mazuri", cover: "assets/images/albums/savannah-citadel-night.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/audio/tracks/115 - Fumie Kumatani - Savannah Citadel (Night).mp3" },
      { title: "Savannah Citadel (Day)", region: "Mazuri", cover: "assets/images/albums/savannah-citadel-day.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/audio/tracks/121a - Tomoya Ohtani - Savannah Citadel (Day).mp3" },
      
      { title: "Cool Edge (Day)", region: "Holoska", cover: "assets/images/albums/cool-edge-day.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/audio/tracks/128a - Tomoya Ohtani - Cool Edge (Day).mp3" },
      { title: "Cool Edge (Night)", region: "Holoska", cover: "assets/images/albums/cool-edge-night.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/audio/tracks/214 - Fumie Kumatani - Cool Edge (Night).mp3" },
      
      { title: "Rooftop Run (Night)", region: "Spagonia", cover: "assets/images/albums/rooftop-run-night.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/audio/tracks/131 - Tomoya Ohtani - Rooftop Run (Night).mp3" },
      { title: "Rooftop Run (Day)", region: "Spagonia", cover: "assets/images/albums/rooftop-run-day.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/audio/tracks/208a - Tomoya Ohtani - Rooftop Run (Day).mp3" },
      
      { title: "Dragon Road (Night)", region: "Chun-nan", cover: "assets/images/albums/dragon-road-night.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/audio/tracks/205 - Kenichi Tokoi - Dragon Road (Night).mp3" },
      { title: "Dragon Road (Day)", region: "Chun-nan", cover: "assets/images/albums/dragon-road-day.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/audio/tracks/211a - Kenichi Tokoi - Dragon Road (Day).mp3" },

      { title: "Arid Sands (Day)", region: "Shamar", cover: "assets/images/albums/arid-sands-day.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/audio/tracks/217a - Tomoya Ohtani - Arid Sands (Day).mp3" },
      { title: "Arid Sands (Night)", region: "Shamar", cover: "assets/images/albums/arid-sands-night.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/audio/tracks/223 - Kenichi Tokoi - Arid Sands (Night).mp3" },

      { title: "Jungle Joyride (Night)", region: "Adabat", cover: "assets/images/albums/jungle-joyride-night.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/audio/tracks/304 - Kenichi Tokoi - Jungle Joyride (Night).mp3" },
      { title: "Jungle Joyride (Day)", region: "Adabat", cover: "assets/images/albums/jungle-joyride-day.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/audio/tracks/306a - Tomoya Ohtani - Jungle Joyride (Day).mp3" }
      // adicione as faixas de chefes, cutscenes musicais, etc. do mesmo jeito
    ]
  }

};

/*
  VIDEO GALLERIES
  ===============
  Cada galeria tem:
    title  : título mostrado no topo da grade
    videos : lista de vídeos, cada um com:
               title     : nome da cutscene, aparece embaixo da miniatura
               thumbnail : imagem de capa do vídeo (assets/images/...)
                           — se você usar "src" e não informar
                           "thumbnail", a miniatura oficial do vídeo no
                           YouTube é usada automaticamente
               src       : caminho de um arquivo de vídeo LOCAL
                           (assets/video/...) — use isso OU "src",
                           nunca os dois juntos
               src : id do vídeo do YouTube, em vez de um vídeo
                           local — abre um player embutido do YouTube.
                           É a parte depois de "v=" no link do vídeo, ex:
                           em youtube.com/watch?v=dQw4w9WgXcQ o id é
                           "dQw4w9WgXcQ"

                           IMPORTANTE: cutscenes do YouTube podem exibir
                           anúncios (antes ou durante o vídeo) — isso é
                           controlado pelo YouTube e por quem postou o
                           vídeo, o site não tem como evitar ou desligar.

  A ordem da lista é a ordem usada pelas setas de anterior/próxima dentro
  do vídeo.

  Um botão em qualquer cena abre uma galeria de vídeos usando "videoGallery"
  (em vez de "target", "href", "gallery" ou "player"), ex:
    { image: "...", videoGallery: "id-da-galeria", x: 50, y: 50, width: 10 }
*/

const videoGalleries = {

  "cutscenes-sonic-unleashed": {
    title: "Cutscenes",
    videos: [
      // troque os nomes -PLACEHOLDER pelos arquivos reais e ajuste o
      // "title" de cada cutscene. Copie o bloco quantas vezes precisar.
     // { title: "Abertura (PLACEHOLDER)", thumbnail: "assets/images/cutscene-thumbs/abertura-PLACEHOLDER.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/video/abertura-PLACEHOLDER.mp4" },

      // exemplo usando um vídeo do YouTube em vez de arquivo local — troque
      // "SUBSTITUA_PELO_ID_DO_VIDEO" pelo id de um vídeo real, e pode até
      // remover a linha "thumbnail" (a capa do YouTube entra sozinha)
      { title: "Cena Inicial - Abertura", thumbnail: "assets/images/cutscene-thumbs/abertura.png", src: "https://dn710005.ca.archive.org/0/items/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2301%29%20Opening.mp4" },
      { title: "Uma Nova Jornada", thumbnail: "assets/images/cutscene-thumbs/nova-jornada.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2302%29%20A%20New%20Journey.mp4" },
      { title: "Sundae Especial", thumbnail: "assets/images/cutscene-thumbs/sundae.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2303%29%20Special%20Sundae.mp4" },
      { title: "A Primeira Noite", thumbnail: "assets/images/cutscene-thumbs/primeira-noite.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2304%29%20The%20First%20Night.mp4" },
      { title: "Tails com Problemas!", thumbnail: "assets/images/cutscene-thumbs/tails-trouble.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2305%29%20Tails%20in%20Trouble%21.mp4" },
      { title: "Para Spagonia!", thumbnail: "assets/images/cutscene-thumbs/to-spagonia.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2306%29%20To%20Spagonia%21.mp4" },
      { title: "Sequestrado", thumbnail: "assets/images/cutscene-thumbs/sequestrado.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2307%29%20Kidnapped.mp4" },
      { title: "Como Sempre", thumbnail: "assets/images/cutscene-thumbs/como-sempre.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2308%29%20Same%20as%20Ever.mp4" },
      { title: "Manuscritos de Gaia", thumbnail: "assets/images/cutscene-thumbs/manuscritos.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2309%29%20Gaia%20Manuscripts.mp4" },
      { title: "Eggman Outra Vez", thumbnail: "assets/images/cutscene-thumbs/eggman-outravez.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2310%29%20Eggman%20Again.mp4" },
      { title: "O Egg Besouro", thumbnail: "assets/images/cutscene-thumbs/eggbesouro.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2311%29%20The%20Egg%20Beetle.mp4" },
      { title: "A Entrada do Templo", thumbnail: "assets/images/cutscene-thumbs/entrada-do-templo.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2312%29%20Temple%20Entrance.mp4" },
      { title: "Templo Ativado!", thumbnail: "assets/images/cutscene-thumbs/templo-ativado.png", src: "https://dn710005.ca.archive.org/0/items/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2313%29%20Temple%20Activated%21.mp4" },
      { title: "O Relatório de Tails", thumbnail: "assets/images/cutscene-thumbs/relatório-de-tails.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2315%29%20Tails%27%20Report.mp4" },
      { title: "O Erro de Amy", thumbnail: "assets/images/cutscene-thumbs/erro-de-amy.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2316%29%20Amy%27s%20Mistake.mp4" },
      { title: "A Dança da Meia Noite", thumbnail: "assets/images/cutscene-thumbs/dança-da-meianoite.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2317%29%20Midnight%20Dance.mp4" },
      { title: "O Resgate de Amy", thumbnail: "assets/images/cutscene-thumbs/resgate-de-amy.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2318%29%20Rescuing%20Amy.mp4" },
      { title: "A Besta Divina", thumbnail: "assets/images/cutscene-thumbs/besta-divina.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2319%29%20The%20Divine%20Beast.mp4" },
      { title: "De Volta ao Normal", thumbnail: "assets/images/cutscene-thumbs/volta-ao-normal.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2322%29%20Back%20to%20Normal.mp4" },
      { title: "A Ideia de Eggman", thumbnail: "assets/images/cutscene-thumbs/ideia-de-eggman.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2323%29%20Eggman%27s%20Idea.mp4" },
      { title: "Projeto Dark Gaia", thumbnail: "assets/images/cutscene-thumbs/projeto-darkgaia.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2328%29%20Project%20Dark%20Gaia.mp4" },
      { title: "Templo de Adabat", thumbnail: "assets/images/cutscene-thumbs/templo-de-adabat.png", src: "https://dn710005.ca.archive.org/0/items/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2330%29%20Chip%27s%20Change%282%29.mp4" },
      { title: "A Mudança de Chip", thumbnail: "assets/images/cutscene-thumbs/mudança-de-chip.png", src: "https://dn710005.ca.archive.org/0/items/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2331%29%20Chip%27s%20Memories.mp4" },
      { title: "As Memórias de Chip", thumbnail: "assets/images/cutscene-thumbs/memórias-de-chip.png", src: "https://dn710005.ca.archive.org/0/items/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2332%29%20No%20Reason.mp4" },
      { title: "Eggmanland", thumbnail: "assets/images/cutscene-thumbs/eggmanland.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2333%29%20Eggmanland.mp4" },
      { title: "Parabéns", thumbnail: "assets/images/cutscene-thumbs/parabéns.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2336%29%20Congratulations.mp4" },
      { title: "A Mensagem de Pickle", thumbnail: "assets/images/cutscene-thumbs/mensagem.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2337%29%20Pickle%27s%20Message.mp4" },
      { title: "O Egg Dragão", thumbnail: "assets/images/cutscene-thumbs/eggdragão.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2338%29%20The%20Egg%20Dragoon.mp4" },
      { title: "O Fim do Mundo", thumbnail: "assets/images/cutscene-thumbs/fim-do-mundo.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2339%29%20Planet%27s%20End.mp4" },
      { title: "Dark Gaia Surge", thumbnail: "assets/images/cutscene-thumbs/dark-gaia-surge.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2340%29%20Dark%20Gaia%20Appears.mp4" },
      { title: "A Hora do Despertar", thumbnail: "assets/images/cutscene-thumbs/despertar.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2342%29%20Hour%20of%20Awakening.mp4" },
      { title: "Esperança e Desespero", thumbnail: "assets/images/cutscene-thumbs/esperança-desespero.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2347%29%20Hope%20and%20Despair.mp4" },
      { title: "A Forma Final", thumbnail: "assets/images/cutscene-thumbs/forma-final.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2348%29%20The%20Final%20Form.mp4" },
      { title: "Guarde o Discurso", thumbnail: "assets/images/cutscene-thumbs/discurso.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2354%29%20Save%20the%20Speech%21.mp4" },
      { title: "Para a Superficie", thumbnail: "assets/images/cutscene-thumbs/superficie.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2355%29%20To%20the%20Surface.mp4" },
      { title: "Sempre", thumbnail: "assets/images/cutscene-thumbs/sempre.png", src: "https://archive.org/download/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2356%29%20Always.mp4" },
      { title: "Tente de novo", thumbnail: "assets/images/cutscene-thumbs/tente-de-novo.png", src: "https://dn710005.ca.archive.org/0/items/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2353%29%20Begin%20Anew.mp4" },
      { title: "Sonic E Chip em Chun-nan", thumbnail: "assets/images/cutscene-thumbs/chip-em-chun-nan.png", src: "https://dn710005.ca.archive.org/0/items/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2357%29%20Sonic%20and%20Chip%20%28in%20Chun-Nan%29.mp4" },
      { title: "Sonic e Chip em Adabat", thumbnail: "assets/images/cutscene-thumbs/chip-em-adabat.png", src: "https://dn710005.ca.archive.org/0/items/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2359%29%20Sonic%20and%20Chip%20%28in%20Adabat%29.mp4" },
      { title: "Sonic e Chip em Holoska", thumbnail: "assets/images/cutscene-thumbs/chip-em-holoska.png", src: "https://dn710005.ca.archive.org/0/items/sonic-unleashed-english-cutscenes/Sonic%20Unleashed%20English%20Cutscenes/%28Sonic%20Unleashed%29%20English%20%2358%29%20Sonic%20and%20Chip%20%28In%20Holoska%29.mp4" }

     // { title: "Final do Jogo (PLACEHOLDER)", thumbnail: "assets/images/cutscene-thumbs/final-PLACEHOLDER.png", thumbnail: "assets/images/cutscene-thumbs/werehog.png", src: "assets/video/final-PLACEHOLDER.mp4" }
      // adicione quantas cutscenes quiser, seguindo o mesmo formato
    ]
  }

};
