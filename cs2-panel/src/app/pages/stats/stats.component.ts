import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
// Importo tabela, cards e campos do Material usados no ranking.
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// Botões, ícones e links completam os recursos desta tela.
import { RouterLink } from '@angular/router';
import { Jogador } from '../../models/jogador.model';
import { JogadorService } from '../../services/jogador.service';
@Component({
  selector: 'app-stats',
// Declaro que este componente é standalone.
  standalone: true,
// Configuro o componente e os módulos que o HTML pode usar.
  imports: [CommonModule, FormsModule, MatTableModule, MatCardModule,
            MatFormFieldModule, MatInputModule, MatSelectModule,
            MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
// Termino a configuração antes da classe.
})
// A tabela mostra a lista já filtrada e ordenada pelo melhor K/D.
export class StatsComponent implements OnInit {
  jogadores: Jogador[] = [];
  exibidos: Jogador[] = [];
  busca = '';
  funcaoFiltro = 'Todos';
// Guardo a lista completa e a lista que aparece na tela.
  funcoes = ['Todos', 'AWPer', 'Rifler', 'IGL', 'Entry'];
  colunas = ['posicao', 'nickname', 'time', 'funcao', 'mapas',
             'kills', 'deaths', 'kd', 'acoes'];
// As colunas seguem a ordem das células montadas no HTML.
  carregando = true;
  mensagem = '';
  constructor(private service: JogadorService) {}
  ngOnInit(): void { this.carregar(); }
// Ao abrir a página eu já peço a lista de jogadores ao backend.
  carregar(): void {
    this.service.listar().subscribe({
      next: (dados) => {
        this.jogadores = dados;
        this.aplicarFiltros();
// Depois de filtrar eu libero a tabela para aparecer.
        this.carregando = false;
// Com os dados em mãos eu filtro e libero a tabela para aparecer.
      },
      error: () => { this.carregando = false; }
    });
  }
  aplicarFiltros(): void {
// O filtro começa transformando a busca em minúsculas.
    const termo = this.busca.trim().toLowerCase();
    const filtrados = this.jogadores.filter(j => {
      const nomeOk = j.nickname.toLowerCase().includes(termo);
// A busca aceita nome ou time; a função pode ser Todos ou uma específica.
      const timeOk = j.time.toLowerCase().includes(termo);
      const funcaoOk = this.funcaoFiltro === 'Todos' || j.funcao === this.funcaoFiltro;
      return (nomeOk || timeOk) && funcaoOk;
    });
    filtrados.sort((a, b) => this.valorKd(b) - this.valorKd(a) || b.kills - a.kills);
// Ordeno pelo maior K/D e coloco a posição # em cada linha.
    this.exibidos = filtrados.map((j, i) => ({ ...j, posicao: i + 1 }));
  }
  valorKd(j: Jogador): number {
    return j.deaths === 0 ? j.kills : j.kills / j.deaths;
// Cuidado para não dividir por zero quando o jogador não tem deaths.
  }
  kd(j: Jogador): string {
    return this.valorKd(j).toFixed(2);
  }
  desfazer(): void {
// O Desfazer fica visível porque é uma ação segura e fácil de explicar.
    this.service.desfazer().subscribe((res) => {
      this.mensagem = res.mensagem;
      this.carregar();
    }, () => { this.mensagem = 'Não consegui desfazer.'; });
  }
// Depois de desfazer eu recarrego para a tabela mostrar o estado anterior.
  resetar(): void {
    if (!confirm('Isso apaga os times e volta aos 5 jogadores. Continuar?')) return;
    this.service.resetar().subscribe((res) => {
      this.mensagem = res.mensagem;
      this.carregar();
// O Reset pede confirmação porque ele apaga os times cadastrados.
    }, () => { this.mensagem = 'Não consegui restaurar os dados.'; });
  }
  excluir(j: Jogador): void {
    if (!j.id) return;
    if (!confirm('Excluir o jogador ' + j.nickname + '?')) return;
// A exclusão também pede confirmação antes de chamar o DELETE.
    this.service.excluir(j.id).subscribe(() => this.carregar(),
      () => { this.mensagem = 'Esse jogador está em um time.'; });
  }
}
// Depois de excluir eu atualizo a tela ou aviso se ele estiver em um time.
