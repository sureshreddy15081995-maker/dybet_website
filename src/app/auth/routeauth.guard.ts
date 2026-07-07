import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../core/appstates/appState';
import { LoginState } from '../core/appstates/loginstates/loginState';

@Injectable({
  providedIn: 'root'
})
export class RouteauthGuard implements CanActivate, CanActivateChild, CanLoad {

  playerLoggedIn: boolean = false;

  constructor(private store: Store<AppState>, private router: Router) {
    this.store.select("loginState").subscribe((loginState: LoginState) => {
      if (loginState.playerLoggedIn) {
        this.playerLoggedIn = loginState.playerLoggedIn.loggedIn;
      }
    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.playerLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.playerLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

    if (this.playerLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
