import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
export const appConfig: ApplicationConfig = {
// segue o fluxo
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
// liguei as rotas e o HttpClient, o resto os services resolvem
};
// sem essas duas linhas nada de rotas ou chamada na API
