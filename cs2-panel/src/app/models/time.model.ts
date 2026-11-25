export interface Time {
  id?: number;
  nome: string;
  coach: string;
// O time tem nome e coach, que são campos de texto obrigatórios.
  jogadores: number[];
}
// Guardo só os ids dos 5 jogadores para não duplicar dados.
