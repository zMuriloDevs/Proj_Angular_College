import { Routes } from '@angular/router';
import { StatsComponent } from './pages/stats/stats.component';
import { CadastrarComponent } from './pages/cadastrar/cadastrar.component';
import { DetalheComponent } from './pages/detalhe/detalhe.component';
export const routes: Routes = [
// Eu importo as três páginas e monto a tabela de rotas do aplicativo.
  { path: '', redirectTo: 'stats', pathMatch: 'full' },
  { path: 'stats', component: StatsComponent, title: 'Estatísticas' },
  { path: 'novo', component: CadastrarComponent, title: 'Novo jogador' },
  { path: 'editar/:id', component: CadastrarComponent, title: 'Editar jogador' },
  { path: 'jogador/:id', component: DetalheComponent, title: 'Ficha do jogador' },
// A rota com :id serve para editar e para abrir a ficha de um jogador.
  { path: '**', redirectTo: 'stats' }
];
// Cada endereço mostra um componente dentro do router-outlet.
