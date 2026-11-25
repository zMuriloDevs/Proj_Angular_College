export interface Jogador {
  id?: number;
  nickname: string;
  funcao: string;
  time: string;
// Descrevo o jogador; o id é opcional porque quem cria é o backend.
  mapas: number;
  kills: number;
  deaths: number;
  posicao?: number;
// A posição só aparece no ranking e não precisa ser salva.
}
// Kills e deaths são usados para calcular o K/D em várias telas.
