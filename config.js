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
    buttons    : lista de botões-imagem que levam para OUTRAS páginas
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

  Cada botão (de navegação ou de alternância) tem:
    image  : caminho da imagem do botão (assets/images/...)
    x      : posição horizontal em % da tela (0 = esquerda, 100 = direita)
    y      : posição vertical em % da tela (0 = topo, 100 = embaixo)
    width  : largura do botão em % da largura da tela (ex: 10 = 10%)
    target : (só nos botões de navegação) id da cena para onde ele leva

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
      { image: "assets/images/flags/holoska-flag.png", target: "pagina-7", x: 45, y: 10, width: 7}
    ]
  },

  "pagina-1": {
    variants: [
      { background: "assets/images/hubs/apotos-day-hub.png", music: "assets/audio/apotos-day.mp3" },
      { background: "assets/images/hubs/apotos-night-hub.png", music: "assets/audio/apotos-night.mp3" }
    ],
    toggleButton: { image: "assets/images/day-night-toggle.png", x: 90, y: 12, width: 8 },
    showClock: true,
    back: "inicio",
    buttons: []
  },

  "pagina-2": {
    variants: [
      { background: "assets/images/hubs/mazuri-day-hub.png", music: "assets/audio/mazuri-day.mp3" },
      { background: "assets/images/hubs/mazuri-night-hub.png", music: "assets/audio/mazuri-night.mp3" }
    ],
    toggleButton: { image: "assets/images/day-night-toggle.png", x: 90, y: 12, width: 8 },
    showClock: true,
    back: "inicio",
    buttons: []
  },

  "pagina-3": {
    variants: [
      { background: "assets/images/hubs/spagonia-day-hub.png", music: "assets/audio/spagonia-day.mp3" },
      { background: "assets/images/hubs/spagonia-night-hub.png", music: "assets/audio/spagonia-night.mp3" }
    ],
    toggleButton: { image: "assets/images/day-night-toggle.png", x: 90, y: 12, width: 8 },
    showClock: true,
    back: "inicio",
    buttons: []
  },

  "pagina-4": {
    variants: [
      { background: "assets/images/hubs/chun-nan-day-hub.png", music: "assets/audio/chun-nan-day.mp3" },
      { background: "assets/images/hubs/chun-nan-night-hub.png", music: "assets/audio/chun-nan-night.mp3" }
    ],
    toggleButton: { image: "assets/images/day-night-toggle.png", x: 90, y: 12, width: 8 },
    showClock: true,
    back: "inicio",
    buttons: []
  },

  "pagina-5": {
    variants: [
      { background: "assets/images/hubs/shamar-day-hub.png", music: "assets/audio/shamar-day.mp3" },
      { background: "assets/images/hubs/shamar-night-hub.png", music: "assets/audio/shamar-night.mp3" }
    ],
    toggleButton: { image: "assets/images/day-night-toggle.png", x: 90, y: 12, width: 8 },
    showClock: true,
    back: "inicio",
    buttons: []
  },

  "pagina-6": {
    variants: [
      { background: "assets/images/hubs/adabat-day-hub.png", music: "assets/audio/adabat-day.mp3" },
      { background: "assets/images/hubs/adabat-night-hub.png", music: "assets/audio/adabat-night.mp3" }
    ],
    toggleButton: { image: "assets/images/day-night-toggle.png", x: 90, y: 12, width: 8 },
    showClock: true,
    back: "inicio",
    buttons: []
  },

  "pagina-7": {
    variants: [
      { background: "assets/images/hubs/holoska-day-hub.png", music: "assets/audio/holoska-day.mp3" },
      { background: "assets/images/hubs/holoska-night-hub.png", music: "assets/audio/holoska-night.mp3" }
    ],
    toggleButton: { image: "assets/images/day-night-toggle.png", x: 90, y: 12, width: 8 },
    showClock: true,
    back: "inicio",
    buttons: []
  }

};
