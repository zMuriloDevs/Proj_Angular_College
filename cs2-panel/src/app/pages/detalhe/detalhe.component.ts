import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
// Importo o card, os botões e os ícones usados na ficha do jogador.
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Jogador } from '../../models/jogador.model';
import { JogadorService } from '../../services/jogador.service';
@Component({
  selector: 'app-detalhe',
// A rota lê o id da URL, o service busca os dados e o Router muda de página.
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './detalhe.component.html',
  styleUrl: './detalhe.component.css'
})
// Aqui eu digo quais módulos a página de detalhes precisa.
export class DetalheComponent implements OnInit {
  jogador: Jogador | null = null;
  carregando = true;
  constructor(private route: ActivatedRoute, private service: JogadorService,
              private router: Router) {}
// No começo eu leio a URL para saber qual jogador mostrar.
  ngOnInit(): void {
// No início eu pego o id da URL e peço o jogador correspondente ao backend.
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.buscarPorId(Number(id)).subscribe((dados) => {
        this.jogador = dados;
        this.carregando = false;
// Quando a resposta chega eu guardo o jogador e mostro a ficha.
      });
    }
  }
  kd(j: Jogador): string {
    if (j.deaths === 0) return j.kills.toFixed(0);
// O K/D da ficha usa a mesma conta do ranking, com cuidado com zero.
    return (j.kills / j.deaths).toFixed(2);
  }
  excluir(): void {
    if (!this.jogador || !this.jogador.id) return;
    if (!confirm('Excluir ' + this.jogador.nickname + '?')) return;
// Depois de confirmar eu mando o DELETE e volto para o ranking.
    this.service.excluir(this.jogador.id).subscribe(() => this.router.navigate(['/stats']));
  }
  voltar(): void {
    this.router.navigate(['/stats']);
  }
// O método voltar leva o usuário de volta ao ranking.
}
// O botão voltar leva de volta à lista sem apagar nada.
