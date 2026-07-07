import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { LoginService } from '../../core/services/login/login.service';

import * as appState from '../../core/appstates/appState';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { LoginState } from '../../core/appstates/loginstates/loginState';
// import { GameLauncherService } from '../../core/services/gameLauncher/game-launcher.service';

@Injectable({
    providedIn: 'root'
})
export class PlayerLoginStateService {
    storeSub!: Subscription;
    isLoggedIn: boolean = false;

    constructor(private loginService: LoginService, private store: Store<appState.AppState>,) { }


    openLogin(): void {
        this.storeSub = this.store.select('loginState').subscribe(
            (loginState: LoginState) => {
                this.isLoggedIn = loginState.playerLoggedIn?.loggedIn || false;
            }
        );
    }

    getLoginResponse(): Observable<any> {
        return this.loginService.loginResponse$.pipe(
            filter(res => !!res)
        );
    }

    isPlayerLoggedIn(): Observable<boolean> {
        return this.loginService.loginResponse$.pipe(
            map(res => res?.success === true)
        );
    }

    getLoginData(key: string): Observable<any> {
        return this.getLoginResponse().pipe(
            map(res => res[key])
        );
    }
}
