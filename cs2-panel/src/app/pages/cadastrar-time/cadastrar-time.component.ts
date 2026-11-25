import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
// formulário, rotas e campos do Material
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
// não tem mais select: o time nasce vazio
import { Time } from '../../models/time.model';
import { TimeService } from '../../services/time.service';
@Component({
  selector: 'app-cadastrar-time',
  standalone: true,
// segue o fluxo
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
            MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './cadastrar-time.component.html',
  styleUrl: './cadastrar-time.component.css'
// módulos do formulário de time
})
export class CadastrarTimeComponent implements OnInit {
  time: Time = { nome: '', coach: '' };
  editando = false;
  mensagem = '';
// time novo começa com só nome e coach
  constructor(private timeService: TimeService,
              private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
// aqui eu trato o que veio
      this.editando = true;
      this.timeService.buscarPorId(Number(id)).subscribe((dados) => {
        this.time = dados;
      });
    }
// com id na url eu edito; sem id eu crio
  }
  salvar(): void {
    if (this.time.nome.trim() === '' || this.time.coach.trim() === '') {
      this.mensagem = 'Preciso de nome e coach pra criar o time.';
      return;
// deixo isso pronto pra tela
    }
// validação simples, só os dois campos mesmo
    if (this.editando && this.time.id) {
      this.timeService.atualizar(this.time.id, this.time).subscribe(() => this.voltar());
    } else {
      this.timeService.criar(this.time).subscribe(() => this.voltar());
    }
// PUT na edição, POST no cadastro
  }
  voltar(): void {
    this.router.navigate(['/times']);
  }
// depois volto pra lista de times
}
// os jogadores entram depois, no cadastro deles
