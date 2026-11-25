# Painel de Estatísticas de Counter-Strike 2 (CS2)

Trabalho individual de graduação — entrega: **25/11/2026**.

Projeto simples feito com **Angular 20 + Angular Material** no front e **Node.js + Express + arquivo JSON** no back. A ideia é parecer com o HLTV: um ranking de jogadores com busca, filtro por função, ficha individual e CRUD completo.

---

## 1. O que o projeto faz

- **`/stats` (página principal):** ranking estilo HLTV com colunas **# (posição), Jogador, Time, Função, Mapas, Kills, Deaths, K/D e Rating**. Ordena pelo maior rating.
- **Busca:** digite o nick **ou** o time; a tabela é filtrada na hora.
- **Filtro de função:** `Todos`, `AWPer`, `Rifler`, `IGL` ou `Entry` (campo com `mat-select`).
- **`/jogador/:id`:** ficha/detalhe do jogador com todos os números e botões de editar, excluir e voltar.
- **`/novo` e `/editar/:id`:** formulário para criar e alterar jogadores (mesmo componente, muda conforme a URL).
- **Importar da CS2 Leaderboard:** um botão no rankingpede ao backend para buscar o JSON público e salvar os jogadores no nosso banco. Clicar de novo não duplica os já importados.
- **Persistência real:** tudo é gravado em `backend/jogadores.json`, então não some ao fechar o navegador.

Campos de cada jogador: `nickname`, `funcao`, `time`, `mapas`, `kills`, `deaths` e `rating` (o `id` é criado pelo backend; `posicao` é só para mostrar o `#` na tabela e não é salvo).

### Sobre os dados importados da API

O endereço usado é:

```text
https://explodingcamera.github.io/cs2leaderboard/data/latest/global.json
```

O JSON público traz `name`, `rating`, `region`, `map_stats`, vitórias e derrotas. Ele **não** traz time, função, kills e deaths prontos. Então o backend faz uma conversão simples e honesta, explicada em comentários:

| Campo do nosso banco | De onde vem na API |
| -------------------- | ------------------ |
| `nickname`           | `name`             |
| `funcao`             | `Rifler` (padrão, a API não informa) |
| `time`               | `region` (`europe`, `asia`, ...) |
| `mapas`              | soma dos valores de `map_stats` |
| `kills`              | `matches_won` (vitórias) |
| `deaths`             | `matches_lost` (derrotas) |
| `rating`             | `rating` da API dividido por 10000, com 2 casas |

> Essa divisão por 10000 é só uma adaptação didática para o rating ficar num intervalo parecido com o do HLTV (algo entre 1 e 4). O backend pega só os 20 primeiros para não deixar o arquivo enorme. Se o nick já existir, ele é ignorado.

---

## 2. Estrutura de pastas

```text
Proj_Angular_Final/
├── README.md                          <- este arquivo
├── backend/
│   ├── package.json                   <- dependências do servidor
│   ├── server.js                      <- rotas GET/POST/PUT/DELETE + importação
│   └── jogadores.json                 <- "banco de dados" (persistência)
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
            ├── models/jogador.model.ts      <- o "formato" do jogador
            ├── services/jogador.service.ts  <- chamadas HTTP para o backend
            └── pages/
                ├── stats/           <- ranking, busca, filtro, importar, excluir
                ├── detalhe/         <- ficha do jogador
                └── cadastrar/       <- formulário de criar/editar
```

---

## 3. Passo a passo: como criar o projeto do zero (para aprender)

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

## 4. Como rodar o backend

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

Teste no navegador: **http://localhost:3000/jogadores**

### Rotas do backend

| Método | Rota                 | O que faz                                              |
| ------ | -------------------- | ------------------------------------------------------ |
| GET    | `/`                  | Confere se o servidor está vivo                        |
| GET    | `/jogadores`         | Lista todos os jogadores                               |
| GET    | `/jogadores/:id`     | Busca um jogador pelo id (usado pela ficha)            |
| POST   | `/jogadores`         | Cria um jogador novo                                   |
| PUT    | `/jogadores/:id`     | Atualiza um jogador existente                          |
| DELETE | `/jogadores/:id`     | Exclui um jogador                                      |
| POST   | `/jogadores/importar`| Busca a API pública da CS2 Leaderboard e salva no banco |

Os dados ficam em `backend/jogadores.json`. Se você apagar esse arquivo, o backend dá erro — para recuperar, basta recriá-lo com um colchete vazio: `[]`.

---

## 5. Como rodar o Angular

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

## 6. Rotas do site

| Endereço          | Tela                                      |
| ----------------- | ----------------------------------------- |
| `/stats`          | Ranking principal (é também a página inicial) |
| `/novo`           | Formulário de cadastro                    |
| `/editar/:id`     | Formulário de edição (ex.: `/editar/2`)   |
| `/jogador/:id`    | Ficha/detalhe do jogador                  |

O link de navegação usa `routerLink` e as telas aparecem dentro do `<router-outlet>` do menu.

---

## 7. Como testar tudo antes da entrega

Marque item por item:

