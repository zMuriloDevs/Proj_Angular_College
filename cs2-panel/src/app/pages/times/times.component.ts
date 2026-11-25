import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// Cards, botões e ícones formam a lista de times cadastrados.
import { RouterLink } from '@angular/router';
import { Jogador } from '../../models/jogador.model';
import { JogadorService } from '../../services/jogador.service';
import { Time } from '../../models/time.model';
import { TimeService } from '../../services/time.service';
// Configuro agora o componente da lista de times.
@Component({
  selector: 'app-times',
  standalone: true,
// Declaro os módulos usados no HTML da lista de times.
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './times.component.html',
  styleUrl: './times.component.css'
})
// A lista precisa dos jogadores para mostrar os nomes dentro de cada time.
export class TimesComponent implements OnInit {
  times: Time[] = [];
  jogadores: Jogador[] = [];
  carregando = true;
// Guardo as duas listas e o estado de carregamento da página.
  constructor(private timeService: TimeService, private jogadorService: JogadorService) {}
  ngOnInit(): void { this.carregar(); }
  carregar(): void {
    this.jogadorService.listar().subscribe({
// Primeiro carrego os jogadores e depois os times.
      next: (dados) => {
        this.jogadores = dados;
        this.timeService.listar().subscribe((lista) => {
          this.times = lista;
// Com os times carregados eu libero a tela.
          this.carregando = false;
        });
      },
// Com os dois arrays prontos, a lista aparece na tela.
      error: () => { this.carregando = false; }
    });
  }
  nomes(time: Time): string {
// Cada id do time é trocado pelo nickname correspondente.
    return time.jogadores.map(id => {
      const j = this.jogadores.find(x => x.id === id);
// Troco cada id do time pelo nickname correspondente.
      return j ? j.nickname : '?';
    }).join(', ');
  }
  excluir(time: Time): void {
// A exclusão começa conferindo se o time tem id.
    if (!time.id) return;
    if (!confirm('Excluir o time ' + time.nome + '?')) return;
// A exclusão pede confirmação antes de chamar o DELETE.
    this.timeService.excluir(time.id).subscribe(() => this.carregar());
  }
}
// Depois de excluir eu recarrego a lista para atualizar a tela.
