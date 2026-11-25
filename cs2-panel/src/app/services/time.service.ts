import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Time } from '../models/time.model';
@Injectable({ providedIn: 'root' })
// Esse service concentra as chamadas HTTP do banco de times.
export class TimeService {
  private api = 'http://localhost:3000/times';
  constructor(private http: HttpClient) {}
  listar(): Observable<Time[]> {
    return this.http.get<Time[]>(this.api);
// O GET traz a lista de times cadastrados no backend.
  }
  buscarPorId(id: number): Observable<Time> {
    return this.http.get<Time>(`${this.api}/${id}`);
  }
  criar(time: Time): Observable<Time> {
// O GET com id carrega um time; o POST cria um time novo.
    return this.http.post<Time>(this.api, time);
  }
  atualizar(id: number, time: Time): Observable<Time> {
    return this.http.put<Time>(`${this.api}/${id}`, time);
  }
// O DELETE remove um time do banco.
  excluir(id: number): Observable<any> {
// Com o PUT eu edito e com o DELETE eu apago um time.
    return this.http.delete(`${this.api}/${id}`);
  }
}
// Cada método devolve um Observable simples para o componente usar.
