# Como usar este site

Este é um site simples de páginas encadeadas: cada página tem uma imagem de
fundo, uma música de fundo, e botões (também em forma de imagem) que levam a
outras páginas. Não há nenhum texto na interface — só imagens.

O projeto já vem com imagens de exemplo (formas coloridas simples) para você
ver funcionando antes de trocar pelos seus arquivos.

## Como testar agora

Abra o arquivo `index.html` clicando duas vezes nele (funciona direto no
navegador, sem precisar de servidor). Clique no botão de "play" no centro da
tela para começar — os navegadores exigem um clique antes de tocar áudio
automaticamente.

## Como colocar suas próprias imagens e músicas

1. Coloque suas imagens dentro de `assets/images/`
2. Coloque suas músicas dentro de `assets/audio/` (formato `.mp3` é o mais
   compatível)
3. Abra o arquivo `config.js` e troque os nomes dos arquivos de exemplo pelos
   nomes dos seus arquivos. Por exemplo:

```js
inicio: {
  background: "assets/images/minha-imagem-inicial.jpg",
  music: "assets/audio/minha-musica-inicial.mp3",
  buttons: [
    { image: "assets/images/meu-botao-1.png", target: "pagina-1", x: 20, y: 65, width: 11 },
  ]
}
```

## Como adicionar mais páginas

O projeto já vem com 5 páginas de exemplo (`pagina-1` até `pagina-5`), mas
você pode ter quantas quiser. No arquivo `config.js`, copie um bloco inteiro
como este:

```js
"pagina-6": {
  background: "assets/images/pagina-6-fundo.jpg",
  music: "assets/audio/pagina-6-musica.mp3",
  back: "inicio",
  buttons: []
},
```

E cole antes do `}` final que fecha o objeto `scenes`. Depois, em qualquer
outra página, adicione um botão com `target: "pagina-6"` para poder chegar
até ela.

## Sobre os botões

Cada botão é definido assim:

```js
{ image: "assets/images/botao.png", target: "nome-da-cena", x: 20, y: 65, width: 11 }
```

- `x` e `y` = posição do botão na tela, em porcentagem (0 a 100)
- `width` = tamanho do botão, em porcentagem da largura da tela
- `target` = para qual página o clique leva

Ajuste os números e recarregue a página para ver o botão se mover.

## Sobre o botão de "voltar"

Cada página pode ter uma propriedade `back` apontando para outra cena — isso
faz aparecer uma pequena seta no canto inferior esquerdo. Se você não quiser
esse botão em alguma página, é só remover a linha `back: "..."` daquele
bloco.

## Sobre as músicas

Ao trocar de página, a música anterior desaparece suavemente (fade out)
enquanto a nova música surge (fade in). Se duas páginas usarem exatamente o
mesmo arquivo de música, ela continua tocando sem reiniciar.

## Publicando o site

Depois de trocar pelos seus arquivos, você pode publicar esta pasta em
qualquer serviço de hospedagem gratuita de sites estáticos (por exemplo,
GitHub Pages, Netlify ou Vercel) — é só enviar a pasta inteira.
