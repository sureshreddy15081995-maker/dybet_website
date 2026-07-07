import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameCmsService { 
  constructor(private http: HttpClient) { };
  private providerSource = new BehaviorSubject<string>('all');
  provider$ = this.providerSource.asObservable();

  setProvider(name: string) {
    this.providerSource.next(name);
  }
  httpWsession() {
    let option = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        wsession: sessionStorage.getItem("wsessionDY") || '',
        siteid: environment.skinId
      }),
    }
    return option;
  };
  private providersListCache$!: Observable<any>;
  getProvidersLists(): Observable<any> {
    if (!this.providersListCache$) {
      this.providersListCache$ = this.http.get(`${"https://play.bet.ar/"}${'providersList.json'}`)
        .pipe(shareReplay(1));
    }
    return this.providersListCache$;
  }
  getGamesList(provider: any) {
    return this.http.get(`/capi/games-lists?filters[gameProviderName][$eq]=${provider}&fields[0]=gamesList&fields[1]=gameProviderName&populate[tags][fields][0]=tags`);
  }
  getEventBanners(local: any) {
    return this.http.get(`/capi/event-banners?locale=${local}&filters[ImageStatus][$eq]=active&fields[0]=ImageStatus&fields[1]=locale&fields[2]=eventName&populate[eventBanner][fields][0]=url`);
  }
  getpermissionList(postData:any) {
    return this.http.post(`${environment.baseUrl}${environment.api.games.getpermissionData}`,postData, this.httpWsession());
  }
  getprovidersbeforelogin() { 
    return this.http.post(`${environment.baseUrl}${environment.api.games.getprovidersbeforelogin}`, this.httpWsession());
  }
  gamelunallproviders(provider:any, gameId:any) {
    return this.http.get(`${environment.baseUrl}${environment.api.games.playVivoHandlar}/${provider}/${gameId}/en`, this.httpWsession());
  }
}
