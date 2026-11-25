# Painel de Estatísticas de Counter-Strike 2 (CS2)

Trabalho individual de graduação — entrega: **25/11/2026**.

Projeto simples feito com **Angular 20 + Angular Material** no front e **Node.js + Express + arquivo JSON** no back. A ideia é parecer com o HLTV: uma Home com destaques, um ranking de jogadores com busca e filtro, times com 5 jogadores e 1 coach, e CRUD completo com persistência real.

---

## 1. O que o projeto faz

- **`/home` (página inicial):** mostra o **Jogador Destaque** e dois destaques de time separados: **mais kills** e **maior média de pontuação**.
- **`/stats`:** ranking estilo HLTV com colunas **# (posição), Jogador, Time, Função, Mapas, Kills, Deaths e K/D**. Ordena pelo maior K/D.
- **Busca:** digite o nick **ou** o time; a tabela é filtrada na hora.
- **Filtro de função:** `Todos`, `AWPer`, `Rifler`, `IGL` ou `Entry` (campo com `mat-select`).
- **`/jogador/:id`:** ficha/detalhe do jogador com todos os números e botões de editar, excluir e voltar.
- **`/novo` e `/editar/:id`:** formulário para criar e alterar jogadores (mesmo componente, muda conforme a URL).
- **`/times`:** lista dos times cadastrados, com nome, coach e os 5 jogadores.
- **`/time/novo` e `/time/editar/:id`:** formulário de time com 5 selects de jogadores e 1 campo de coach.
- **Desfazer:** botão visível no ranking que volta à última alteração (jogadores ou times).
- **Reset:** fica escondido dentro de `<details>` com o título **Opções avançadas**. Ele volta aos 5 jogadores iniciais e apaga os times.
- **Persistência real:** tudo é gravado em `backend/jogadores.json` e `backend/times.json`, então não some ao fechar o navegador.

Campos de cada jogador: `nickname`, `funcao`, `time`, `mapas`, `kills` e `deaths` (o `id` é criado pelo backend; `posicao` é só para mostrar o `#` na tabela e não é salvo).

Campos de cada time: `nome`, `coach` e `jogadores` (um array com exatamente 5 ids de jogadores).

> Um jogador que pertence a algum time **não pode ser excluído**. O backend bloqueia o DELETE e o front mostra o aviso.

---

## 2. Como os destaques são calculados

Todos os cálculos usam o mesmo K/D:

```text
KD = kills / deaths
(se deaths for 0, usamos kills para não dividir por zero)
```

### Jogador Destaque

```text
pontuação = KD × √mapas
```

Quem tiver a maior pontuação aparece no card principal da Home. Empate é resolvido assim:

1. maior KD;
2. maior número de mapas;
3. maior número de kills.

Com os 5 jogadores iniciais, o destaque é **s1mple**: `1,90 × √42 ≈ 12,41`.

### Times em destaque

A Home mostra **dois cards separados**:

| Destaque | Critério | Desempate |
| -------- | -------- | --------- |
| Time com mais kills | soma dos kills dos 5 jogadores | mais mapas, depois mais kills |
| Time com maior média de pontuação | média das pontuações dos 5 jogadores | mais kills |

A média usa a mesma pontuação do Jogador Destaque: `KD × √mapas` para cada um dos 5 jogadores, somado e dividido por 5.

---

## 3. Estrutura de pastas

