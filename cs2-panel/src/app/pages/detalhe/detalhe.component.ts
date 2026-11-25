import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
// card, botões e ícones prontos do Material
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Jogador } from '../../models/jogador.model';
import { Time } from '../../models/time.model';
import { JogadorService } from '../../services/jogador.service';
import { TimeService } from '../../services/time.service';
// preciso dos dois services pra mostrar o time na ficha
@Component({
  selector: 'app-detalhe',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './detalhe.component.html',
// segue o fluxo
  styleUrl: './detalhe.component.css'
// módulos da ficha do jogador
})
export class DetalheComponent implements OnInit {
  jogador: Jogador | null = null;
  times: Time[] = [];
  carregando = true;
// guardo o jogador, os times e o estado de carregamento
  constructor(private route: ActivatedRoute, private service: JogadorService,
              private timeService: TimeService, private router: Router) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
// aqui eu trato o que veio
      this.service.buscarPorId(Number(id)).subscribe((dados) => {
        this.jogador = dados;
        this.timeService.listar().subscribe((lista) => {
          this.times = lista;
          this.carregando = false;
// deixo isso pronto pra tela
        });
      });
    }
// pego o id da url, o jogador e depois os times
  }
  nomeTime(j: Jogador): string {
    const time = this.times.find(t => t.id === j.timeId);
    return time ? time.nome : 'Sem time';
// mesmo helper do ranking, sem inventar texto de time
  }
  kd(j: Jogador): string {
    if (j.deaths === 0) return j.kills.toFixed(0);
    return (j.kills / j.deaths).toFixed(2);
// se não tem deaths, mostro só as kills
  }
  excluir(): void {
    if (!this.jogador || !this.jogador.id) return;
    if (!confirm('Excluir ' + this.jogador.nickname + '?')) return;
    this.service.excluir(this.jogador.id).subscribe(() => this.router.navigate(['/stats']));
// se o back barrar por causa do time, o ranking mostra o aviso
  }
  voltar(): void {
    this.router.navigate(['/stats']);
  }
// voltar só troca de página, não apaga nada
}
// ficha pronta com o time real do jogador
