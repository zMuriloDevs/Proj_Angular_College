import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Jogador } from '../models/jogador.model';
@Injectable({ providedIn: 'root' })
// O Injectable deixa esse service disponível para todo o projeto.
export class JogadorService {
  private api = 'http://localhost:3000';
  constructor(private http: HttpClient) {}
  listar(): Observable<Jogador[]> {
// Guardo a base da API e começo pelos métodos dos jogadores.
    return this.http.get<Jogador[]>(`${this.api}/jogadores`);
  }
  buscarPorId(id: number): Observable<Jogador> {
    return this.http.get<Jogador>(`${this.api}/jogadores/${id}`);
  }
// O POST cria um jogador novo no backend.
  criar(jogador: Jogador): Observable<Jogador> {
// O GET com id abre a ficha; o POST cria um jogador novo.
    return this.http.post<Jogador>(`${this.api}/jogadores`, jogador);
  }
  atualizar(id: number, jogador: Jogador): Observable<Jogador> {
    return this.http.put<Jogador>(`${this.api}/jogadores/${id}`, jogador);
  }
// O DELETE apaga um jogador pelo id.
  excluir(id: number): Observable<any> {
// O PUT salva a edição e o DELETE apaga o jogador.
    return this.http.delete(`${this.api}/jogadores/${id}`);
  }
  desfazer(): Observable<any> {
    return this.http.post<any>(`${this.api}/desfazer`, {});
  }
// O Reset restaura os dados iniciais no servidor.
  resetar(): Observable<any> {
// O Desfazer restaura o último estado; o Reset volta aos 5 iniciais.
    return this.http.post<any>(`${this.api}/resetar`, {});
  }
}
// Os componentes usam .subscribe() para receber cada resposta.
