import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// cards, botões e ícones dos blocos de destaque
import { RouterLink } from '@angular/router';
import { Jogador } from '../../models/jogador.model';
import { JogadorService } from '../../services/jogador.service';
import { Time } from '../../models/time.model';
import { TimeService } from '../../services/time.service';
// a home cruza jogadores e times
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './home.component.html',
// segue o fluxo
  styleUrl: './home.component.css'
// módulos da página inicial
})
export class HomeComponent implements OnInit {
  jogadores: Jogador[] = [];
  times: Time[] = [];
  carregando = true;
// guardo as duas listas e o estado de carregamento
  constructor(private jogadorService: JogadorService, private timeService: TimeService) {}
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
// primeiro os jogadores e depois os times
    });
  }
  nomeTime(j: Jogador): string {
    const time = this.times.find(t => t.id === j.timeId);
    return time ? time.nome : 'Sem time';
// o detalhe do destaque usa o mesmo nome do cadastro
  }
  valorKd(j: Jogador): number {
    return j.deaths === 0 ? j.kills : j.kills / j.deaths;
// zero deaths vira kills, sem divisão problemática
  }
  kd(j: Jogador): string {
    return this.valorKd(j).toFixed(2);
  }
  pontuacao(j: Jogador): number {
// nada de mistério aqui
    return this.valorKd(j) * Math.sqrt(j.mapas);
// a fórmula continua K/D vezes raiz dos mapas
  }
  jogadorDestaque(): Jogador | null {
    if (this.jogadores.length === 0) return null;
    const copia = [...this.jogadores];
    copia.sort((a, b) => this.pontuacao(b) - this.pontuacao(a) ||
// continuo na mesma ideia
      this.valorKd(b) - this.valorKd(a) || b.mapas - a.mapas || b.kills - a.kills);
    return copia[0];
// desempate: maior K/D, mais mapas e depois mais kills
  }
  jogadoresDoTime(time: Time): Jogador[] {
    return this.jogadores.filter(j => j.timeId === time.id);
// o vínculo está no jogador, então é só filtrar
  }
  totalKills(time: Time): number {
    return this.jogadoresDoTime(time).reduce((soma, j) => soma + j.kills, 0);
  }
  totalMapas(time: Time): number {
// segue o fluxo
    return this.jogadoresDoTime(time).reduce((soma, j) => soma + j.mapas, 0);
// kills e mapas continuam desempatando os times
  }
  mediaPontuacao(time: Time): number {
    const lista = this.jogadoresDoTime(time);
    if (lista.length === 0) return 0;
    return lista.reduce((soma, j) => soma + this.pontuacao(j), 0) / lista.length;
// time vazio não entra na média
  }
  timesComJogadores(): Time[] {
    return this.times.filter(t => this.jogadoresDoTime(t).length > 0);
// time sem ninguém não aparece nos destaques
  }
  timeMaiorKills(): Time | null {
    const copia = [...this.timesComJogadores()];
    if (copia.length === 0) return null;
    copia.sort((a, b) => this.totalKills(b) - this.totalKills(a) || this.totalMapas(b) - this.totalMapas(a));
// aqui eu trato o que veio
    return copia[0];
// destaque de kills, com o mesmo desempate de antes
  }
  timeMaiorPontuacao(): Time | null {
    const copia = [...this.timesComJogadores()];
    if (copia.length === 0) return null;
    copia.sort((a, b) => this.mediaPontuacao(b) - this.mediaPontuacao(a) ||
// deixo isso pronto pra tela
      this.totalKills(b) - this.totalKills(a));
    return copia[0];
// destaque de média, também com o desempate antigo
  }
  nomes(time: Time): string {
    return this.jogadoresDoTime(time).map(j => j.nickname).join(', ');
  }
}
// fórmulas e desempates intactos, só o vínculo mudou