1. **Backend ligado:** abra `http://localhost:3000/jogadores` e veja os 5 jogadores de exemplo.
2. **Ranking:** abra `http://localhost:4200`. O `#1` deve ser `s1mple` (rating 1.38), e a tabela deve mostrar `#`, Jogador, Time, Função, Mapas, Kills, Deaths, K/D e Rating.
3. **Busca por nome:** digite `donk` no campo de busca. Só a linha dele aparece.
4. **Busca por time:** apague e digite `Vitality`. Só o `ZywOo` aparece.
5. **Filtro por função:** escolha `AWPer`. Devem aparecer só `s1mple` e `ZywOo`. Escolha `Todos` para voltar.
6. **Ficha/detalhe:** clique no ícone de olho de qualquer linha. A URL vira `/jogador/:id` e os números aparecem em caixas. Clique em *Voltar*.
7. **Importar da API:** clique em *Importar CS2 Leaderboard*. Aparece a mensagem dizendo quantos jogadores foram adicionados; a tabela cresce e novos nicks (da API) aparecem.
8. **Não duplicar:** clique em *Importar* de novo. Dessa vez deve dizer `0 jogadores adicionados` e os ignorados aparecem na resposta/contagem.
9. **Criar (POST):** clique em *Novo jogador*, preencha nickname, função, time, mapas, kills, deaths e rating. Clique em *Cadastrar*: você volta ao ranking e o jogador aparece (em ordem de rating).
10. **Editar (PUT):** clique no lápis de um jogador. O formulário abre preenchido (url `/editar/:id`). Mude o rating e salve: a posição no ranking muda.
11. **Excluir (DELETE):** clique na lixeira, confirme e veja o jogador sumir. Também teste excluir pela ficha.
12. **Persistência:** recarregue a página (F5). Tudo continua lá porque foi salvo no `jogadores.json`.
13. **Validação:** tente cadastrar sem nickname. Deve aparecer o aviso vermelho.
14. **Responsividade:** reduza a janela ou use o celular. O menu quebra linha, os filtros se acomodam e a tabela rola lateralmente sem quebrar a tela.

Para voltar aos 5 jogadores originais, restaure o `backend/jogadores.json` como ele veio no projeto (os 5 objetos: s1mple, donk, ZywOo, rain e boaster).

---

## 8. Como explicar na apresentação (resumo)

- **Model (`jogador.model.ts`):** "é só um desenho dizendo quais campos um jogador tem. O `?` no `id` e na `posicao` quer dizer que são opcionais: quem cria o id é o backend e a posição é só para o ranking."
- **Service (`jogador.service.ts`):** "é o único lugar que sabe a URL do backend. Uso `HttpClient` com `.subscribe()` em cada chamada — nada de RxJS complicado."
- **Rotas (`app.routes.ts`):** "cada endereço mostra um componente dentro do `<router-outlet>`. A rota `editar/:id` reaproveita o cadastro; `jogador/:id` mostra a ficha."
- **Stats:** "guardo a lista completa em `jogadores` e a lista filtrada em `exibidos`. O método `aplicarFiltros()` usa `filter`, `sort` e `map` para colocar a posição `#`. O K/D é uma divisão simples com cuidado para não dividir por zero."
- **Importação:** "o botão chama `POST /jogadores/importar`. Quem faz `fetch` da API pública é o backend, não o Angular, para evitar problema de CORS no navegador. Eu converto os campos e ignoro nicks repetidos."
- **Cadastrar:** "o `[(ngModel)]` liga cada campo à variável `jogador`. Se a URL tiver id eu uso PUT, senão uso POST."
- **Detalhe:** "eu pego o id com `ActivatedRoute`, busco o jogador no backend e mostro os números em caixas. Também tenho editar, excluir e voltar."
- **Backend:** "são rotas Express diretas: ler o JSON, mudar o array e gravar de novo. O `cors` é necessário porque o Angular está em outra porta."

---

## 9. Problemas comuns

| Problema | Solução |
| -------- | ------- |
| Tabela fica em "Carregando ranking..." | O backend não está ligado. Rode `npm start` na pasta `backend`. |
| Ao importar aparece "Não consegui importar" | Confira a internet e se o backend está rodando; a busca é feita pelo servidor. |
| Erro de CORS no console | Confirme que `app.use(cors())` está no `server.js` e reinicie o backend. |
| `EADDRINUSE` na porta 3000 ou 4200 | Outro programa está usando a porta. Feche o terminal antigo ou troque a porta. |
| `npm.ps1 não pode ser carregado` | Use `npm.cmd` ou rode `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. |
| Site não abre em `localhost:4200` | Rode `npm.cmd start -- --host 0.0.0.0` e use `http://` (não `https://`). |
| Ícones aparecem como texto | O `mat-icon` usa a fonte do Google; confira a internet e o `<link>` no `index.html`. |
| `npm install` falha | Apague `node_modules` e `package-lock.json` e rode `npm install` de novo. |

---

## 10. Sobre os comentários do código

Todos os arquivos `.ts`, `.js`, `.html` e `.css` têm um comentário simples em português **a cada 5 linhas de código**, explicando o trecho com linguagem de estudante. Os comentários usam `//` em TypeScript/JavaScript, `<!-- -->` em HTML e `/* ... */` em CSS. Arquivos `.json` e este README não recebem comentários porque a sintaxe não permite (ou porque são documentação).

Antes de zipar para a entrega, você pode apagar as pastas `node_modules` e `dist` para deixar o arquivo menor. O professor só precisa rodar `npm install` novamente.
