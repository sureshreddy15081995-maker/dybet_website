import { Component, OnInit, Renderer2, Inject, DOCUMENT } from '@angular/core';
import { Subscription, distinctUntilChanged, map, take } from 'rxjs';
import * as appState from '../../core/appstates/appState'; 
import { Store } from '@ngrx/store';
import { LoginState } from '../../core/appstates/loginstates/loginState';
import { LoginService } from '../../core/services/login/login.service';
import { CommonModule } from '@angular/common';
import { Slots } from '../../core/services/slots';
import { DomSanitizer, Meta, SafeResourceUrl, Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router'; 
import { Games } from '../../services/games';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [CommonModule, RouterModule],

  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  storeSub!: Subscription;
  isLoggedIn: boolean = false;
  sportLoaded = false;
  urlSafe!: SafeResourceUrl;
  loaderpage: boolean = false;
  errormassage: any;
  constructor(
    private store: Store<appState.AppState>,
    private loginService: LoginService,
    private slotsService: Slots,
    public sanitizer: DomSanitizer,
    private games:Games,
    private title: Title,
    private meta: Meta,
    private renderer: Renderer2,
    private router:Router,
    @Inject(DOCUMENT) private document: Document
   ) { }

  ngOnInit(): void {
    setTimeout(() => {
      
      this.storeSub = this.store.select('loginState')
        .pipe(
          map((state: LoginState) => state.playerLoggedIn?.loggedIn),
          distinctUntilChanged()
        )
        .subscribe((loggedIn) => {
          this.loaderpage = true;
  
          if (loggedIn  ) {

            this.sportLoaded = true;
          setTimeout(() => {
            
            this.games.sessionId$
              .pipe(take(1))
              .subscribe(sessionId => {
          
                if (sessionId) {
          
                  this.slotsService.sportsURL(sessionId)
                    .pipe(take(1))
                    .subscribe((sport: any) => {
                      // this.responsesport(sport);
                      if (sport.token) {
                        // var url = `https://prod20278-206634738.fssb.io/en/spbk?v=2&operatorToken=${data.token}`
                        var lang = localStorage.getItem('lang') || 'fr'
                        var url = `https://prod20278-206634738.fssb.io/${lang}/spbk?api=https://dybet.bet/assets/js/btisports.js?v=2&operatorToken=${sport.token}`
                        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            this.loaderpage = false;
                
                      } else {
                        this.errormassage = sport.Error
                      }
                    });
          
                }
          
              });
          }, 500);
          
          } else {
            this.isLoggedIn = false;
            this.loaderpage = false;
  console.log('login1')
  var lang = localStorage.getItem('lang') || 'fr'
            this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://prod20278-206634738.fssb.io/${lang}/spbk`
  
            );
          }
  
          setTimeout(() => {
            this.loaderpage = false;
          }, 2500);
  
        });
        
    }, 500);
    this.title.setTitle('Sports Games - Dybet');

    this.meta.updateTag({
      name: 'description',
      content: 'Play sports betting and casino games at Dybet.'
    });
    
    const canonicalUrl = window.location.origin + this.router.url.split('?')[0];
    
    const canonical = this.document.querySelector('link[rel="canonical"]');
    
    if (canonical) {
      this.renderer.setAttribute(canonical, 'href', canonicalUrl);
    } else {
      const link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'canonical');
      this.renderer.setAttribute(link, 'href', canonicalUrl);
      this.renderer.appendChild(this.document.head, link);
    }
  }

  responsesport(data: any) {

    if (this.isLoggedIn == true) {
      if (data.token) { 
        var url = `https://prod20278-206634738.fssb.io/en/spbk?api=https://dybet.bet/assets/js/btisports.js?v=2&operatorToken=${data.token}`
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);

      } else {
        this.errormassage = data.Error
      }
      this.loaderpage = false;
    }


  }
  openLogin(): void {
    this.loginService.openLogin();
  }

}
