import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
// Importo toolbar, botões e ícones para montar o menu principal.
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
// Declaro os módulos que o menu e o router-outlet precisam usar.
            MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
// Esse componente é a casca do site: menu de cima e conteúdo trocável.
export class AppComponent {
  titulo = 'CS2 Stats';
}
// O título aparece no canto esquerdo do toolbar.
