import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../core/services/login/login.service';
import { PlayerLoginStateService } from '../../reusables/utils/playerLoginStateService';
import { distinctUntilChanged, filter, Observable, Subject, takeUntil } from 'rxjs';

import * as appState from '../../core/appstates/appState';
import * as cashierActions from '../../core/appstates/cashierstates/cashierActions';
import * as loginActions from '../../core/appstates/loginstates/loginActions';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { LoginState } from '../../core/appstates/loginstates/loginState';
import { PlayerService } from '../../core/services/player/player.service';
import { CashierState } from '../../core/appstates/cashierstates/cashierState';
import { ProfileState } from '../../core/appstates/playerstates/playerState';
import { MessageService } from '../../reusables/message/message.service';
import { Balance, WalletInfo } from '../../core/modules/cashier/balance';
import { Slots } from '../../core/services/slots';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule,TranslateModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLogged$: Observable<boolean>;
  showLogoutPopup = false;
  storeSub!: Subscription;
  playerStateSub!: Subscription;
  isLoggedIn: boolean = false;
  playerName: string = "";
  myBalance: string = "0.00";
  showBalance: boolean = true;
  isMobileMenuOpen: boolean = false;
  currencySymbol:any;
  private loginStateSub!: Subscription;
  private cashierStateSub!: Subscription;
  private balanceInterval: any;
  private sessionExpireHandled = false;
  private routerSub!: Subscription;
  headerrespose:any;
  walleteInfo: WalletInfo[] = [];
  profileLoaded = false; 
  selectedLanguage = 'fr';
  dropdownOpen = false;
  public currentRoute: string = '';

  languages = [
    {
      code: 'en',
      name: 'English'
    },
    {
      code: 'fr',
      name: 'Français'
    }
  ];

  constructor(
    private loginService: LoginService,
    private playerLoginStateService: PlayerLoginStateService,
    private store: Store<appState.AppState>,
    private playerService: PlayerService,
    private messageService: MessageService,
    private slotsservice:Slots,
    private router: Router,
    private translate: TranslateService,
    private elementRef: ElementRef
  ) {
    this.isLogged$ = this.playerLoginStateService.isPlayerLoggedIn();
    const savedLang = localStorage.getItem('lang');

    this.selectedLanguage = savedLang || 'fr';

    this.translate.use(this.selectedLanguage);
  }
  get selectedLanguageName(): string {

    const lang = this.languages.find(
      x => x.code === this.selectedLanguage
    ); 
    return lang ? lang.name : 'fr';
  }
  ngOnInit(): void {

    this.storeSub = this.store.select('loginState').subscribe(
      (loginState: LoginState) => {
    
        this.isLoggedIn = loginState.playerLoggedIn?.loggedIn || false;
    
        if (this.isLoggedIn) {
    
          this.store.dispatch(
            new cashierActions.CashierGetBalanceStart()
          );
    
          this.startBalanceRefresh();
    
          this.setupCashierStateSubscription();
    
          // CALL ONLY ONCE
          if (!this.profileLoaded) {
    
            this.profileLoaded = true;
    
            this.playerService
              .onPlayerGetProfile()
              .pipe(takeUntil(this.destroy$))
              .subscribe((data: any) => {
    
                this.playerName = data.login;
    
                this.setupPlayerStateSubscription();
    
              });
    
          }
    
        } else {
    
          this.stopBalanceRefresh();
    
          this.myBalance = "0.00";
    
          // RESET FLAG ON LOGOUT
          this.profileLoaded = false;
        }
      }
    );
    let wsession = sessionStorage.getItem('wsessionDY') || ''
    if(wsession){
      let bodyPayload:any = {
        success: true,
        sessionId: wsession,
      };
      this.store.dispatch(new loginActions.LoginSuccess(bodyPayload));
    }


    this.slotsservice.secondheaderline().subscribe((data:any)=>{
      if(data){
        this.headerrespose = data;
      }
    })
  }

  private setupPlayerStateSubscription(): void {
    this.playerStateSub = this.store.select("playerState")
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: ProfileState) => {
       
      });

  }


  private setupCashierStateSubscription(): void {
    this.cashierStateSub = this.store.select("cashierState")
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev:any, curr:any) =>
          JSON.stringify(prev.sessionexpire) === JSON.stringify(curr.sessionexpire) &&
          JSON.stringify(prev.balance) === JSON.stringify(curr.balance)
        ),
        filter((state:any) => !!state)
      )
      .subscribe((cashierState: CashierState) => {
        // if (!cashierState.sessionexpire && !this.sessionExpireHandled) {
        //   this.handleSessionExpiration();
        // }
        // console.log(cashierState);
        if (cashierState.sessionexpire && cashierState.sessionexpire.session && !this.sessionExpireHandled) {
          this.handleSessionExpiration();
        }

        if (cashierState.balance && cashierState.balance.values) {
          this.handleBalanceUpdate(cashierState.balance.values);
        }
      });
  }

  private handleSessionExpiration(): void {
    this.sessionExpireHandled = true;
    sessionStorage.removeItem('wsessionDY');
    // alert("hit")
    this.store.dispatch(new loginActions.ResetState());
    this.messageService.error("Authentication", "Your session has expired. Please relogin", 100000);
    this.router.navigate(['/home']);
    setTimeout(() => {
      window.location.reload();
    }, 100000);
  }

  private startBalanceRefresh(): void {
    this.stopBalanceRefresh();

    this.balanceInterval = setInterval(() => {
      this.store.dispatch(new cashierActions.CashierGetBalanceStart());
    }, 10000);
  }

  private handleBalanceUpdate(walletValues: WalletInfo[]): void {
    this.walleteInfo = walletValues;
    // console.log(walletValues)
    if (this.walleteInfo && this.walleteInfo.length > 0) {
      let totalBalance = 0;
      for (let wallet of this.walleteInfo) {
        // console.log(wallet)
        if (wallet?.preferred) { 
          totalBalance += (wallet.cash?.value || 0) + (wallet.bonus?.value || 0);
          this.currencySymbol = wallet.symbol;
        }

      }
      this.myBalance = totalBalance.toFixed(2);
    } else {
      this.myBalance = "0.00";
    }
  }

  private stopBalanceRefresh(): void {
    if (this.balanceInterval) {
      clearInterval(this.balanceInterval);
      this.balanceInterval = null;
    }
  }

  openLogin(): void {
    this.loginService.openLogin();
  }

  openRegister(): void {
    this.loginService.openRegister();
  }

 

  // toggleBalanceVisibility(): void {
  //   this.showBalance = !this.showBalance;
  // }
  ngAfterViewChecked() {
    if(window.location.hostname != 'localhost'){
      console.clear();
    }
  }
  getFormattedBalance(): string {
    if (!this.showBalance) {
      return '••••';
    }
    return `${this.currencySymbol}${this.myBalance}`;
  }
  toggleBalanceVisibility() {
    this.showBalance = !this.showBalance;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    console.log(this.isMobileMenuOpen)
  }
  isActive(routePath: string): boolean {
    return this.currentRoute === routePath ||
      this.currentRoute.startsWith(routePath + '/');
  }

  isActiveExact(routePath: string): boolean {
    return this.currentRoute === routePath;
  }
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    console.log(  this.isMobileMenuOpen)
  }

  onLogout(): void {
    // this.store.dispatch(new loginActions.ResetState());
    this.store.dispatch(new cashierActions.ResetState());
    this.store.dispatch(new loginActions.LogoutStart());
    this.showLogoutPopup = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopBalanceRefresh();

    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
    if (this.cashierStateSub) {
      this.cashierStateSub.unsubscribe();
    }
    if (this.loginStateSub) {
      this.loginStateSub.unsubscribe();
    }
  }
  changeLanguage(lang: string, event: Event) {

    event.stopPropagation();
  
    this.selectedLanguage = lang;
  
    this.translate.use(lang);
  
    localStorage.setItem('lang', lang);
  
    this.dropdownOpen = false; 
    const isHome =
    this.router.url === '/' ||
    this.router.url === '/home';

  if (isHome) {
    window.location.reload();
  }
  }
  toggleDropdown() {

    this.dropdownOpen = !this.dropdownOpen;
  }
  @HostListener('document:click', ['$event'])
  closeDropdown(event: any) {

    const clickedInside = event.target.closest(
      '.custom-language-dropdown'
    );

    if (!clickedInside) {

      this.dropdownOpen = false;
    }
  }
  openLogoutPopup() {

    this.showLogoutPopup = true;
  }
  @HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  const clickedInside = this.elementRef.nativeElement.contains(event.target);

  if (!clickedInside) {
    this.isMobileMenuOpen = false;
    this.dropdownOpen = false; 
  }
}
}