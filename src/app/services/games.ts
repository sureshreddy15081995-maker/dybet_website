import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { Slots } from '../core/services/slots';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { GameCmsService } from '../core/services/games_cms/game-cms.service';

@Injectable({
  providedIn: 'root'
})
export class Games {


  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private slotService: Slots,
    private gameservice: GameCmsService
  ) { }


  private gameUrlSubject =
  new BehaviorSubject<any>(null);

  public gameUrl$ =
    this.gameUrlSubject.asObservable();
  private gameVisibleSubject = new BehaviorSubject<boolean>(false);
  public gameVisible$ = this.gameVisibleSubject.asObservable();


  private toastSubject =
  new BehaviorSubject<any>(null);
  
  public toast$ =
  this.toastSubject.asObservable();
  private sessionId = new BehaviorSubject<string>('');

  sessionId$ = this.sessionId.asObservable();

  setSession(id: string) {
    this.sessionId.next(id);
  }

  getSession() {
    return this.sessionId.value;
  }




  showToast(
    message: string,
    type: 'success' | 'error' = 'error'
  ) {
  
    this.toastSubject.next({
      message,
      type
    });
  
    setTimeout(() => {
  
      this.toastSubject.next(null);
  
    }, 3000);
  
  }

  launchGame(
    game: any,
    returnUrl: string
  ): Observable<any> {

    console.log(game);

    const providerName =
      game.provider
        ? game.provider.toLowerCase()
        : '';

    const handler =
      this.providerMap[providerName];

    if (!handler) {

      return of({

        success: false,

        message: 'Unsupported provider'

      });

    }

    return handler.call(this, game).pipe(

      map((res: any) => {

        console.log('GAME RESPONSE', res);

        let gameData: any;

        // STRING RESPONSE

        if (typeof res === 'string') {

          gameData = {

            url: res,

            token: null,

            game: game

          };

        }

        // OBJECT RESPONSE

        else {

          gameData = {

            url: res.url || null,

            token: res.token?res.token:res.TOKEN || null,

            game: game

          };

        }

        console.log(
          'FINAL GAME DATA',
          gameData
        );
 
        
        console.log(gameData)
        if (!gameData.url) {
          this.gameDataSubject.next( gameData );
        console.log(gameData)
          if (gameData.token ||  gameData.TOKEN) {
         
        this.closeIframeGame()
          }
         
        
          this.showToast(

            res.message ||
            'Game launch failed',
          
            'error'
          
          );
          
          return {
          
            success: false,
          
            message:
              res.message ||
              'Game launch failed'
          
          };
        
        } 
        

        // =====================================
        // SAVE GAME DATA
        // =====================================

        // this.commondataService.setGame(game);

        gameData.returnUrl = returnUrl;

        sessionStorage.setItem(

          'gameLaunchData',

          JSON.stringify(gameData)

        );
        console.log(gameData)

        this.openIframeGame(gameData);

        return {
          success: true
        };

      }),

      catchError((err) => {

        console.log(err);
      
        this.showToast(
      
          err?.err_text ||
          err?.message ||
          'Game launch failed',
      
          'error'
      
        );
      
        return of({
      
          success: false,
      
          message:
            err?.err_text ||
            err?.message ||
            'API Error'
      
        });
      
      })

    );

  }
  openIframeGame(data: any) {

    console.log('OPEN IFRAME DATA', data);
  
    this.gameDataSubject.next(data);
  
    this.gameUrlSubject.next(data);
  
    this.gameVisibleSubject.next(true);
  
  }
  private gameDataSubject = new BehaviorSubject<any>(null);
   public gameData$ = this.gameDataSubject.asObservable();
  closeIframeGame() {
    const gameData = this.gameDataSubject.value; 
    if (gameData && (gameData.token || gameData.TOKEN)) { 
      const body = { gameSession: gameData.token || gameData.TOKEN}; 
    this.slotService.killGameSession(body).subscribe({ next: (res: any) => { console.log('GAME SESSION CLOSED', res); }, error: (err: any) => { console.log('CLOSE SESSION ERROR', err); } }); } 
    this.gameDataSubject.next(null); 
    this.gameUrlSubject.next('');
    this.gameVisibleSubject.next(false);
  }
  // =========================================
  // JDB
  // =========================================
  setupUnloadListener() {
    window.addEventListener('beforeunload', () => {
      const gameData = this.gameDataSubject.value;
      if (gameData && (gameData.token || gameData.TOKEN)) {
        const body = { token: gameData.token || gameData.TOKEN, provider: gameData.game?.provider, gameId: gameData.game?.gameId }; navigator.sendBeacon(`${environment.baseUrl}/close-game-session`, JSON.stringify(body));
      }
    });
  }
  private launchJdb(
    game: any
  ): Observable<any> {

    return this.slotService
      .jdbLaunch(
        game.Gtype,
        game.Mtype
      )
      .pipe(

        map((res: any) => ({

          url: res.path,

          token: null

        }))

      );

  }

  // =========================================
  // HUIDU
  // =========================================

  private HuiduAggregator(
    game: any
  ): Observable<any> {

    const body: any = {

      gameId: game.gameId,

      provider: game.provider

    };

    return this.slotService
      .huidugameAggregator(body)
      .pipe(

        map((res: any) => ({

          url: res.url,

          token: res.token

        }))

      );

  }

  // =========================================
  // VIVO
  // =========================================

  private lanchvivo(
    game: any
  ): Observable<any> {

    return this.gameservice
      .gamelunallproviders(
        game.provider,
        game.gameId
      )
      .pipe(

        map((res: any) => ({

          url: res.url,

          token: res.token || null

        }))

      );

  }

  // =========================================
  // GV
  // =========================================

  private lanchGV(
    game: any
  ): Observable<any> {

    const body: any = {

      gameId: game.gameId,

      provider: game.provider,

      language: 'en'

    };

    return this.slotService
      .gvprovider(body)
      .pipe(

        map((res: any) => ({

          url: res.url,

          token: res.token

        }))

      );

  }

  // =========================================
  // PRAGMATIC
  // =========================================

  private pragmaticplay(
    game: any
  ): Observable<any> {

    return this.slotService
      .getpragmatichit(game.gameId)
      .pipe(

        map((res: any) => ({

          url: res.gameURL,

          token: null

        }))

      );

  }

  // =========================================
  // AVIATOR
  // =========================================

  private aviator(
    game: any
  ): Observable<any> {

    const payload = {

      gameId: game.gameId,

      provider: game.provider

    };

    return this.slotService
      .aviatorgame(payload)
      .pipe(

        map((res: any) => ({

          url: res.url,

          token: res.token || null

        }))

      );

  }

  // =========================================
  // PROVIDER MAP
  // =========================================

  private providerMap: {

    [key: string]:
    (game: any) => Observable<any>

  } = {

      // HUIDU

      'btihd': this.HuiduAggregator,
      'sexy': this.HuiduAggregator,
      'smartsofthd': this.HuiduAggregator,
      'pragmaticplayhd': this.HuiduAggregator,
      'pragmaticplaylivecasinohd': this.HuiduAggregator,
      'mac88': this.HuiduAggregator,
      'pgsofthd': this.HuiduAggregator,
      'rubyplayhd': this.HuiduAggregator,
      'redtigerhd': this.HuiduAggregator,
      'evoplayhd': this.HuiduAggregator,

      // JDB

      'gtf': this.launchJdb,
      'spribe': this.launchJdb,
      'jdb': this.launchJdb,

      // PRAGMATIC

      'pragmaticplay': this.pragmaticplay,
      'pragmaticplaylivecasino': this.pragmaticplay,

      // AVIATOR

      'aviator': this.aviator,

      // VIVO

      'platipus': this.lanchvivo,
      'tomhorn': this.lanchvivo,
      'betsoft': this.lanchvivo,
      'nucleus': this.lanchvivo,

      // GV

      'netentgv': this.lanchGV,
      'ezugigv': this.lanchGV,
      'evolutiongv': this.lanchGV,
      'playtechgv': this.lanchGV,
      'redtigergv': this.lanchGV,
      'nolimitcitygv': this.lanchGV,
      'inoutgv': this.lanchGV,
      'egtdigitalgv': this.lanchGV,
      'bigtimegaminggv': this.lanchGV,

      // =====================================
      // BALLAGAMES
      // =====================================

      'ballagames': (game: any) => {

        const session =
          sessionStorage.getItem('wsessionDY');

        if (!session) {

          return of(null);

        }

        return this.slotService
          .indiecasino(session)
          .pipe(

            map((data: any) => {

              if (!data.url) {

                return null;

              }

              return {

                url:
                  `${data.url}/${game.Name}` +
                  `?gameId=${game.gameId}` +
                  `&playerToken=${data.token}` +
                  `&site=${environment.skinId}`,

                token: data.token || null

              };

            })

          );

      },

      // =====================================
      // HABANERO
      // =====================================

      'habanero': (game: any) => {

        const session: any =
          sessionStorage.getItem('wsessionDY');

        if (!session) {

          return of(null);

        }

        return this.slotService
          .httpClient(
            session,
            game.gameId
          )
          .pipe(

            map((data: any) => {

              return {

                url:
                  data.STATUS === 'SUCCESS'
                    ? data.URL
                    : null,

                token: null

              };

            })

          );

      },

      // =====================================
      // KAGAMING
      // =====================================

      'kagaming': (game: any) => {

        const body = {

          gameId: game.gameId,

          provider: game.provider

        };

        return this.slotService
          .kagamingl(body)
          .pipe(

            map((data: any) => ({

              url: data.url,

              token: data.token || null

            }))

          );

      },

      // =====================================
      // KINGMIDAS
      // =====================================

      'kingmidas': (game: any) => {

        const body = {

          gameId: game.gameId,

          provider: game.provider

        };

        return this.slotService
          .kingmidaslaunch(body)
          .pipe(

            map((data: any) => ({

              url: data.url,

              token: data.token || null

            }))

          );

      },

      // =====================================
      // AVIATRIX
      // =====================================

      'aviatrix': (game: any) => {

        const body = {

          gameId: game.gameId,

          provider: game.provider

        };

        return this.slotService
          .aviatrixprovider(body)
          .pipe(

            map((data: any) => ({

              url: data.url,

              token: data.token || null

            }))

          );

      },

      // =====================================
      // JILLI
      // =====================================

      'jilli': (game: any) => {

        const body = {

          gameId: game.gameId

        };

        return this.slotService
          .jilligames(body)
          .pipe(

            map((data: any) => ({

              url: data.url,

              token: data.token || null

            }))

          );

      },

      // =====================================
      // WEARELOTTO
      // =====================================

      'wearelotto': (game: any) => {

        const body = {

          gameId: game.gameId

        };

        return this.slotService
          .wearelottoprovider(body)
          .pipe(

            map((data: any) => ({

              url: data.url,

              token: data.token || null

            }))

          );

      },

      // =====================================
      // VIVOGAMING
      // =====================================

      'vivogaming': (game: any) => {

        return this.slotService
          .gamelunallvivogaming()
          .pipe(

            map((data: any) => {

              const base =
                data.VIVO_GAME_LAUNCH_URL;

              const url = new URL(base);
              console.log(url)
              url.searchParams.set(
                'selectedGame',
                game.gameId
              );

              return {

                url: url.toString(),

                token: data.TOKEN

              };

            })

          );

      },

      // =====================================
      // 18PEACHES
      // =====================================

      '18peaches': (game: any) => {

        const body = {

          gameId: game.gameId

        };

        return this.slotService
          .peachesProvider(body)
          .pipe(

            map((data: any) => ({

              url: data.url,

              token: data.token || null

            }))

          );

      }

    };

} 
