import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { Register } from './auth/register/register';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { MessageComponent } from './reusables/message/message.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as appState from '../app/core/appstates/appState';
import * as loginActions from '..//app/core/appstates/loginstates/loginActions';
import { Subscription, distinctUntilChanged, filter } from 'rxjs';
import { Slots } from './core/services/slots';
import { Games } from './services/games';
import { Gamelaunch } from './gamelaunch/gamelaunch';
import { Carousel } from './carousel/carousel';
import { LoginService } from './core/services/login/login.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LoginComponent,
    Register,
    Header,
    Footer,
    MessageComponent, Gamelaunch, Carousel
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit { 
  protected readonly title = signal('dybet');
  private storeSub!: Subscription;
  gameVisible = false;
  toastData: any = null;
  showCarousel = true;
  showDepositPopup = false;
  private registerPopupOpened = false;
    constructor( private store: Store<appState.AppState>,  private router: Router,private gamesService: Games,private loginService:LoginService, private slotsservice:Slots){
      
    }
  // WebView and authentication state 

  ngOnInit() { 
    const session = localStorage.getItem('wsessionDB');

    this.store.dispatch(
      new loginActions.PlayerLoggedIn({
        loggedIn: !!session
      })
    );

  this.gamesService.toast$
  .subscribe((res) => {

    this.toastData = res;

  });
 
    this.gamesService.gameVisible$ .subscribe((status: boolean) => { 
      console.log(status)
      this.gameVisible = status; });
this.storeSub = this.store.select((state:any) =>
  state.loginState.playerLoggedIn.loggedIn
).pipe(
  filter(val => val !== undefined && val !== null),
  distinctUntilChanged()
).subscribe((isLoggedIn) => {

  console.log('Login changed:', isLoggedIn);

  this.slotsservice.fetchAllGames11(isLoggedIn);

});
this.slotsservice.loadBanners();


this.router.events
.pipe(
  filter(event =>
    event instanceof NavigationEnd
  )
)
.subscribe((event: any) => {

  const urlTree = this.router.parseUrl(this.router.url);

  const isAgentRegister =
    urlTree.queryParams['type'] === 'agent' &&  urlTree.queryParams['ID'] ||     urlTree.queryParams['type'] === 'affiliate' &&  urlTree.queryParams['ID'];

  this.showCarousel = !isAgentRegister;

  if (isAgentRegister && !this.registerPopupOpened) {
    this.registerPopupOpened = true;
    this.loginService.openRegister();
  }
window.scroll(0,0)
  const hideRoutes = [

    '/home',
    '/profile',
    '/balance',
    '/deposit',
    '/cashout',
    '/transactions',
    '/game-history',
    '/deposit-pending'

  ];

  this.showCarousel =
    !hideRoutes.includes(
      this.router.url
    );
    const currentUrl = event.urlAfterRedirects;

    if (currentUrl === '/deposit-pending') {
  
      this.showDepositPopup = true;
  
    }
});
  }
 
  closeDepositPopup(): void {
    this.showDepositPopup = false;
  }
  ngAfterViewInit() {
    const loader = document.getElementById('preloader');
    if (loader) loader.remove();
  }
}