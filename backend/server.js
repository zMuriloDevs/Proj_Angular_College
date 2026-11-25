const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
// subi o express e puxei o cors e o fs pra mexer nos json

app.use(cors());
app.use(express.json());
const arquivoJogadores = path.join(__dirname, 'jogadores.json');
const arquivoTimes = path.join(__dirname, 'times.json');
const porta = 3000;
// deixei o cors ligado e guardei os caminhos dos dois bancos

const backupJogadores = path.join(__dirname, 'jogadores-anterior.json');
const backupTimes = path.join(__dirname, 'times-anterior.json');
const marcador = path.join(__dirname, 'ultima-alteracao.txt');
// backups do desfazer e um marcador dizendo qual banco mudou por último

const jogadoresIniciais = [];
// nada de jogador pronto: o banco começa vazio e o reset também zera

function ler(caminho) {
  return JSON.parse(fs.readFileSync(caminho, 'utf8'));
}
function proximoId(lista) {
  return lista.length ? Math.max(...lista.map(x => x.id)) + 1 : 1;
// leio o json e pego o próximo id, simples assim
}
function copiar(caminho, destino) {
  if (fs.existsSync(caminho)) fs.copyFileSync(caminho, destino);
}
function salvar(caminho, lista, nome) {
// aqui eu trato o que veio
  copiar(caminho, nome === 'times' ? backupTimes : backupJogadores);
  fs.writeFileSync(marcador, nome);
  fs.writeFileSync(caminho, JSON.stringify(lista, null, 2));
// antes de gravar eu guardo a cópia e anoto qual banco foi mexido
}
function salvarAmbos(listaJogadores, listaTimes) {
  copiar(arquivoJogadores, backupJogadores);
  copiar(arquivoTimes, backupTimes);
  fs.writeFileSync(marcador, 'ambos');
// quando a mudança mexe nos dois, faço backup dos dois juntos
  fs.writeFileSync(arquivoJogadores, JSON.stringify(listaJogadores, null, 2));
  fs.writeFileSync(arquivoTimes, JSON.stringify(listaTimes, null, 2));
}
function normalizarTimeId(valor) {
  if (valor === null || valor === undefined || valor === '') return null;
// deixo isso pronto pra tela
  return Number(valor);
// o select manda null pra "Sem time"; senão vem um número
}
function timeExiste(id, times) {
  return times.some(t => t.id === id);
}
function vagas(timeId, idAtual, jogadores) {
// nada de mistério aqui
  const atual = idAtual === null || idAtual === undefined ? -1 : Number(idAtual);
  return jogadores.filter(j => j.timeId === timeId && j.id !== atual).length < 5;
// conto quem já está no time, menos o próprio jogador na edição
}
function nomeTimeValido(req) {
  return !!(req.body.nome && String(req.body.nome).trim() &&
            req.body.coach && String(req.body.coach).trim());
// time nasce vazio: só nome e coach, sem arrays de jogadores
}

