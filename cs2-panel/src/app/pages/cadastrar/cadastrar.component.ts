import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
// Importo formulários, rotas e os campos de texto do Material.
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
// Select, botões, card e ícones completam o formulário.
import { Jogador } from '../../models/jogador.model';
import { JogadorService } from '../../services/jogador.service';
@Component({
  selector: 'app-cadastrar',
  standalone: true,
// Declaro o componente e os módulos que ele usa no HTML.
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
            MatSelectModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './cadastrar.component.html',
  styleUrl: './cadastrar.component.css'
})
// O mesmo componente cria e edita jogador, conforme a URL.
export class CadastrarComponent implements OnInit {
  jogador: Jogador = {
    nickname: '',
    funcao: 'Rifler',
    time: '',
// Começo com valores padrão para o formulário não ficar vazio.
    mapas: 0,
    kills: 0,
    deaths: 0
  };
// Os números começam em zero e são digitados pelo usuário.
  editando = false;
  mensagem = '';
  constructor(
    private service: JogadorService,
    private route: ActivatedRoute,
// O ActivatedRoute lê a URL e o Router muda de página.
    private router: Router
  ) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
// Com id na URL eu estou editando e preciso carregar os dados.
      this.editando = true;
      this.service.buscarPorId(Number(id)).subscribe((dados) => {
        this.jogador = dados;
      });
    }
// O subscribe preenche o formulário com o que veio do backend.
  }
  salvar(): void {
    if (this.jogador.nickname.trim() === '') {
      this.mensagem = 'Digite um nickname antes de salvar.';
      return;
// O aviso aparece e o método para por aqui.
    }
// Não salvo sem nickname e mostro um aviso bem simples.
    if (this.editando && this.jogador.id) {
      this.service.atualizar(this.jogador.id, this.jogador).subscribe(() => this.voltar());
    } else {
      this.service.criar(this.jogador).subscribe(() => this.voltar());
    }
// Após escolher POST ou PUT, eu fecho o método salvar.
  }
  voltar(): void {
// Na edição eu uso PUT; no cadastro eu uso POST.
    this.router.navigate(['/stats']);
  }
}
// Depois de salvar eu volto para o ranking atualizado.
