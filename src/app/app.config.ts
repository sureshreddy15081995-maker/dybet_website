import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection
} from '@angular/core';

import { provideRouter } from '@angular/router';

import {
  HttpClient,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';

import { AppReducer } from './core/appstates/appState';

import { LoginEffects } from './core/appstates/loginstates/loginEffects';
import { PlayerEffects } from './core/appstates/playerstates/playerEffects';
import { CashierEffects } from './core/appstates/cashierstates/cashierEffects';

import { authInterceptor } from './core/services/auth.interceptor';

import {
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';


// WORKING VERSION
export function HttpLoaderFactory(http: HttpClient) {

  return new TranslateHttpLoader(
    http,
    './assets/i18n/',
    '.json'
  );
}


export const appConfig: ApplicationConfig = {
  providers: [

    provideZoneChangeDetection({
      eventCoalescing: true
    }),

    provideRouter(routes),

    provideStore(AppReducer),

    provideEffects([
      LoginEffects,
      PlayerEffects,
      CashierEffects
    ]),

    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    importProvidersFrom(
      TranslateModule.forRoot({

        defaultLanguage: 'fr',

        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ]
};