// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';

import { TokenService } from '../../core/services/token.service';
import { WebViewIntegrationService } from '../../core/services/webview-integration.service';
import { AuthApiService, ValidateTokenResponse, PlayerDetails } from '../../core/services/webview-auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, TranslateModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  private routerSubscription!: Subscription;
  public currentRoute: string = '';

  private tokenService = inject(TokenService);
  private webViewService = inject(WebViewIntegrationService);
  private authApiService = inject(AuthApiService);

  playerDetails: PlayerDetails | null = null;
  isRefreshing = false;
  validationResult: ValidateTokenResponse | null = null;
  isInWebView = false;
  isAuthenticatedSubject: any
  domainpathname:any
  constructor(private router: Router) {
 
  }

  ngOnInit() {
    window.scroll(0 , 0)
    // Initialize with current route
     // Initial Route
     this.currentRoute = this.router.url;

     // Initial Path Name
     this.updatePathName(this.currentRoute);
 
     // Route Change Listener
     this.routerSubscription = this.router.events
       .pipe(
         filter(event => event instanceof NavigationEnd)
       )
       .subscribe((event: any) => {
 
         this.currentRoute = event.urlAfterRedirects || event.url;
 
         this.updatePathName(this.currentRoute);
 
       });
    // Check authentication status 
  }
  updatePathName(url: string) {

    this.domainpathname = url
      .replace('/', '')
      .replace(/-/g, ' ')
console.log(this.domainpathname)
  }
  checkAuthentication() {
    this.tokenService.comprehensiveValidateToken().subscribe(isAuthenticated => {
      console.log('Authentication status:', isAuthenticated);
      if (isAuthenticated) {
        this.loadPlayerDetails();
      } else {
        console.log('User not authenticated');
      }
    });
  }

  checkAuthenticationWithDetails() {
    this.tokenService.validateTokenWithDetails().subscribe(result => {
      console.log('Authentication with details:', result);
      if (result.isValid) {
        this.isAuthenticatedSubject.next(true);
        if (result.playerDetails) {
          this.playerDetails = result.playerDetails;
        } else {
          this.loadPlayerDetails();
        }
      } else {
        this.isAuthenticatedSubject.next(false);
        this.playerDetails = null;
      }
    });
  }

  validateToken() {
    this.tokenService.validateToken().subscribe(result => {
      this.validationResult = result;
      console.log('Token validation result:', result);
    });
  }

  quickValidateToken() {
    this.tokenService.quickValidateToken().subscribe(isValid => {
      console.log('Quick validation result:', isValid);
      this.validationResult = { success: isValid, wsession: null };
    });
  }

  loadPlayerDetails() {
    const accessToken = this.tokenService.getAccessToken();
    if (accessToken) {
      this.authApiService.getPlayerDetails(accessToken).subscribe({
        next: (details) => {
          this.playerDetails = details;
        },
        error: (error) => {
          console.error('Failed to load player details:', error);
        }
      });
    }
  }

  refreshToken() {
    this.isRefreshing = true;
    this.tokenService.createAuthToken().subscribe({
      next: (response) => {
        this.isRefreshing = false;
        if (response) {
          console.log('Token refreshed successfully:', response);
          this.checkAuthentication();
        }
      },
      error: (error) => {
        this.isRefreshing = false;
        console.error('Token refresh failed:', error);
      }
    });
  }
 
  // Navigation methods
  isActive(routePath: string): boolean {
    return this.currentRoute === routePath ||
      this.currentRoute.startsWith(routePath + '/');
  }

  isActiveExact(routePath: string): boolean {
    return this.currentRoute === routePath;
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  isFullWidthPage(): boolean {
    return this.router.url.includes('/transactions') ||
           this.router.url.includes('/game-history');
  }
  
}