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
// Também uso select, botões, card e ícones neste formulário.
import { Jogador } from '../../models/jogador.model';
import { JogadorService } from '../../services/jogador.service';
@Component({
  selector: 'app-cadastrar',
  standalone: true,
// Aqui eu declaro o componente e os módulos que o formulário usa.
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
            MatSelectModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './cadastrar.component.html',
  styleUrl: './cadastrar.component.css'
})
// O mesmo componente serve para criar e para editar um jogador.
export class CadastrarComponent implements OnInit {
  jogador: Jogador = {
    nickname: '',
    funcao: 'Rifler',
    time: '',
// O objeto começa com valores padrão para o formulário não ficar vazio.
    mapas: 0,
    kills: 0,
    deaths: 0,
    rating: 1.0
  };
// Rating 1.0 é um valor inicial parecido com a escala do HLTV.
  editando = false;
  mensagem = '';
  constructor(
    private service: JogadorService,
    private route: ActivatedRoute,
// O ActivatedRoute lê a URL e o Router serve para mudar de página.
    private router: Router
  ) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
// Se a rota tiver id, eu estou editando e preciso carregar os dados.
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
// O aviso aparece só quando o nickname foi deixado em branco.
    }
// Não deixo salvar sem nickname e mostro um aviso bem simples.
    if (this.editando && this.jogador.id) {
      this.service.atualizar(this.jogador.id, this.jogador).subscribe(() => this.voltar());
    } else {
      this.service.criar(this.jogador).subscribe(() => this.voltar());
    }
// Na edição eu uso PUT e no cadastro eu uso POST.
  }
  voltar(): void {
// Na edição eu uso PUT; no cadastro eu uso POST e depois volto ao ranking.
    this.router.navigate(['/stats']);
  }
}
// O Router leva de volta para a lista depois que o servidor respondeu.
