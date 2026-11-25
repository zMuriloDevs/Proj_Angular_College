import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
// Formulário, rotas e campos do Material são usados nesta tela.
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
// Select, botões e ícones completam o formulário de time.
import { Time } from '../../models/time.model';
import { TimeService } from '../../services/time.service';
import { Jogador } from '../../models/jogador.model';
import { JogadorService } from '../../services/jogador.service';
@Component({
// Começo a configuração do componente de times.
  selector: 'app-cadastrar-time',
  standalone: true,
// Configuro o componente e os módulos liberados para o HTML.
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
            MatSelectModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './cadastrar-time.component.html',
  styleUrl: './cadastrar-time.component.css'
})
// O mesmo formulário cria e edita um time conforme a URL.
export class CadastrarTimeComponent implements OnInit {
  time: Time = { nome: '', coach: '', jogadores: [0, 0, 0, 0, 0] };
  jogadores: Jogador[] = [];
  numeros = [0, 1, 2, 3, 4];
// Começo com cinco vagas vazias para os jogadores do time.
  editando = false;
  mensagem = '';
  constructor(private timeService: TimeService, private jogadorService: JogadorService,
// Os services carregam os dados e o Router muda de página.
              private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.jogadorService.listar().subscribe((lista) => {
      this.jogadores = lista;
// Primeiro eu preciso dos jogadores para encher os selects.
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.timeService.buscarPorId(Number(id)).subscribe((dados) => {
// Com id na URL eu carrego o time que será editado.
        this.time = dados;
        while (this.time.jogadores.length < 5) this.time.jogadores.push(0);
      });
    }
// Se o time vier com menos de 5 ids, eu completo com vagas vazias.
  }
  validar(): boolean {
    if (this.time.nome.trim() === '' || this.time.coach.trim() === '') return false;
    if (this.time.jogadores.length !== 5) return false;
// Nome e coach são obrigatórios e precisam de exatamente cinco jogadores.
    if (this.time.jogadores.some(id => id === 0)) return false;
    return new Set(this.time.jogadores).size === 5;
  }
  salvar(): void {
    if (!this.validar()) {
// Se a validação falhar, eu mostro o aviso na tela.
      this.mensagem = 'Preencha nome, coach e escolha 5 jogadores diferentes.';
      return;
    }
// Se faltar alguma coisa, eu mostro o aviso e não chamo o backend.
    if (this.editando && this.time.id) {
      this.timeService.atualizar(this.time.id, this.time).subscribe(() => this.voltar());
    } else {
      this.timeService.criar(this.time).subscribe(() => this.voltar());
    }
// Fecho o salvar antes de criar o método voltar.
  }
  voltar(): void {
// Na edição uso PUT; no cadastro uso POST e depois volto à lista.
    this.router.navigate(['/times']);
  }
}
// O backend ainda confere a regra antes de gravar no arquivo.
