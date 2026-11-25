import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Time } from '../models/time.model';
@Injectable({ providedIn: 'root' })
// service dos times, disponível em qualquer página
export class TimeService {
  private api = 'http://localhost:3000/times';
  constructor(private http: HttpClient) {}
  listar(): Observable<Time[]> {
    return this.http.get<Time[]>(this.api);
// o GET traz os times cadastrados
  }
  buscarPorId(id: number): Observable<Time> {
    return this.http.get<Time>(`${this.api}/${id}`);
  }
  criar(time: Time): Observable<Time> {
// segue o fluxo
    return this.http.post<Time>(this.api, time);
// com id eu carrego um time; sem id eu crio
  }
  atualizar(id: number, time: Time): Observable<Time> {
    return this.http.put<Time>(`${this.api}/${id}`, time);
  }
  excluir(id: number): Observable<any> {
// aqui eu trato o que veio
    return this.http.delete(`${this.api}/${id}`);
// PUT edita nome/coach e DELETE apaga o time
  }
}
// nada de RxJS complicado, só Observable e .subscribe()
