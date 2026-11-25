import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StatsComponent } from './pages/stats/stats.component';
import { TimesComponent } from './pages/times/times.component';
import { CadastrarTimeComponent } from './pages/cadastrar-time/cadastrar-time.component';
// Importo também os componentes de cadastro e ficha.
import { CadastrarComponent } from './pages/cadastrar/cadastrar.component';
import { DetalheComponent } from './pages/detalhe/detalhe.component';
// Importo todas as páginas antes de montar a tabela de rotas.
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Início' },
// A página inicial é a Home; o ranking ficou em /stats.
  { path: 'stats', component: StatsComponent, title: 'Estatísticas' },
  { path: 'times', component: TimesComponent, title: 'Times' },
  { path: 'time/novo', component: CadastrarTimeComponent, title: 'Novo time' },
// O cadastro de times tem rota própria para criar e para editar.
  { path: 'time/editar/:id', component: CadastrarTimeComponent, title: 'Editar time' },
  { path: 'novo', component: CadastrarComponent, title: 'Novo jogador' },
  { path: 'editar/:id', component: CadastrarComponent, title: 'Editar jogador' },
  { path: 'jogador/:id', component: DetalheComponent, title: 'Ficha do jogador' },
// Essas três rotas cuidam do cadastro, da edição e da ficha do jogador.
  { path: '**', redirectTo: 'home' }
];
// Qualquer endereço desconhecido volta para a Home.