```text
Proj_Angular_Final/
├── README.md                          <- este arquivo
├── .gitignore                         <- ignora node_modules, dist e backups
├── backend/
│   ├── package.json                   <- dependências do servidor
│   ├── server.js                      <- rotas GET/POST/PUT/DELETE + Desfazer/Reset
│   ├── jogadores.json                 <- "banco" dos jogadores (persistência)
│   └── times.json                     <- "banco" dos times (persistência)
└── cs2-panel/
    ├── package.json
    ├── angular.json                   <- build e tema azure-blue do Material
    ├── tsconfig.json
    ├── tsconfig.app.json
    └── src/
        ├── index.html                 <- fontes, ícones e <app-root>
        ├── main.ts                    <- ponto de entrada do Angular
        ├── styles.css                 <- estilo global
        └── app/
            ├── app.component.ts/.html/.css  <- menu + router-outlet
            ├── app.config.ts                <- liga rotas e HttpClient
            ├── app.routes.ts                <- rotas do app
            ├── models/
            │   ├── jogador.model.ts         <- o "formato" do jogador
            │   └── time.model.ts            <- o "formato" do time
            ├── services/
            │   ├── jogador.service.ts       <- chamadas HTTP dos jogadores
            │   └── time.service.ts          <- chamadas HTTP dos times
            └── pages/
                ├── home/            <- destaques de jogador e times
                ├── stats/           <- ranking, busca, filtro, Desfazer e Reset
                ├── detalhe/         <- ficha do jogador
                ├── cadastrar/       <- formulário de criar/editar jogador
                ├── times/           <- lista de times
                └── cadastrar-time/  <- formulário de criar/editar time
```

---

## 4. Passo a passo: como criar o projeto do zero (para aprender)

Os arquivos já estão prontos na pasta, mas se o professor pedir para você mostrar como começou, use estes comandos:

```bash
# 1. Cria o projeto Angular (roteamento e CSS já inclusos)
npx -y @angular/cli@20 new cs2-panel --routing --style=css --skip-git --package-manager=npm

# 2. Entra na pasta do projeto
cd cs2-panel

# 3. Instala o Angular Material (aceite as opções padrão)
ng add @angular/material@20

# 4. Roda o projeto
npm start
```

Depois disso é só copiar os arquivos deste trabalho por cima dos arquivos gerados pelo comando `new`.

> Testado com **Node 24.22.0**, **Angular 20.3** e **Angular Material 20.2**. Use Node 20, 22 ou 24.

> No Windows/PowerShell, se aparecer o erro `npm.ps1 não pode ser carregado porque a execução de scripts foi desabilitada`, use `npm.cmd` no lugar de `npm`. Outra solução é rodar, uma vez, como administrador:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

> Arquivos `.json` de configuração não aceitam comentários, por isso eles não seguem a regra dos comentários. Todos os arquivos `.ts`, `.js`, `.html` e `.css` sim.

---

## 5. Como rodar o backend

Abra um terminal na pasta `backend` e digite:

```bash
npm install
npm start
```

(se estiver no PowerShell e `npm` der erro, use `npm.cmd install` e `npm.cmd start`)

Você deve ver:

```text
Servidor rodando em http://localhost:3000
```

Teste no navegador: **http://localhost:3000/jogadores** e **http://localhost:3000/times**.

### Rotas do backend

| Método | Rota                 | O que faz                                              |
| ------ | -------------------- | ------------------------------------------------------ |
| GET    | `/`                  | Confere se o servidor está vivo                        |
| GET    | `/jogadores`         | Lista todos os jogadores                               |
| GET    | `/jogadores/:id`     | Busca um jogador pelo id (usado pela ficha)            |
| POST   | `/jogadores`         | Cria um jogador novo                                   |
| PUT    | `/jogadores/:id`     | Atualiza um jogador existente                          |
| DELETE | `/jogadores/:id`     | Exclui um jogador, se ele não estiver em um time       |
| GET    | `/times`             | Lista todos os times                                   |
| GET    | `/times/:id`         | Busca um time pelo id                                  |
| POST   | `/times`             | Cria um time com 5 jogadores e 1 coach                  |
| PUT    | `/times/:id`         | Atualiza um time existente                             |
| DELETE | `/times/:id`         | Exclui um time                                         |
| POST   | `/desfazer`          | Restaura o arquivo alterado antes da última mudança    |
| POST   | `/resetar`           | Volta aos 5 jogadores iniciais e apaga os times        |

Os dados ficam em `backend/jogadores.json` e `backend/times.json`. Antes de cada gravação o backend cria um backup (`jogadores-anterior.json` e `times-anterior.json`) e um marcador (`ultima-alteracao.txt`) — são esses arquivos que o **Desfazer** usa. Eles ficam fora do Git por causa do `.gitignore`.

---

## 6. Como rodar o Angular

Abra **outro** terminal (deixe o backend rodando) na pasta `cs2-panel` e digite:

