import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
// toolbar, botões e ícones do menu
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-root',
  standalone: true,
// a casca do site é standalone mesmo
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
            MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
// menu em cima, conteúdo trocável embaixo
})
export class AppComponent {
  titulo = 'EcoStats';
}
// o título fica no canto esquerdo do toolbar
