import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
// Importo os módulos do Material e do router que o menu vai usar.
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
// Importei os ícones e agora começo a configurar o componente principal.
            MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
// Aqui eu digo quais módulos e arquivos esse componente precisa.
export class AppComponent {
  titulo = 'CS2 Stats';
}
// O título aparece no menu e é usado também na aba do navegador.
