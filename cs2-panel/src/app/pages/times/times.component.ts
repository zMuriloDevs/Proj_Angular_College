import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// cards, botões e ícones da lista de times
import { RouterLink } from '@angular/router';
import { Jogador } from '../../models/jogador.model';
import { JogadorService } from '../../services/jogador.service';
import { Time } from '../../models/time.model';
import { TimeService } from '../../services/time.service';
// preciso dos jogadores pra saber quem pertence a cada time
@Component({
  selector: 'app-times',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './times.component.html',
// segue o fluxo
  styleUrl: './times.component.css'
// módulos usados no html da lista
})
export class TimesComponent implements OnInit {
  times: Time[] = [];
  jogadores: Jogador[] = [];
  carregando = true;
// guardo as duas listas e o estado de carregamento
  constructor(private timeService: TimeService, private jogadorService: JogadorService) {}
  ngOnInit(): void { this.carregar(); }
  carregar(): void {
    this.jogadorService.listar().subscribe({
      next: (dados) => {
// aqui eu trato o que veio
        this.jogadores = dados;
        this.timeService.listar().subscribe((lista) => {
          this.times = lista;
          this.carregando = false;
        });
// deixo isso pronto pra tela
      },
      error: () => { this.carregando = false; }
// primeiro os jogadores, depois os times
    });
  }
  doTime(time: Time): Jogador[] {
    return this.jogadores.filter(j => j.timeId === time.id);
// quem tem esse timeId é quem tá no time
  }
  nomes(time: Time): string {
    const lista = this.doTime(time).map(j => j.nickname);
    return lista.length ? lista.join(', ') : 'Sem jogadores';
// se não tiver ninguém, fala que tá vazio
  }
  excluir(time: Time): void {
    if (!time.id) return;
    if (!confirm('Excluir o time ' + time.nome + '? Os jogadores ficam sem time.')) return;
    this.timeService.excluir(time.id).subscribe(() => this.carregar());
// o backend libera os jogadores e eu recarrego a lista
  }
}
// a lista agora reflete o vínculo salvo no jogador
