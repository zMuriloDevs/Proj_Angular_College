export interface Jogador {
  id?: number;
  nickname: string;
  funcao: string;
  timeId: number | null;
// o vínculo é um id ou null, nada de texto solto
  mapas: number;
  kills: number;
  deaths: number;
  posicao?: number;
// posição só aparece no ranking, não é salva
}
// o id quem cria é o backend; K/D sai de kills e deaths
