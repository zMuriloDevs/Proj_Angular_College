import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
// puxei o que a tabela e o formulário precisam
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
// campos de busca e filtro do Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
// botões, ícones e o link pra navegar
import { Jogador } from '../../models/jogador.model';
import { Time } from '../../models/time.model';
import { JogadorService } from '../../services/jogador.service';
import { TimeService } from '../../services/time.service';
// agora entram os dois services pra cruzar jogador e time
@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatCardModule,
            MatFormFieldModule, MatInputModule, MatSelectModule,
// segue o fluxo
            MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
// componente standalone com os módulos que o html usa
})
export class StatsComponent implements OnInit {
  jogadores: Jogador[] = [];
  exibidos: Jogador[] = [];
  times: Time[] = [];
// guardo a lista cheia, a filtrada e os times cadastrados
  busca = '';
  funcaoFiltro = 'Todos';
  funcoes = ['Todos', 'AWPer', 'Rifler', 'IGL', 'Entry'];
// esses são os estados dos filtros da tela
  colunas = ['posicao', 'nickname', 'time', 'funcao', 'mapas',
             'kills', 'deaths', 'kd', 'acoes'];
  carregando = true;
  mensagem = '';
// colunas da tabela, aviso de carregamento e mensagem de retorno
  constructor(private service: JogadorService, private timeService: TimeService) {}
  ngOnInit(): void { this.carregar(); }
// logo que abre a página eu já vou buscar os dados
  carregar(): void {
    this.service.listar().subscribe({
      next: (dados) => {
        this.jogadores = dados;
        this.timeService.listar().subscribe((lista) => {
// aqui eu trato o que veio
          this.times = lista;
          this.aplicarFiltros();
          this.carregando = false;
        });
      },
// deixo isso pronto pra tela
      error: () => { this.carregando = false; }
// primeiro os jogadores, depois os times, aí libero a tabela
    });
  }
  nomeTime(j: Jogador): string {
    const time = this.times.find(t => t.id === j.timeId);
    return time ? time.nome : 'Sem time';
// se o id não casar com nenhum time, mostro Sem time
  }
  aplicarFiltros(): void {
    const termo = this.busca.trim().toLowerCase();
    const filtrados = this.jogadores.filter(j => {
      const nomeOk = j.nickname.toLowerCase().includes(termo);
// nada de mistério aqui
      const timeOk = this.nomeTime(j).toLowerCase().includes(termo);
// a busca por time agora usa o nome cadastrado, não texto solto
      const funcaoOk = this.funcaoFiltro === 'Todos' || j.funcao === this.funcaoFiltro;
      return (nomeOk || timeOk) && funcaoOk;
    });
    filtrados.sort((a, b) => this.valorKd(b) - this.valorKd(a) || b.kills - a.kills);
    this.exibidos = filtrados.map((j, i) => ({ ...j, posicao: i + 1 }));
// ordeno pelo maior K/D e coloco o número da posição
  }
  valorKd(j: Jogador): number {
    return j.deaths === 0 ? j.kills : j.kills / j.deaths;
// sem deaths eu uso kills, nada de dividir por zero
  }
  kd(j: Jogador): string {
    return this.valorKd(j).toFixed(2);
  }
  desfazer(): void {
// continuo na mesma ideia
    this.service.desfazer().subscribe((res) => {
      this.mensagem = res.mensagem;
      this.carregar();
    }, () => { this.mensagem = 'Não consegui desfazer.'; });
// desfazer recarrega tudo, já que pode ter mexido nos dois bancos
  }
  resetar(): void {
    if (!confirm('Isso apaga todos os jogadores e times. Continuar?')) return;
    this.service.resetar().subscribe((res) => {
      this.mensagem = res.mensagem;
// segue o fluxo
      this.carregar();
    }, () => { this.mensagem = 'Não consegui restaurar os dados.'; });
// reset pede confirmação porque limpa os times
  }
  excluir(j: Jogador): void {
    if (!j.id) return;
    if (!confirm('Excluir o jogador ' + j.nickname + '?')) return;
    this.service.excluir(j.id).subscribe(() => this.carregar(),
// aqui eu trato o que veio
      () => { this.mensagem = 'Esse jogador está em um time. Tira ele do time primeiro.'; });
// se o back barrar, mostro o aviso certinho pra ela
  }
}
// pronto, a coluna Time agora vem do time cadastrado
