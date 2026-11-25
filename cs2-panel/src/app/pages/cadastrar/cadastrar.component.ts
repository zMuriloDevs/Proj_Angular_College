import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
// formulário, rotas e campos de texto do Material
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
// select, botões e card completam o formulário
import { Jogador } from '../../models/jogador.model';
import { Time } from '../../models/time.model';
import { JogadorService } from '../../services/jogador.service';
import { TimeService } from '../../services/time.service';
// agora o cadastro também precisa dos times
@Component({
  selector: 'app-cadastrar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
            MatSelectModule, MatButtonModule, MatCardModule, MatIconModule],
// segue o fluxo
  templateUrl: './cadastrar.component.html',
  styleUrl: './cadastrar.component.css'
// módulos liberados pro html do formulário
})
export class CadastrarComponent implements OnInit {
  jogador: Jogador = {
    nickname: '',
    funcao: 'Rifler',
// aqui eu trato o que veio
    timeId: null,
    mapas: 0,
    kills: 0,
    deaths: 0
  };
// começo com timeId null, então o jogador entra sem time
  times: Time[] = [];
  jogadores: Jogador[] = [];
  editando = false;
  mensagem = '';
// guardo os times e os jogadores pra contar as vagas
  constructor(private service: JogadorService, private timeService: TimeService,
              private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.service.listar().subscribe((lista) => {
      this.jogadores = lista;
// deixo isso pronto pra tela
      this.timeService.listar().subscribe((times) => {
        this.times = times;
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.editando = true;
// nada de mistério aqui
          this.service.buscarPorId(Number(id)).subscribe((dados) => {
            this.jogador = { ...dados, timeId: dados.timeId ?? null };
          });
        }
      });
// continuo na mesma ideia
    });
// carrego jogadores, times e, se tiver id na url, o jogador a editar
  }
  quantosNoTime(time: Time): number {
    return this.jogadores.filter(j => j.timeId === time.id && j.id !== this.jogador.id).length;
// conto quem já tá no time, ignorando o jogador que estou editando
  }
  timesDisponiveis(): Time[] {
    return this.times.filter(t => this.quantosNoTime(t) < 5 || t.id === this.jogador.timeId);
// time cheio some, menos o atual, que precisa continuar aparecendo
  }
  salvar(): void {
    if (this.jogador.nickname.trim() === '') {
      this.mensagem = 'Digite um nickname antes de salvar.';
      return;
// segue o fluxo
    }
// sem nickname não rola salvar, bem simples
    const escolhido = this.times.find(t => t.id === this.jogador.timeId);
    if (escolhido && this.quantosNoTime(escolhido) >= 5) {
      this.mensagem = 'Esse time já tem 5 jogadores. Escolhe outro.';
      return;
    }
// aqui eu trato o que veio
    const pronto = () => this.voltar();
    const falhou = (erro: any) => {
      this.mensagem = erro?.error?.erro || 'Não consegui salvar.';
    };
// se o time lotou no meio do caminho, aviso antes de chamar o back
    if (this.editando && this.jogador.id) {
      this.service.atualizar(this.jogador.id, this.jogador).subscribe(pronto, falhou);
    } else {
      this.service.criar(this.jogador).subscribe(pronto, falhou);
    }
// edição usa PUT; cadastro novo usa POST
  }
  voltar(): void {
    this.router.navigate(['/stats']);
  }
// depois de salvar eu volto pro ranking
}
// o vínculo agora sai do select e vai como timeId
