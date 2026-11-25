import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// Uso cards, botões e ícones para montar os blocos de destaque.
import { RouterLink } from '@angular/router';
import { Jogador } from '../../models/jogador.model';
import { JogadorService } from '../../services/jogador.service';
import { Time } from '../../models/time.model';
import { TimeService } from '../../services/time.service';
// Agora configuro o componente e seus módulos.
@Component({
  selector: 'app-home',
  standalone: true,
// Declaro os módulos e os arquivos de template e estilo da Home.
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
// A Home cruza os dados de jogadores e times para escolher os destaques.
export class HomeComponent implements OnInit {
  jogadores: Jogador[] = [];
  times: Time[] = [];
  carregando = true;
// Guardo as duas listas e o estado de carregamento da página.
  constructor(private jogadorService: JogadorService, private timeService: TimeService) {}
  ngOnInit(): void { this.carregar(); }
  carregar(): void {
    this.jogadorService.listar().subscribe({
// Primeiro carrego os jogadores; depois carrego os times.
      next: (dados) => {
        this.jogadores = dados;
        this.timeService.listar().subscribe((lista) => {
          this.times = lista;
          this.carregando = false;
// Fecho o subscribe dos times dentro do dos jogadores.
        });
      },
// Quando as duas listas chegam, a tela sai do estado de carregando.
      error: () => { this.carregando = false; }
    });
  }
  valorKd(j: Jogador): number {
    return j.deaths === 0 ? j.kills : j.kills / j.deaths;
// Fecho o cálculo do K/D antes de formatar com duas casas.
  }
  kd(j: Jogador): string {
// Se deaths for zero, eu uso kills para não dividir por zero.
    return this.valorKd(j).toFixed(2);
  }
  pontuacao(j: Jogador): number {
    return this.valorKd(j) * Math.sqrt(j.mapas);
// A pontuação será usada para ordenar o destaque.
  }
  jogadorDestaque(): Jogador | null {
// A pontuação multiplica o K/D pela raiz dos mapas para dar peso ao volume.
    if (this.jogadores.length === 0) return null;
    const copia = [...this.jogadores];
    copia.sort((a, b) => this.pontuacao(b) - this.pontuacao(a) ||
      this.valorKd(b) - this.valorKd(a) || b.mapas - a.mapas || b.kills - a.kills);
    return copia[0];
// Ordeno pela pontuação e desempato por K/D, mapas e kills.
  }
  jogadoresDoTime(time: Time): Jogador[] {
    const lista: Jogador[] = [];
    for (const id of time.jogadores) {
      const encontrado = this.jogadores.find(j => j.id === id);
// Cada id do time é procurado na lista de jogadores cadastrados.
      if (encontrado) lista.push(encontrado);
    }
    return lista;
  }
// Agora somo os números usados no desempate dos times.
  totalKills(time: Time): number {
    return this.jogadoresDoTime(time).reduce((soma, j) => soma + j.kills, 0);
  }
  totalMapas(time: Time): number {
// Somar kills e mapas ajuda a desempatar dois times com a mesma média.
    return this.jogadoresDoTime(time).reduce((soma, j) => soma + j.mapas, 0);
  }
  mediaPontuacao(time: Time): number {
    const lista = this.jogadoresDoTime(time);
// Se o time não tiver jogadores, a média é zero.
    if (lista.length === 0) return 0;
    return lista.reduce((soma, j) => soma + this.pontuacao(j), 0) / lista.length;
  }
  timeMaiorKills(): Time | null {
// A média é a soma das pontuações dos 5 jogadores dividida por 5.
    if (this.times.length === 0) return null;
    const copia = [...this.times];
    copia.sort((a, b) => this.totalKills(b) - this.totalKills(a) || this.totalMapas(b) - this.totalMapas(a));
    return copia[0];
// Fecho o destaque por kills e abro o de média.
  }
  timeMaiorPontuacao(): Time | null {
    if (this.times.length === 0) return null;
    const copia = [...this.times];
// Esse destaque usa a média da pontuação dos 5 jogadores.
    copia.sort((a, b) => this.mediaPontuacao(b) - this.mediaPontuacao(a) ||
      this.totalKills(b) - this.totalKills(a));
    return copia[0];
  }
// Por fim eu transformo os ids em uma lista de nomes.
  nomes(time: Time): string {
    return this.jogadoresDoTime(time).map(j => j.nickname).join(', ');
  }
}
// Os nomes aparecem juntos para mostrar quem forma cada time.