app.get('/', (req, res) => {
  res.json({ mensagem: 'Backend CS2 funcionando!' });
});
app.get('/jogadores', (req, res) => {
// continuo na mesma ideia
  res.json(ler(arquivoJogadores));
// rota raiz só dá o sinal de vida; as outras leem os bancos
});
app.get('/jogadores/:id', (req, res) => {
  const jogador = ler(arquivoJogadores).find(j => j.id === Number(req.params.id));
  if (!jogador) return res.status(404).json({ erro: 'Jogador não encontrado' });
  res.json(jogador);
// a ficha vem pelo id que anda na url
});
app.post('/jogadores', (req, res) => {
  const lista = ler(arquivoJogadores);
  const times = ler(arquivoTimes);
  const timeId = normalizarTimeId(req.body.timeId);
// antes de criar eu já leio os times e normalize o vínculo
  if (timeId !== null) {
    if (!timeExiste(timeId, times)) {
      return res.status(400).json({ erro: 'Esse time não existe mais.' });
    }
    if (!vagas(timeId, null, lista)) {
// segue o fluxo
      return res.status(400).json({ erro: 'Time cheio: máximo de 5 jogadores.' });
    }
  }
// se não der erro, o vínculo é válido e ainda tem vaga
  const novo = {
    id: proximoId(lista),
    nickname: req.body.nickname,
    funcao: req.body.funcao,
    timeId: timeId,
// aqui eu trato o que veio
    mapas: Number(req.body.mapas),
    kills: Number(req.body.kills),
    deaths: Number(req.body.deaths)
  };
// monto o jogador com timeId no lugar do antigo campo de texto
  lista.push(novo);
  salvar(arquivoJogadores, lista, 'jogadores');
  res.status(201).json(novo);
});
app.put('/jogadores/:id', (req, res) => {
// deixo isso pronto pra tela
  const lista = ler(arquivoJogadores);
  const times = ler(arquivoTimes);
  const indice = lista.findIndex(j => j.id === Number(req.params.id));
// procuro a posição do jogador e leio os times pra validar
  if (indice === -1) return res.status(404).json({ erro: 'Jogador não encontrado' });
  const timeId = normalizarTimeId(req.body.timeId);
  if (timeId !== null) {
    if (!timeExiste(timeId, times)) {
      return res.status(400).json({ erro: 'Esse time não existe mais.' });
// nada de mistério aqui
    }
    if (!vagas(timeId, lista[indice].id, lista)) {
      return res.status(400).json({ erro: 'Time cheio: máximo de 5 jogadores.' });
    }
  }
// na edição eu ignoro o próprio jogador, então ele pode ficar num time cheio
  lista[indice] = {
    ...lista[indice],
    nickname: req.body.nickname,
    funcao: req.body.funcao,
    timeId: timeId,
// continuo na mesma ideia
    mapas: Number(req.body.mapas),
    kills: Number(req.body.kills),
    deaths: Number(req.body.deaths)
  };
// mantive o id antigo e troquei só os campos que vieram do formulário
  salvar(arquivoJogadores, lista, 'jogadores');
  res.json(lista[indice]);
});
app.delete('/jogadores/:id', (req, res) => {
  const lista = ler(arquivoJogadores);
// segue o fluxo
  const id = Number(req.params.id);
  const jogador = lista.find(j => j.id === id);
// procurei o jogador antes de deixar apagar qualquer coisa
  if (jogador && jogador.timeId !== null && jogador.timeId !== undefined) {
    return res.status(400).json({ erro: 'Tira esse jogador do time no formulário antes de excluir.' });
  }
  const nova = lista.filter(j => j.id !== id);
  if (nova.length === lista.length) return res.status(404).json({ erro: 'Jogador não encontrado' });
// quem está em time não apaga; o aviso manda resolver no cadastro
  salvar(arquivoJogadores, nova, 'jogadores');
  res.json({ mensagem: 'Jogador excluído com sucesso' });
});
app.get('/times', (req, res) => {
  res.json(ler(arquivoTimes));
// aqui eu trato o que veio
});
app.get('/times/:id', (req, res) => {
  const time = ler(arquivoTimes).find(t => t.id === Number(req.params.id));
  if (!time) return res.status(404).json({ erro: 'Time não encontrado' });
  res.json(time);
// a ficha do time também é pelo id da url
});
app.post('/times', (req, res) => {
  if (!nomeTimeValido(req)) {
    return res.status(400).json({ erro: 'Time inválido: preciso de nome e coach.' });
  }
// deixo isso pronto pra tela
  const lista = ler(arquivoTimes);
  const novo = { id: proximoId(lista), nome: req.body.nome.trim(), coach: req.body.coach.trim() };
// o time nasce com só nome e coach, os jogadores entram depois
  lista.push(novo);
  salvar(arquivoTimes, lista, 'times');
  res.status(201).json(novo);
});
app.put('/times/:id', (req, res) => {
// nada de mistério aqui
  const lista = ler(arquivoTimes);
  const indice = lista.findIndex(t => t.id === Number(req.params.id));
  if (indice === -1) return res.status(404).json({ erro: 'Time não encontrado' });
// edição de time é só trocar nome e coach, nada de mexer no vínculo aqui
  if (!nomeTimeValido(req)) {
    return res.status(400).json({ erro: 'Time inválido: preciso de nome e coach.' });
  }
  lista[indice] = { ...lista[indice], nome: req.body.nome.trim(), coach: req.body.coach.trim() };
  salvar(arquivoTimes, lista, 'times');
// continuo na mesma ideia
  res.json(lista[indice]);
});
app.delete('/times/:id', (req, res) => {
  const times = ler(arquivoTimes);
  const id = Number(req.params.id);
// segue o fluxo
  const nova = times.filter(t => t.id !== id);
  if (nova.length === times.length) return res.status(404).json({ erro: 'Time não encontrado' });
// apaguei o time, agora solto quem estava amarrado nele
  const jogadores = ler(arquivoJogadores).map(j => j.timeId === id ? { ...j, timeId: null } : j);
  salvarAmbos(jogadores, nova);
  res.json({ mensagem: 'Time excluído e jogadores liberados' });
});
app.post('/desfazer', (req, res) => {
// aqui eu trato o que veio
  if (!fs.existsSync(marcador)) return res.status(400).json({ erro: 'Nada para desfazer' });
  const alvo = fs.readFileSync(marcador, 'utf8');
// o marcador diz se a última mexida foi em jogadores, times ou nos dois
  if (alvo === 'jogadores' || alvo === 'ambos') copiar(backupJogadores, arquivoJogadores);
  if (alvo === 'times' || alvo === 'ambos') copiar(backupTimes, arquivoTimes);
  res.json({ mensagem: 'Última alteração desfeita' });
});
app.post('/resetar', (req, res) => {
// deixo isso pronto pra tela
  copiar(arquivoJogadores, backupJogadores);
  copiar(arquivoTimes, backupTimes);
  fs.writeFileSync(marcador, 'ambos');
// o reset também pode ser desfeito, então guardo os dois antes
  fs.writeFileSync(arquivoJogadores, JSON.stringify(jogadoresIniciais, null, 2));
  fs.writeFileSync(arquivoTimes, '[]');
  res.json({ mensagem: 'Dados limpos restaurados' });
});
app.listen(porta, () => {
  console.log('Servidor rodando em http://localhost:' + porta);
});
// pronto, fico esperando chamada na 3000