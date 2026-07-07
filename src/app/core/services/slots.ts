import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of, switchMap, take } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlayerService } from './player/player.service';
import { GameCmsService } from './games_cms/game-cms.service';

@Injectable({
  providedIn: 'root'
})
export class Slots {
  private secondheader = '../../assets/second_header.json';
  private gamesSubject = new BehaviorSubject<any[]>([]);
  public games$ = this.gamesSubject.asObservable();

  public providerListSubject = new BehaviorSubject<any[]>([]);
  public providerList$ = this.providerListSubject.asObservable();

  private bannerSubject = new BehaviorSubject<any[]>([]);
  banners$ = this.bannerSubject.asObservable();

  private loaded = false;
  constructor(private http:HttpClient, private playerService:PlayerService, private gameserive:GameCmsService){

  }
  loadBanners() { 
    if (this.loaded) {
      return;
    }
    this.loaded = true;
    this.banners().subscribe((data: any) => {
      if (data) {
        const activeBanners = data.data.filter(
          (item: any) => item.ImageStatus === 'active'
        );

        this.bannerSubject.next(activeBanners);
      }
    });
  }
httpOptions() { 
  let options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      siteid: environment.skinId,
      'wsession': sessionStorage.getItem('wsessionDY')  || ''  
    })
  }; 
  return options;
} 
secondheaderline():Observable<any>{
return this.http.get(this.secondheader)
}
sportgm() {
  return this.http.get(`${environment.baseUrl}${environment.api.games.sportoken}`,this.httpOptions());    
  }
  getGamesList(): Observable<any[]> {
    return this.http.get<any[]>(`capi/games-lists?filters[gameProviderName][$eq]=gamesList&fields[0]=gamesList&fields[1]=gameProviderName&populate[tags][fields][0]=tags`);
  }
  banners(){
   return this.http.get('/capi/home-banners?locale=en&fields[0]=routerLink&fields[1]=ImageStatus&fields[2]=locale&populate[heroBanner][fields][0]=url')
  }
  onContactUsSendStats(postdata:any){
    return this.http.post(`${environment.baseUrl}${environment.api.player.contactus}`, postdata);
  }
  onCashierWithdrawCashout(postData:any) {
    return this.http.post(`${environment.baseUrl}${environment.api.cashier.withDrawCashout}`, postData, this.httpOptions());
   }
   PaymentMethodslist() {
    return this.http.post(`${environment.baseUrl}${environment.api.cashier.PaymentMethods}`,{}, this.httpOptions());
   }
   sportsURL(sessionId: string) {
    return this.http.get(
      `${environment.baseUrl}${environment.api.games.sporToken}/${sessionId}`,
      this.httpOptions()
    );
  }
  getProviderList(loggedin: any) {
    if (loggedin) {
      return this.playerService.onPlayerGetProfile().pipe(
        take(1),
        switchMap((data: any) => {
      const body = {
        role: 0,
        loginName: data.login
      };
      return this.gameserive.getpermissionList(body);
        })
      );
    } else {
      return this.gameserive.getprovidersbeforelogin();
    }
  }
  fetchAllGames11(data: any) {
    forkJoin({
      games: this.getGamesList(),
      providers: this.getProviderList(data)   
    }).subscribe(
      (res: any) => {
  
        const games = res.games.data[0].gamesList || [];
        const providers = res.providers || [];
        this.filterGamesByProvider(games, providers, data);
  
      },
      (error) => {
        console.error('API Error:', error);
  
        // fallback to empty arrays to avoid crash
        this.filterGamesByProvider([], [], data);
      }
    );
  }
  filterGamesByProvider(games: any[], providers: any[], data: any): void {

    let enabledProviders: any;
  
    if (data) {
      enabledProviders = new Set(
        providers
          .filter(function (p) {
            return p && p.status && p.name;
          })
          .map(function (p) {
            return p.name.toLowerCase();
          })
      );
    } else {
      enabledProviders = new Set(
        providers
          .filter(function (p) {
            return p && p.name;
          })
          .map(function (p) {
            return p.name.toLowerCase();
          })
      );
    }
  
    this.providerListSubject.next(enabledProviders);
  
    let filteredGames = games.filter(function (game: any) {
      return game && game.provider && enabledProviders.has(game.provider.toLowerCase());
    });
  
    console.log(filteredGames);
  
  console.log('Final Games List:', filteredGames);

  this.gamesSubject.next(filteredGames);


    this.gamesSubject.next(filteredGames);
  
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(function () {
        preloader.style.display = 'none';
      }, 500);
    }
  }
  httpWsessionlang() {
    let opotion = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        wsession: sessionStorage.getItem("wsessionDY") || '',
        siteid: environment.skinId,
        lang:'en-US'

      }),
    }
    return opotion;
  };
  httpOption(){
    let option = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        siteid: environment.skinId,
      }),

    }
    return option
  }; 
  killGameSession(body: any) {
    return this.http.post<any>(`${environment.baseUrl}${environment.api.games.closeGameSession}`, body, this.httpOptions())
  }
  huidugameAggregator(body: any) {
    return this.http.post<any>(`${environment.baseUrl}${environment.api.games.huidu}`, body, this.httpOptions())
  }
  aviatrixprovider(postData:any) {
    return this.http.post(`${environment.baseUrl}${environment.api.games.aviatrix}`,postData, this.httpOptions());
  }
  kingmidaslaunch(postData:any) {
    return this.http.post(`${environment.baseUrl}${environment.api.games.kingmidas}`, postData, this.httpWsessionlang());
  }
  kagamingl(payload: any) {
    return this.http.post<any>(`${environment.baseUrl}${environment.api.games.kagame}`,  payload,   this.httpOptions() );
  }
  httpClient(data:any, gameId:any): Observable<any>  {
    return this.http.get<any>(`${environment.baseUrl}${environment.api.games.heblounch}/${data}/${gameId}`, this.httpOptions());
  }
  indiecasino(data:any): Observable<any>   {
    return this.http.get<any>(`${environment.baseUrl}${environment.api.games.indiecasino}/${data}`,this.httpOption() );
  }
  aviatorgame(data:any) {     
    return this.http.post(`${environment.baseUrl}${environment.api.games.aviator}`,data, this.httpOptions());
  }
  getpragmatichit(data:any) {
    let body = { }
    return this.http.post(`${environment.baseUrl}${environment.api.games.pragmatictoken}${data}`,body, this.httpOptions());
  }
  gvprovider(body:any){
    return this.http.post(`${environment.baseUrl}${environment.api.games.GV}`,body, this.httpOptions())
  }
  jilligames(body:any){
    return this.http.post(`${environment.baseUrl}${environment.api.games.jilliprovider}`,body, this.httpOptions())
  }
  wearelottoprovider(postData:any) {
    return this.http.post(`${environment.baseUrl}${environment.api.games.wearelotto}`,postData, this.httpOptions());
  }
  gamelunallvivogaming( ) {
    return this.http.get(`${environment.baseUrl}${environment.api.games.vivolivecasino}` , this.httpOptions());
  }
  peachesProvider(body:any){
    return this.http.post(`${environment.baseUrl}${environment.api.games.peaches}`,body, this.httpOptions());
  }
  depositnew(body:any){
        return this.http.post(`${environment.baseUrl}${environment.api.cashier.depsoibuy}`,body, this.httpOptions());
}

  jdbLaunch(gtype: any, mtype: any) {
    console.log('Sending:', gtype, mtype); 
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'MType': mtype,
      'GType': gtype,
      'Wsession': sessionStorage.getItem("wsessionDY") || ""
    });  
  
    return this.http.post(
      `${environment.baseUrl}${environment.api.games.jdbLaunch}`,
      {},
      { headers }
    );
  }
}