```bash
npm install
npm start
```

Se o navegador não conseguir abrir, rode com o host aberto:

```bash
npm.cmd start -- --host 0.0.0.0
```

Acesse **http://localhost:4200** (com `http://`, não `https://`, e porta `4200`, não `3000`).

> Os dois terminais precisam estar abertos ao mesmo tempo: um com o backend na porta 3000 e outro com o Angular na porta 4200. Se você fechar o terminal, o servidor para.

---

## 7. Rotas do site

| Endereço             | Tela                                                |
| -------------------- | --------------------------------------------------- |
| `/home`              | Página inicial com os destaques (rota padrão)       |
| `/stats`             | Ranking principal                                   |
| `/novo`              | Formulário de cadastro de jogador                   |
| `/editar/:id`        | Formulário de edição (ex.: `/editar/2`)             |
| `/jogador/:id`       | Ficha/detalhe do jogador                            |
| `/times`             | Lista de times                                      |
| `/time/novo`         | Formulário de cadastro de time                      |
| `/time/editar/:id`   | Formulário de edição de time                        |

O link de navegação usa `routerLink` e as telas aparecem dentro do `<router-outlet>` do menu. A rota vazia (`''`) redireciona para `/home`.

---

## 8. Como testar tudo antes da entrega

Marque item por item:

1. **Backend ligado:** abra `http://localhost:3000/jogadores` e veja os 5 jogadores de exemplo.
2. **Home:** abra `http://localhost:4200`. Veja o card do **Jogador Destaque** (s1mple) e a frase sobre times.
3. **Ranking:** clique em *Estatísticas*. O `#1` deve ser `s1mple` (K/D 1,90) e a tabela deve mostrar `#`, Jogador, Time, Função, Mapas, Kills, Deaths e K/D.
4. **Busca por nome:** digite `donk` no campo de busca. Só a linha dele aparece.
5. **Busca por time:** apague e digite `Vitality`. Só o `ZywOo` aparece.
6. **Filtro por função:** escolha `AWPer`. Devem aparecer só `s1mple` e `ZywOo`. Escolha `Todos` para voltar.
7. **Ficha/detalhe:** clique no ícone de olho de qualquer linha. A URL vira `/jogador/:id` e os números aparecem em caixas. Clique em *Voltar*.
8. **Criar jogador (POST):** clique em *Novo jogador*, preencha nickname, função, time, mapas, kills e deaths. Clique em *Cadastrar*: você volta ao ranking com o jogador na ordem do maior K/D.
9. **Editar jogador (PUT):** clique no lápis de um jogador. O formulário abre preenchido (url `/editar/:id`). Mude os números e salve.
10. **Criar time (POST):** clique em *Times* e depois em *Novo time*. Digite nome e coach, escolha 5 jogadores diferentes e cadastre. Volte à Home: os dois destaques de time aparecem com os nomes.
11. **Editar time (PUT):** clique em *Editar* na lista de times, troque um jogador e salve.
12. **Regra dos 5:** tente cadastrar um time com menos de 5 jogadores ou repetindo um jogador. Deve aparecer o aviso na tela.
13. **Bloqueio de exclusão:** tente excluir um jogador que está no time. O backend bloqueia e o aviso aparece.
14. **Excluir time (DELETE):** na lista de times, clique em *Excluir* e confirme. Depois você já pode excluir os jogadores daquele time.
15. **Desfazer:** no ranking, clique em *Desfazer última alteração*. O último arquivo modificado volta ao estado anterior.
16. **Reset:** abra *Opções avançadas* (no fim do ranking) e clique em *Restaurar dados iniciais*. Confirme. Voltam os 5 jogadores e os times são apagados.
17. **Persistência:** recarregue a página (F5). Tudo continua lá porque foi salvo nos arquivos JSON.
18. **Validação:** tente cadastrar sem nickname. Deve aparecer o aviso vermelho.
19. **Responsividade:** reduza a janela ou use o celular. O menu quebra linha, os filtros se acomodam, os cards da Home empilham e a tabela rola lateralmente sem quebrar a tela.

---

