import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as appState from '../../appstates/appState';
import { LoginState } from '../../appstates/loginstates/loginState';
import { LoginService } from '../login/login.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GameLauncherService {
  private storeSub!: Subscription;
  private isLoggedIn = false;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  isLoading = this.loadingSubject.asObservable();


  showLoader() {
    this.loadingSubject.next(true);
  }

  hideLoader() {
    this.loadingSubject.next(false);
  }

  private pendingRequests: Array<() => void> = [];

  constructor(
    private http: HttpClient,
    private store: Store<appState.AppState>,
    private loginService: LoginService,
    private router: Router
  ) {
    this.storeSub = this.store.select('loginState').subscribe(
      (loginState: LoginState) => {
        const wasLoggedIn = this.isLoggedIn;
        this.isLoggedIn = loginState.playerLoggedIn?.loggedIn || false;

        if (!wasLoggedIn && this.isLoggedIn && this.pendingRequests.length > 0) {
          const requests = [...this.pendingRequests];
          this.pendingRequests = [];
          requests.forEach(fn => fn());
        }
      }
    );
  }

  onGameRun(url: string, game: any) {
    // console.log(url);
    // console.log(game);

    const generateId = (): string => crypto.randomUUID();
    const newId = generateId();
    // console.log(newId);

    const gameId = game.gameId || game.id || game.token || game.tableId || newId;

    sessionStorage.setItem(
      'currentGame',
      JSON.stringify({
        gameId,
        url,
        provider: game.prov || '',
        width: '100%',
        height: '100vh',
      })
    );

    const navigationExtras: any = {};
    if (game?.routerPth) {
      navigationExtras.queryParams = { type: game.routerPth };
    }

    this.router.navigate([`/games`, gameId], navigationExtras);
  }




  private httpWsession(providerName: string, data: any) {
    const headers: any = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      wsession: sessionStorage.getItem('wsessionDY') || '',
      siteid: environment.skinId
    };

    if (providerName === 'rubyplay' && data?.gameId) {
      headers['gameId'] = data.gameId;
    } else if (providerName === 'netent' || providerName == 'gameurl') {
      delete headers['wsession'];
    }

    return { headers: new HttpHeaders(headers) };
  }


  private runOrQueueRequest<T>(requestFn: () => Observable<T>): Observable<T> {
    if (this.isLoggedIn) {
      return requestFn();
    } else {
      const subject = new Subject<T>();

      this.pendingRequests.push(() => {
        requestFn().subscribe({
          next: res => subject.next(res),
          error: err => subject.error(err),
          complete: () => subject.complete()
        });
      });

      this.loginService.openLogin();

      return subject.asObservable();
    }
  }

  onGameLaunch(providerName: string, data: any): Observable<any> {
    // console.log("ProviderName : ", providerName)
    // console.log("Provider Data : ", data)
    const endpoints: Record<string, string> = {
      pragmaticplay: environment.api.games.pragmatictoken,
      rubyplay: environment.api.games.rubyPlayLaunch,
      aviatrix: environment.api.games.aviatrixGameLaunch,
      cpgames: environment.api.games.cpgGameLaunch,
      barbarabang: environment.api.games.barbaraGameLaunch,
      mancala: environment.api.games.mancalaGameLaunch,
      netent: environment.api.games.ezugiGameLaunch,
      redtiger: environment.api.games.ezugiGameLaunch,
      habanero: environment.api.games.habaneroGameLaunch,
      vibra: environment.api.games.vibraGameLaunch,
      endorphina: environment.api.games.endorphinaGameLaunch,
      sports: environment.api.games.sporToken,
      ezugistandard: environment.api.games.ezugiGameLaunch,
      gameurl: environment.api.games.gameurl,
      vivogamelaunch: environment.api.games.vivoGameLaunch,
      popokgaming: environment.api.games.popokGameLaunch,
      instantplay: environment.api.games.instantPlay
    };

    const providerKey = providerName.toLowerCase();
    const endpoint = endpoints[providerKey];
    console.log(endpoint)
    if (!endpoint) {
      throw new Error(`Unknown provider: ${providerName}`);
    }

    let body: any = {};
    switch (providerKey) {
      case 'aviatrix':
        body = { gameId: data.gameId, provider: providerKey };
        break;
      case 'cpgames':
        body = { gameId: data.gameId };
        break;
      case 'barbarabang':
        body = { gameId: data.absoluteName };
        break;
      case 'popokgaming':
        body = { "gameId": data.gameId, "provider": data.provider }
        break;
      case 'instantplay':
        body = {
          "gameMode": "",
          "gameId": "",
          "provider": "evenBet"
        }
        break;
      default:
        body = {};
        break;
    }

    let url = `${environment.baseUrl}${endpoint}`;

    let method: 'post' | 'get' = 'post';
    if (providerKey === 'pragmaticplay') {
      url += `/${data.gameId}`;
    } else if (providerKey === 'mancala') {
      url += `/${data?.Id}`;
    } else if (providerKey === 'netent' || providerKey === 'redtiger' || providerKey === 'habanero' || providerKey === 'endorphina' || providerKey === 'sports' || providerKey === 'ezugistandard' || providerKey === 'gameurl') {
      method = 'get';
      url += `/${sessionStorage.getItem('wsessionDY') + (providerName == 'gameurl' ? `/${true}` : '') || ''}${providerKey === 'endorphina' ? '/' + data.gameId : ''}`;
    }
    console.log(providerName)
    if (providerName !== "gameurl") {
      return this.runOrQueueRequest(() => {
        if (method === 'post' && providerName !== "vivogamelaunch") {
          return this.http.post(url, body, this.httpWsession(providerKey, data));
        } else {
          return this.http.get(url, this.httpWsession(providerKey, data));
        }
      });
    } else {
      if (method === 'post') {
        return this.http.post(url, body, this.httpWsession(providerKey, data));
      } else {
        return this.http.get(url, this.httpWsession(providerKey, data));
      }
    }
  }
}
