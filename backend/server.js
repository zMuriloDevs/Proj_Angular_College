const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
// Importo as bibliotecas e crio o meu servidor com o Express.

app.use(cors());
app.use(express.json());
const arquivoJogadores = path.join(__dirname, 'jogadores.json');
const arquivoTimes = path.join(__dirname, 'times.json');
const porta = 3000;
// Configuro o CORS e guardo os caminhos dos dois bancos de dados.

const backupJogadores = path.join(__dirname, 'jogadores-anterior.json');
const backupTimes = path.join(__dirname, 'times-anterior.json');
const marcador = path.join(__dirname, 'ultima-alteracao.txt');
const jogadoresIniciais = [
  { id: 1, nickname: 's1mple', funcao: 'AWPer', time: 'NAVI', mapas: 42, kills: 1180, deaths: 620 },
// Guardo os backups do Desfazer e a lista usada pelo Reset.
  { id: 2, nickname: 'donk', funcao: 'Entry', time: 'Team Spirit', mapas: 38, kills: 1050, deaths: 590 },
  { id: 3, nickname: 'ZywOo', funcao: 'AWPer', time: 'Vitality', mapas: 45, kills: 1240, deaths: 680 },
  { id: 4, nickname: 'rain', funcao: 'Rifler', time: 'FaZe', mapas: 36, kills: 890, deaths: 640 },
  { id: 5, nickname: 'boaster', funcao: 'IGL', time: 'Fnatic', mapas: 40, kills: 720, deaths: 690 }
];
// Esses 5 jogadores voltam quando eu clico em restaurar dados iniciais.

function ler(caminho) {
  return JSON.parse(fs.readFileSync(caminho, 'utf8'));
}
function proximoId(lista) {
  return lista.length ? Math.max(...lista.map(x => x.id)) + 1 : 1;
// A função ler pega o JSON; a proximoId escolhe o id seguinte.
}
function copiar(caminho, destino) {
  if (fs.existsSync(caminho)) fs.copyFileSync(caminho, destino);
}
function salvar(caminho, lista, nome) {
// A cópia anterior protege o botão Desfazer de perder a última lista.
  copiar(caminho, nome === 'times' ? backupTimes : backupJogadores);
// Antes de gravar eu faço a cópia que o Desfazer vai restaurar depois.
  fs.writeFileSync(marcador, nome);
  fs.writeFileSync(caminho, JSON.stringify(lista, null, 2));
}
// Depois eu marco qual banco mudou e escrevo a lista nova no arquivo.

function timeValido(dados, listaJogadores) {
  if (!dados.nome || !dados.coach) return false;
// Nome do time e nome do coach são obrigatórios no cadastro.
  if (!Array.isArray(dados.jogadores) || dados.jogadores.length !== 5) return false;
  if (new Set(dados.jogadores).size !== 5) return false;
  return dados.jogadores.every(id => listaJogadores.some(j => j.id === Number(id)));
}
// Preciso de exatamente 5 jogadores diferentes e todos cadastrados.

