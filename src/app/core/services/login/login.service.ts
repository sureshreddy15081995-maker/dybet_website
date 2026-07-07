import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Login } from '../../modules/login/login';
import { PlayerService } from '../player/player.service';
import { Store } from '@ngrx/store';
import * as appState from '../../appstates/appState';
import { PlayerLoggedIn } from '../../appstates/loginstates/loginActions';
import { PlayerGetProfile } from '../../appstates/playerstates/playerActions';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private showLoginSubject = new BehaviorSubject<any>(false);
  showLogin$ = this.showLoginSubject.asObservable();

  private showRegisterSubject = new BehaviorSubject<any>(false);
  showRegister$ = this.showRegisterSubject.asObservable();


  private loginResponseSubject = new BehaviorSubject<any>(null);
  loginResponse$ = this.loginResponseSubject.asObservable();

  constructor(private httpClient: HttpClient,
    private playerService: PlayerService,
    private store: Store<appState.AppState>
  ) {
    if (sessionStorage.getItem('wsessionDY')) {
      this.onPlayerLoggedIn(true);
    }
  }

  openLogin() {
    this.showLoginSubject.next({ status: true });
  };

  openRegister() {
    this.showRegisterSubject.next({ status: true });
  };

  closeLogin() {
    this.showLoginSubject.next(false);
  };

  closeRegister() {
    this.showRegisterSubject.next({ status: false });
  };

  httpOptions() {
    let option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'siteid': environment.skinId
      })
    }
    return option;
  };

  httpOptionsotp() {
    let option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return option;
  };

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'siteid': environment.skinId
  });

  onPlayerLoggedIn(value: boolean) {
    this.store.dispatch(new PlayerLoggedIn({ loggedIn: value }));
  };

  onGetPlayerProfile() {
    this.store.dispatch(new PlayerGetProfile());
  }

  onLogin(postdata: Object) {
    return this.httpClient.post<Login>(`${environment.baseUrl}${environment.api.player.login}`, postdata, this.httpOptions())
      .pipe(
        tap((res: any) => {
          this.loginResponseSubject.next(res);
          this.onPlayerLoggedIn(res?.success === true);
          if (res?.success) this.onGetPlayerProfile();
        }),
        catchError(err => {
          this.onPlayerLoggedIn(false);
          return throwError(() => err);
        })
      );
  }


  onLogOut(): Observable<Login> {
    return this.httpClient.post<Login>(`${environment.baseUrl}${environment.api.player.logout}`, {}, this.playerService.httpOptions());
  }

  onRegister(postdata: Object) {
    return this.httpClient.post<Login>(`${environment.baseUrl}${environment.api.player.register}`, postdata, this.httpOptions());
  }

  onForgotPassword(postdata: Object) {
    return this.httpClient.post(`${environment.baseUrl}${environment.api.player.fotgotPassword}`, postdata, this.httpOptions());
  }

}
