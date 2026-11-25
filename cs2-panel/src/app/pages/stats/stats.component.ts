import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
// Importo a tabela, os cards e os campos do Material usados nesta tela.
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// Também preciso de botões, ícones e dos links para as outras rotas.
import { RouterLink } from '@angular/router';
import { Jogador } from '../../models/jogador.model';
import { JogadorService } from '../../services/jogador.service';
@Component({
  selector: 'app-stats',
// Aqui eu começo a configuração do componente da tela de estatísticas.
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatCardModule,
            MatFormFieldModule, MatInputModule, MatSelectModule,
            MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './stats.component.html',
// Esses módulos liberam a tabela, o formulário e as diretivas no HTML.
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit {
  jogadores: Jogador[] = [];
  exibidos: Jogador[] = [];
// Guardo a lista completa e a lista já filtrada que aparece na tabela.
  busca = '';
  funcaoFiltro = 'Todos';
  funcoes = ['Todos', 'AWPer', 'Rifler', 'IGL', 'Entry'];
  colunas = ['posicao', 'nickname', 'time', 'funcao', 'mapas',
             'kills', 'deaths', 'kd', 'rating', 'acoes'];
// As colunas seguem a mesma ordem das células que eu monto no HTML.
  carregando = true;
  mensagem = '';
  constructor(private service: JogadorService) {}
  ngOnInit(): void { this.carregar(); }
// Ao abrir a página eu já peço a lista de jogadores para o backend.
  carregar(): void {
    this.service.listar().subscribe({
      next: (dados) => {
        this.jogadores = dados;
        this.aplicarFiltros();
// Depois de aplicar o filtro eu tiro o estado de carregando.
        this.carregando = false;
      },
// Quando os dados chegam eu aplico o filtro e tiro a mensagem de carregando.
      error: () => { this.carregando = false; }
    });
  }
  aplicarFiltros(): void {
// Esse método roda também quando o usuário digita ou muda o filtro.
    const termo = this.busca.trim().toLowerCase();
    const filtrados = this.jogadores.filter(j => {
      const nomeOk = j.nickname.toLowerCase().includes(termo);
      const timeOk = j.time.toLowerCase().includes(termo);
      const funcaoOk = this.funcaoFiltro === 'Todos' || j.funcao === this.funcaoFiltro;
// O jogador aparece se o nome ou o time baterem com a busca e a função bater.
      return (nomeOk || timeOk) && funcaoOk;
    });
    filtrados.sort((a, b) => b.rating - a.rating || b.kills - a.kills);
    this.exibidos = filtrados.map((j, i) => ({ ...j, posicao: i + 1 }));
  }
// Ordeno por rating e coloco a posição # de cada linha do ranking.
  kd(j: Jogador): string {
    if (j.deaths === 0) return j.kills.toFixed(0);
    return (j.kills / j.deaths).toFixed(2);
  }
  importar(): void {
// O K/D é simples: kills dividido por deaths, cuidando para não dividir por zero.
    this.mensagem = 'Importando dados da CS2 Leaderboard...';
    this.service.importar().subscribe((res) => {
      this.mensagem = res.adicionados + ' jogadores adicionados ao banco.';
      this.carregar();
    }, () => { this.mensagem = 'Não consegui importar. O backend está ligado?'; });
// Depois de importar eu recarrego a tabela para mostrar os jogadores novos.
  }
  excluir(j: Jogador): void {
    if (!j.id) return;
    if (!confirm('Excluir o jogador ' + j.nickname + '?')) return;
    this.service.excluir(j.id).subscribe(() => this.carregar());
// A exclusão recarrega a lista para atualizar a tela.
  }
}
// A exclusão pede confirmação e depois atualiza a lista na tela.
