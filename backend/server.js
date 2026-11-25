const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
// Aqui eu importo as bibliotecas e crio o meu servidor com o Express.
app.use(cors());
app.use(express.json());
const arquivo = path.join(__dirname, 'jogadores.json');
const porta = 3000;
const urlApi = 'https://explodingcamera.github.io/cs2leaderboard/data/latest/global.json';
// Configuro o CORS, o JSON e guardo o endereço do arquivo e da API pública.
function ler() {
  return JSON.parse(fs.readFileSync(arquivo, 'utf8'));
}
function salvar(lista) {
  fs.writeFileSync(arquivo, JSON.stringify(lista, null, 2));
// Essas duas funções só leem e gravam o arquivo jogadores.json.
}
function proximoId(lista) {
  return lista.length ? Math.max(...lista.map(j => j.id)) + 1 : 1;
}
function mapearDaApi(item) {
// O próximo id é o maior da lista mais um; depois preparo o mapeador da API.
  const mapas = Object.values(item.map_stats || {}).reduce((soma, n) => soma + n, 0);
  return {
    nickname: item.name,
    funcao: 'Rifler',
    time: item.region,
// A API não tem função/time, então uso Rifler e a região como time.
    mapas: mapas,
    kills: item.matches_won,
    deaths: item.matches_lost,
    rating: Number((item.rating / 10000).toFixed(2))
  };
// Kills e deaths vêm de vitórias/derrotas; o rating eu deixo parecido com o HLTV.
}
app.get('/', (req, res) => {
  res.json({ mensagem: 'Backend CS2 funcionando!' });
});
app.get('/jogadores', (req, res) => {
// Tenho uma rota de teste e outra que devolve a lista de jogadores.
  res.json(ler());
});
app.get('/jogadores/:id', (req, res) => {
  const lista = ler();
  const jogador = lista.find(j => j.id === Number(req.params.id));
// Aqui procuro um jogador pelo número que veio dentro da URL.
  if (jogador) {
    res.json(jogador);
  } else {
    res.status(404).json({ erro: 'Jogador não encontrado' });
  }
// Se achar eu devolvo o jogador, se não achar eu mando erro 404.
});
app.post('/jogadores', (req, res) => {
  const lista = ler();
  const novo = {
    id: proximoId(lista),
// O POST cria um jogador novo usando o próximo id disponível.
    nickname: req.body.nickname,
    funcao: req.body.funcao,
    time: req.body.time,
    mapas: Number(req.body.mapas),
    kills: Number(req.body.kills),
// Pego os campos que o Angular mandou no corpo da requisição.
    deaths: Number(req.body.deaths),
    rating: Number(req.body.rating)
  };
  lista.push(novo);
  salvar(lista);
// Adiciono o jogador, salvo no arquivo e respondo com status 201.
  res.status(201).json(novo);
});
app.put('/jogadores/:id', (req, res) => {
  const lista = ler();
  const indice = lista.findIndex(j => j.id === Number(req.params.id));
// Procuro a posição do jogador e aviso se ele não existir.
  if (indice === -1) {
    return res.status(404).json({ erro: 'Jogador não encontrado' });
  }
  lista[indice] = {
    ...lista[indice],
// Guardo o id antigo e troco os campos pelos valores do formulário.
    nickname: req.body.nickname,
    funcao: req.body.funcao,
    time: req.body.time,
    mapas: Number(req.body.mapas),
    kills: Number(req.body.kills),
// Fecho os números da edição antes de salvar.
    deaths: Number(req.body.deaths),
    rating: Number(req.body.rating)
  };
  salvar(lista);
  res.json(lista[indice]);
// A edição termina com a lista atualizada gravada no arquivo.
});
// Escrevo a lista atualizada no arquivo e devolvo o jogador editado.
app.delete('/jogadores/:id', (req, res) => {
  const lista = ler();
  const nova = lista.filter(j => j.id !== Number(req.params.id));
  if (nova.length === lista.length) {
// O filter tira o jogador escolhido; se nada mudou, ele não existia.
    return res.status(404).json({ erro: 'Jogador não encontrado' });
  }
  salvar(nova);
  res.json({ mensagem: 'Jogador excluído com sucesso' });
});
// Salvo a lista sem o jogador e confirmo a exclusão para o Angular.
app.post('/jogadores/importar', async (req, res) => {
  try {
    const resposta = await fetch(urlApi);
    const dados = await resposta.json();
    const lista = ler();
// Aqui eu busco o JSON público da CS2 Leaderboard e leio o banco local.
    let id = proximoId(lista);
    let adicionados = 0;
    let ignorados = 0;
    const primeiros = dados.slice(0, 20);
// Vou pegar só os 20 primeiros para não deixar o arquivo gigante.
    for (const item of primeiros) {
      const jogador = mapearDaApi(item);
      const existe = lista.some(j => j.nickname.toLowerCase() === jogador.nickname.toLowerCase());
      if (existe) {
        ignorados++;
// Se o nick já existe no banco, eu conto como ignorado e pulo.
        continue;
      }
      jogador.id = id++;
      lista.push(jogador);
      adicionados++;
// Para cada item novo eu dou um id e coloco no banco local.
    }
// Senão eu dou um id novo e adiciono o jogador na lista.
    salvar(lista);
    res.json({ adicionados: adicionados, ignorados: ignorados, total: lista.length });
  } catch (erro) {
    res.status(500).json({ erro: 'Não consegui importar da API' });
// Se a API falhar, devolvo erro 500 para o Angular mostrar uma mensagem.
  }
});
app.listen(porta, () => {
  console.log('Servidor rodando em http://localhost:' + porta);
});
// Por fim eu ligo o servidor e deixo ele esperando na porta 3000.
