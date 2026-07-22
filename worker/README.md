# Como colocar o contador de presença no ar (Cloudflare Worker + D1)

Isso substitui o Firebase. É gratuito, sem limite de conexões simultâneas —
o que importa aqui é quantidade de requisições por dia, e pro seu site isso
está bem longe de virar problema.

Existem dois jeitos de fazer o deploy: **pelo painel do navegador** (mais
simples, sem instalar nada) ou **por linha de comando** (mais rápido se você
já mexe com terminal). Escolha um dos dois — não precisa fazer os dois.

---

## Opção A — Pelo painel (recomendado se você nunca usou Cloudflare)

### 1. Criar a conta
Acesse **dash.cloudflare.com** e crie uma conta gratuita (não pede cartão).

### 2. Criar o banco de dados (D1)
No menu lateral, vá em **Workers & Pages → D1 SQL Database → Create database**.
Dê o nome `unleashed-radio-presence` e crie.

Depois de criado, clique no banco, vá na aba **Console** (ou "Query") e cole
o conteúdo do arquivo `schema.sql` que está aqui na pasta. Execute.

### 3. Criar o Worker
No menu lateral, vá em **Workers & Pages → Create → Create Worker**. Dê
qualquer nome (ex: `unleashed-radio-presence`) e crie.

Depois de criado, clique em **Edit code** (ou "Quick edit"). Apague o
código de exemplo que já vem lá, e cole o conteúdo do arquivo
`worker/src/index.js` no lugar. Clique em **Deploy** (ou "Save and deploy").

### 4. Conectar o Worker ao banco de dados
Ainda na página do seu Worker, vá em **Settings → Bindings → Add binding**.
Escolha o tipo **D1 Database**, e em:
- **Variable name**: digite `DB` (exatamente assim, maiúsculo — o código
  espera esse nome)
- **D1 Database**: selecione `unleashed-radio-presence`

Salve.

### 5. (Opcional, mas recomendado) Ativar a limpeza automática
Em **Settings → Triggers → Cron Triggers → Add Cron Trigger**, adicione:
```
0 * * * *
```
Isso roda a limpeza de sessões antigas 1 vez por hora, mantendo o banco
sempre pequeno e rápido.

### 6. Pegar a URL do Worker
No topo da página do Worker, vai aparecer uma URL parecida com:
```
https://unleashed-radio-presence.seu-usuario.workers.dev
```
Copie ela.

---

## Opção B — Por linha de comando (Wrangler CLI)

Requer Node.js instalado.

```bash
npm install -g wrangler
wrangler login
cd worker
wrangler d1 create unleashed-radio-presence
```

O comando acima vai imprimir um `database_id` — copie ele e cole no
`wrangler.toml`, no lugar de `COLOQUE_AQUI_O_ID_DO_BANCO`.

```bash
wrangler d1 execute unleashed-radio-presence --file=./schema.sql --remote
wrangler deploy
```

O último comando mostra a URL do seu Worker no final.

---

## Por fim, em ambas as opções

Abra o `script.js` do site (não o da pasta `worker/`) e troque esta linha:

```js
const PRESENCE_API = "https://COLOQUE_AQUI.workers.dev";
```

Pela URL real que você copiou. Pronto — o contador volta a funcionar,
agora sem o limite de 100 pessoas simultâneas do Firebase.

## Testando

Abra o site, entre em qualquer página com contador. Em até 20 segundos o
número deve virar 1. Abra a mesma página em outra aba/celular e, também em
até 20 segundos, deve virar 2.

## Uma nota sobre o Firebase antigo

Se você já tinha configurado o Firebase antes, pode deixar aquele projeto
lá sem problema (ele simplesmente vai parar de receber dados), ou excluir
pelo console do Firebase se preferir não deixar nada rodando à toa — a
escolha é sua, nenhuma das duas opções afeta o site novo.
