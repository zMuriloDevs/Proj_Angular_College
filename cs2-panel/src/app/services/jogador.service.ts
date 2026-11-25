import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Jogador } from '../models/jogador.model';
@Injectable({ providedIn: 'root' })
// O Injectable deixa esse serviço disponível para todos os componentes.
export class JogadorService {
  private api = 'http://localhost:3000/jogadores';
  constructor(private http: HttpClient) {}
  listar(): Observable<Jogador[]> {
    return this.http.get<Jogador[]>(this.api);
// Aqui eu chamo o GET do backend para receber a lista inteira.
  }
  buscarPorId(id: number): Observable<Jogador> {
    return this.http.get<Jogador>(`${this.api}/${id}`);
  }
  criar(jogador: Jogador): Observable<Jogador> {
// O GET com id busca um jogador e o POST cria um jogador novo.
    return this.http.post<Jogador>(this.api, jogador);
  }
  atualizar(id: number, jogador: Jogador): Observable<Jogador> {
    return this.http.put<Jogador>(`${this.api}/${id}`, jogador);
  }
// O DELETE apaga um jogador e o POST importa dados da API.
  excluir(id: number): Observable<any> {
// O PUT salva a edição e o DELETE apaga o jogador escolhido.
    return this.http.delete(`${this.api}/${id}`);
  }
  importar(): Observable<any> {
    return this.http.post<any>(`${this.api}/importar`, {});
  }
// O POST em /importar pede ao backend que busque dados da CS2 Leaderboard.
}
// O Observable é como um "canal" que avisa quando a resposta chegar.
