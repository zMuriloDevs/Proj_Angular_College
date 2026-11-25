import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StatsComponent } from './pages/stats/stats.component';
import { TimesComponent } from './pages/times/times.component';
import { CadastrarTimeComponent } from './pages/cadastrar-time/cadastrar-time.component';
// puxei as páginas antes de montar as rotas
import { CadastrarComponent } from './pages/cadastrar/cadastrar.component';
import { DetalheComponent } from './pages/detalhe/detalhe.component';
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Início' },
// barra vazia já cai na Home
  { path: 'stats', component: StatsComponent, title: 'Estatísticas' },
  { path: 'times', component: TimesComponent, title: 'Times' },
  { path: 'time/novo', component: CadastrarTimeComponent, title: 'Novo time' },
  { path: 'time/editar/:id', component: CadastrarTimeComponent, title: 'Editar time' },
// cadastro de time serve pra criar e editar
  { path: 'novo', component: CadastrarComponent, title: 'Novo jogador' },
  { path: 'editar/:id', component: CadastrarComponent, title: 'Editar jogador' },
  { path: 'jogador/:id', component: DetalheComponent, title: 'Ficha do jogador' },
// o mesmo formulário de jogador faz os dois caminhos
  { path: '**', redirectTo: 'home' }
];
// endereço que não existe volta pra Home