app.get('/', (req, res) => {
  res.json({ mensagem: 'Backend CS2 funcionando!' });
});
app.get('/jogadores', (req, res) => {
// A rota raiz só confere se o servidor está vivo; a outra lista jogadores.
  res.json(ler(arquivoJogadores));
});
app.get('/jogadores/:id', (req, res) => {
  const jogador = ler(arquivoJogadores).find(j => j.id === Number(req.params.id));
  if (!jogador) return res.status(404).json({ erro: 'Jogador não encontrado' });
// Essa rota busca um jogador pelo número que vem dentro da URL.
  res.json(jogador);
});
app.post('/jogadores', (req, res) => {
  const lista = ler(arquivoJogadores);
  const novo = {
// O id novo é o maior da lista mais um.
    id: proximoId(lista),
// O POST cria um jogador novo com o próximo id disponível.
    nickname: req.body.nickname,
    funcao: req.body.funcao,
    time: req.body.time,
    mapas: Number(req.body.mapas),
    kills: Number(req.body.kills),
// Pego os campos enviados pelo formulário do Angular.
    deaths: Number(req.body.deaths)
  };
  lista.push(novo);
  salvar(arquivoJogadores, lista, 'jogadores');
// Adiciono, salvo com backup e devolvo status 201.
  res.status(201).json(novo);
});
app.put('/jogadores/:id', (req, res) => {
  const lista = ler(arquivoJogadores);
  const indice = lista.findIndex(j => j.id === Number(req.params.id));
// Procuro a posição do jogador e aviso se ele não existir.
  if (indice === -1) return res.status(404).json({ erro: 'Jogador não encontrado' });
  lista[indice] = {
    ...lista[indice],
    nickname: req.body.nickname,
// Guardo o id antigo e substituo os campos pelos valores editados.
    funcao: req.body.funcao,
    time: req.body.time,
    mapas: Number(req.body.mapas),
    kills: Number(req.body.kills),
    deaths: Number(req.body.deaths)
// Fecho o objeto editado antes de salvar.
  };
// Fecho os números da edição antes de gravar no arquivo.
  salvar(arquivoJogadores, lista, 'jogadores');
  res.json(lista[indice]);
});
app.delete('/jogadores/:id', (req, res) => {
  const lista = ler(arquivoJogadores);
// Leio também o banco de times para conferir vínculos.
  const times = ler(arquivoTimes);
  const id = Number(req.params.id);
// Antes de apagar eu confiro se o jogador pertence a algum time.
  if (times.some(t => t.jogadores.includes(id))) {
    return res.status(400).json({ erro: 'Esse jogador está em um time' });
  }
  const nova = lista.filter(j => j.id !== id);
  if (nova.length === lista.length) return res.status(404).json({ erro: 'Jogador não encontrado' });
// Se não estiver em nenhum time, eu tiro o jogador da lista.
  salvar(arquivoJogadores, nova, 'jogadores');
  res.json({ mensagem: 'Jogador excluído com sucesso' });
});
app.get('/times', (req, res) => {
// Agora começo as rotas do banco de times.
  res.json(ler(arquivoTimes));
});
app.get('/times/:id', (req, res) => {
  const time = ler(arquivoTimes).find(t => t.id === Number(req.params.id));
  if (!time) return res.status(404).json({ erro: 'Time não encontrado' });
// A ficha de um time também é buscada pelo id da URL.
  res.json(time);
});
app.post('/times', (req, res) => {
  const lista = ler(arquivoTimes);
  const jogadores = ler(arquivoJogadores);
// Antes de criar eu valido os dados recebidos.
  if (!timeValido(req.body, jogadores)) {
// A validação garante 5 jogadores, 1 coach e nenhum id repetido.
    return res.status(400).json({ erro: 'Time inválido: precisam ser 5 jogadores e 1 coach' });
  }
  const novo = { id: proximoId(lista), nome: req.body.nome, coach: req.body.coach,
    jogadores: req.body.jogadores.map(id => Number(id)) };
// Depois da validação eu monto o time com um id novo.
  lista.push(novo);
  salvar(arquivoTimes, lista, 'times');
  res.status(201).json(novo);
});
app.put('/times/:id', (req, res) => {
// Na edição de times eu começo lendo os dois bancos.
  const lista = ler(arquivoTimes);
  const jogadores = ler(arquivoJogadores);
  const indice = lista.findIndex(t => t.id === Number(req.params.id));
// Na edição eu procuro o time e valido os dados recebidos.
  if (indice === -1) return res.status(404).json({ erro: 'Time não encontrado' });
  if (!timeValido(req.body, jogadores)) {
    return res.status(400).json({ erro: 'Time inválido: precisam ser 5 jogadores e 1 coach' });
  }
// Se estiver tudo certo, eu substituo o time mantendo o id antigo.
  lista[indice] = { ...lista[indice], nome: req.body.nome, coach: req.body.coach,
    jogadores: req.body.jogadores.map(id => Number(id)) };
  salvar(arquivoTimes, lista, 'times');
  res.json(lista[indice]);
// Fecho a edição gravando o arquivo e devolvendo o time alterado.
});
app.delete('/times/:id', (req, res) => {
  const lista = ler(arquivoTimes);
  const nova = lista.filter(t => t.id !== Number(req.params.id));
  if (nova.length === lista.length) return res.status(404).json({ erro: 'Time não encontrado' });
// O DELETE remove o time e grava a lista sem ele.
  salvar(arquivoTimes, nova, 'times');
  res.json({ mensagem: 'Time excluído com sucesso' });
});
app.post('/desfazer', (req, res) => {
  if (!fs.existsSync(marcador)) return res.status(400).json({ erro: 'Nada para desfazer' });
// O marcador guarda qual banco foi alterado por último.
  const alvo = fs.readFileSync(marcador, 'utf8');
// O marcador diz se a última mudança foi em jogadores, times ou nos dois.
  if (alvo === 'jogadores' || alvo === 'ambos') copiar(backupJogadores, arquivoJogadores);
  if (alvo === 'times' || alvo === 'ambos') copiar(backupTimes, arquivoTimes);
  res.json({ mensagem: 'Última alteração desfeita' });
// Depois de restaurar, os arquivos voltam como estavam antes.
});
app.post('/resetar', (req, res) => {
  copiar(arquivoJogadores, backupJogadores);
  copiar(arquivoTimes, backupTimes);
// O Reset guarda os dois estados atuais para poder ser desfeito.
  fs.writeFileSync(marcador, 'ambos');
  fs.writeFileSync(arquivoJogadores, JSON.stringify(jogadoresIniciais, null, 2));
  fs.writeFileSync(arquivoTimes, '[]');
  res.json({ mensagem: 'Dados iniciais restaurados' });
// Ele volta aos 5 jogadores e apaga os times cadastrados.
});
app.listen(porta, () => {
  console.log('Servidor rodando em http://localhost:' + porta);
});
// Por fim eu ligo o servidor e fico esperando na porta 3000.
