export interface Jogador {
  id?: number;
  nickname: string;
  funcao: string;
  time: string;
// Descrevo o formato do jogador; o id é opcional no cadastro manual.
  mapas: number;
  kills: number;
  deaths: number;
  rating: number;
  posicao?: number;
// A posição é só para o ranking e não precisa ser salva no banco.
}
// Os números são as estatísticas que aparecem na tela de estatísticas.
