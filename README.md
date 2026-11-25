# EcoStats

Angular 20 + Angular Material na frente, Express com arquivo JSON atrás. Entrega: 25/11/2026. O logo do site fica em `cs2-panel/src/logo/Logo_EcoStats.png`.

É um ranking de CS2 com Home, stats, times e formulários. Tudo grava nos JSON do backend, então não some quando fecha o navegador.

## Como rodar

Abre dois terminais. No PowerShell usa `npm.cmd`, nunca `npm`.

```bash
# terminal 1
cd backend
npm.cmd install
npm.cmd start
```

```bash
# terminal 2
cd cs2-panel
npm.cmd install
npm.cmd start -- --host 0.0.0.0
```

Acessa `http://localhost:4200`. O backend fica na 3000. Se der erro de script no PowerShell, roda `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` uma vez.

## Como as coisas funcionam

- `/home`: mostra o jogador com maior `KD × √mapas` e dois destaques de time (mais kills e maior média). Time sem jogador não aparece.
- `/stats`: ranking ordenado pelo maior K/D. Busca por nick ou time, filtro por função, Desfazer visível e Reset escondido em "Opções avançadas".
- `/jogador/:id`: ficha simples com mapas, kills, deaths e K/D.
- `/novo` e `/editar/:id`: cadastro de jogador. O select de Time mostra "Sem time" e só os times com vaga (máximo 5). Na edição, o time atual continua aparecendo mesmo cheio.
- `/times`: lista dos times. Cadastro de time pede só nome e coach. Editar time também mexe só nisso.

O vínculo fica no jogador, no campo `timeId`. Se ele estiver `null`, a tabela mostra "Sem time". Não existe mais texto de time solto no jogador, nem array de jogadores dentro do time.

Jogador em time não apaga: primeiro tira ele do time no formulário. Apagar um time libera todo mundo e o Desfazer recupera os dois bancos juntos.

## Fórmula

`KD = kills / deaths` (se deaths for 0, usa kills).

`pontuação = KD × √mapas`. Empate: maior KD, depois mais mapas, depois mais kills.

## Bancos

- `backend/jogadores.json`: começa `[]`. Não tem jogador pré-cadastrado; o primeiro aparece quando você cadastra.
- `backend/times.json`: começa `[]`. Cada time criado é só `{ "id", "nome", "coach" }`.

O Reset também zera os dois bancos. Não volta nenhum jogador de exemplo.

Backups (`*-anterior.json`) e o marcador `ultima-alteracao.txt` são do Desfazer e ficam fora do Git.

## Comentários

Todo `.ts`, `.js`, `.html` e `.css` tem um comentário em português a cada 5 linhas. É bem solto, estilo "aconteceu isso aqui", nada de explicação de manual. JSON e README ficam de fora.

## Subindo

```bash
git add .
git commit -m "Remove jogadores iniciais e ajusta Reset"
git push origin main
```

Repo: `https://github.com/zMuriloDevs/Proj_Angular_College.git`, branch `main`, conta `zMuriloDevs`. `gh` não está instalado, usa o Git normal.