## 9. Como explicar na apresentação (resumo)

- **Model (`jogador.model.ts` e `time.model.ts`):** "é só um desenho dizendo quais campos existem. O `?` no `id` e na `posicao` quer dizer que são opcionais: quem cria o id é o backend e a posição é só para o ranking. No time eu guardo só os ids dos jogadores."
- **Service (`jogador.service.ts` e `time.service.ts`):** "é o único lugar que sabe a URL do backend. Uso `HttpClient` com `.subscribe()` em cada chamada — nada de RxJS complicado."
- **Rotas (`app.routes.ts`):** "cada endereço mostra um componente dentro do `<router-outlet>`. A rota vazia abre a Home; `editar/:id` reaproveita o cadastro e `jogador/:id` mostra a ficha."
- **Home:** "eu carrego jogadores e times e calculo os destaques no próprio componente com `sort`, `reduce` e `Math.sqrt`. A pontuação é `KD × √mapas`; para time eu somei os kills e também fiz a média das pontuações."
- **Stats:** "guardo a lista completa em `jogadores` e a lista filtrada em `exibidos`. O método `aplicarFiltros()` usa `filter`, `sort` e `map` para colocar a posição `#`. O K/D é uma divisão simples com cuidado para não dividir por zero."
- **Cadastrar:** "o `[(ngModel)]` liga cada campo à variável do formulário. Se a URL tiver id eu uso PUT, senão uso POST. No time eu repito cinco `mat-select` com um `ngFor`."
- **Desfazer/Reset:** "antes de gravar, o backend copia o arquivo atual para um backup e anota qual banco mudou. O Desfazer restaura esse backup; o Reset grava a lista inicial e limpa os times."
- **Backend:** "são rotas Express diretas: ler o JSON, mudar o array e gravar de novo. O `cors` é necessário porque o Angular está em outra porta."

---

## 10. Problemas comuns

| Problema | Solução |
| -------- | ------- |
| Tabela fica em "Carregando ranking..." | O backend não está ligado. Rode `npm start` na pasta `backend`. |
| Home fica em "Carregando painel..." | Confira se os dois bancos existem e se o backend está rodando. |
| "Não consegui desfazer" | Ainda não houve nenhuma gravação, então não existe backup. Faça uma alteração primeiro. |
| Ao excluir jogador aparece o aviso de time | É a regra: primeiro exclua o time ou troque o jogador na edição do time. |
| Erro de CORS no console | Confirme que `app.use(cors())` está no `server.js` e reinicie o backend. |
| `EADDRINUSE` na porta 3000 ou 4200 | Outro programa está usando a porta. Feche o terminal antigo ou troque a porta. |
| `npm.ps1 não pode ser carregado` | Use `npm.cmd` ou rode `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. |
| Site não abre em `localhost:4200` | Rode `npm.cmd start -- --host 0.0.0.0` e use `http://` (não `https://`). |
| Ícones aparecem como texto | O `mat-icon` usa a fonte do Google; confira a internet e o `<link>` no `index.html`. |
| `npm install` falha | Apague `node_modules` e `package-lock.json` e rode `npm install` de novo. |

---

## 11. Sobre os comentários do código

Todos os arquivos `.ts`, `.js`, `.html` e `.css` têm um comentário simples em português **a cada 5 linhas de código**, explicando o trecho com linguagem de estudante. Os comentários usam `//` em TypeScript/JavaScript, `<!-- -->` em HTML e `/* ... */` em CSS. Arquivos `.json` e este README não recebem comentários porque a sintaxe não permite (ou porque são documentação).

Antes de zipar para a entrega, você pode apagar as pastas `node_modules` e `dist` para deixar o arquivo menor. O professor só precisa rodar `npm install` novamente.

---

## 12. Subindo para o GitHub

O repositório remoto é `https://github.com/zMuriloDevs/Proj_Angular_College.git` na branch `main`. Depois de conferir tudo:

```bash
git add .
git commit -m "Aplica redesign com Home, times e destaques"
git push origin main
```

Se o Git pedir login, use a conta **zMuriloDevs**. No Windows, as credenciais ficam salvas no *Gerenciador de Credenciais*.
