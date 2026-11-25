import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
export const appConfig: ApplicationConfig = {
// Aqui eu ligo as rotas e o HttpClient para o projeto inteiro usar.
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};
// Sem essas duas linhas as rotas e o nosso service não funcionariam.
