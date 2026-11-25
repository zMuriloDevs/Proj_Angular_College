import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Jogador } from '../models/jogador.model';
@Injectable({ providedIn: 'root' })
// deixei o service disponível no app inteiro
export class JogadorService {
  private api = 'http://localhost:3000';
  constructor(private http: HttpClient) {}
  listar(): Observable<Jogador[]> {
    return this.http.get<Jogador[]>(`${this.api}/jogadores`);
// a base da api fica aqui e o GET traz a lista
  }
  buscarPorId(id: number): Observable<Jogador> {
    return this.http.get<Jogador>(`${this.api}/jogadores/${id}`);
  }
  criar(jogador: Jogador): Observable<Jogador> {
// segue o fluxo
    return this.http.post<Jogador>(`${this.api}/jogadores`, jogador);
// GET com id abre a ficha; POST cria outro jogador
  }
  atualizar(id: number, jogador: Jogador): Observable<Jogador> {
    return this.http.put<Jogador>(`${this.api}/jogadores/${id}`, jogador);
  }
  excluir(id: number): Observable<any> {
// aqui eu trato o que veio
    return this.http.delete(`${this.api}/jogadores/${id}`);
// PUT salva a edição e DELETE apaga, simples assim
  }
  desfazer(): Observable<any> {
    return this.http.post<any>(`${this.api}/desfazer`, {});
  }
  resetar(): Observable<any> {
// deixo isso pronto pra tela
    return this.http.post<any>(`${this.api}/resetar`, {});
// desfazer volta um passo; reset volta pro começo
  }
}
// cada método devolve um Observable e o componente dá o .subscribe()
