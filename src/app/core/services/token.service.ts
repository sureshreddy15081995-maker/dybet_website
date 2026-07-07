// src/app/core/services/token.service.ts
import { Injectable, inject } from '@angular/core';
import { AuthApiService, CreateTokenResponse, ValidateTokenResponse, PlayerDetails } from './webview-auth.service';
import { BehaviorSubject, Observable, tap, catchError, of, switchMap, map } from 'rxjs';
import { PlayerService } from './player/player.service';
import * as loginActions from '../../core/appstates/loginstates/loginActions';
import { Store } from '@ngrx/store';
import * as appState from '../../core/appstates/appState';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private authApiService = inject(AuthApiService);

    // Fixed: Use constant key names
    private accessTokenKey = 'rummy_access_token';
    private refreshTokenKey = 'rummy_refresh_token';
    private authTokenKey = 'rummy_auth_token';
    private userIdKey = 'rummy_user_id';

    private accessTokenSubject = new BehaviorSubject<string | null>(this.getAccessToken());
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());

    public accessToken$ = this.accessTokenSubject.asObservable();
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
constructor(private playerService:PlayerService,  private store: Store<appState.AppState>,){

}
 
    createAuthToken(): Observable<CreateTokenResponse | null> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            console.error('🔐 No refresh token available');
            return of(null);
        }
        return this.authApiService.createAuthToken(refreshToken).pipe(
            tap((response:any) => {
                console.log('🔐 Token creation successful:', response);
                this.setTokens(response.auth_token, refreshToken, response.userId.toString(), response.token);
                this.accessTokenSubject.next(response.auth_token);
                this.isAuthenticatedSubject.next(true);
            }),
            catchError((error:any) => {
                console.error('🔐 Token creation failed:', error);
                this.clearTokens();
                this.isAuthenticatedSubject.next(false);
                return of(null);
            })
        );
    }
    validateToken(): Observable<ValidateTokenResponse | null> {
        const accessToken = this.getAccessToken();
        if (!accessToken) {
            console.error('🔐 No access token available');
            return of(null);
        }
        console.log('🔐 Validating token via API...');
        return this.authApiService.validateToken(accessToken).pipe(
            tap((validationResult:any) => {
                console.log('🔐 Token validation result:', validationResult);
                if (validationResult.success) {
                    this.isAuthenticatedSubject.next(true);
                    console.log('🔐 Token validation successful');
                } else {
                    this.isAuthenticatedSubject.next(false);
                    console.log('🔐 Token validation failed');
                }
            }),
            catchError((error:any) => {
                console.error('🔐 Token validation API error:', error);
                this.isAuthenticatedSubject.next(false);
                return of(null);
            })
        );
    }


    comprehensiveValidateToken(): Observable<boolean> {
        const accessToken = this.getAccessToken();

        if (!accessToken) {
            console.error('🔐 No access token available');
            this.isAuthenticatedSubject.next(false);
            return of(false);
        }

        return this.authApiService.validateToken(accessToken).pipe(
            switchMap((validationResult:any) => {
                if (validationResult.success) {
                    return this.authApiService.getPlayerDetails(accessToken).pipe(
                        tap((playerDetails:any) => {
                            console.log('🔐 Player details loaded:', playerDetails);
                            this.isAuthenticatedSubject.next(true);
                        }),
                        map(() => true),
                        catchError((detailsError:any) => {
                            console.error('🔐 Failed to get player details:', detailsError);
                            this.isAuthenticatedSubject.next(true);
                            return of(true);
                        })
                    );
                } else {
                    this.isAuthenticatedSubject.next(false);
                    return of(false);
                }
            }),
            catchError((validationError:any) => {
                console.error('🔐 Token validation failed:', validationError);
                this.isAuthenticatedSubject.next(false);
                return of(false);
            })
        );
    }

    /**
     * Validate token and return details
     */
    validateTokenWithDetails(): Observable<{ isValid: boolean; playerDetails?: PlayerDetails }> {
        const accessToken = this.getAccessToken();

        if (!accessToken) {
            console.error('🔐 No access token available');
            this.isAuthenticatedSubject.next(false);
            return of({ isValid: false });
        }

        return this.authApiService.validateToken(accessToken).pipe(
            switchMap((validationResult:any) => {
                if (validationResult.success) {
                    return this.authApiService.getPlayerDetails(accessToken).pipe(
                        tap((playerDetails:any) => {
                            console.log('🔐 Player details loaded:', playerDetails);
                            this.isAuthenticatedSubject.next(true);
                        }),
                        map((playerDetails:any) => ({ isValid: true, playerDetails })),
                        catchError((detailsError:any) => {
                            console.error('🔐 Failed to get player details:', detailsError);
                            this.isAuthenticatedSubject.next(true);
                            return of({ isValid: true });
                        })
                    );
                } else {
                    this.isAuthenticatedSubject.next(false);
                    return of({ isValid: false });
                }
            }),
            catchError((validationError:any) => {
                console.error('🔐 Token validation failed:', validationError);
                this.isAuthenticatedSubject.next(false);
                return of({ isValid: false });
            })
        );
    }

    /**
     * Quick token validation
     */
    quickValidateToken(): Observable<boolean> {
        const accessToken = this.getAccessToken();

        if (!accessToken) {
            console.log('🔐 No access token for quick validation');
            this.isAuthenticatedSubject.next(false);
            return of(false);
        }

        // For quick validation, just check if token exists and has basic format
        const isValid = accessToken.length > 10;
        console.log('🔐 Quick validation:', isValid ? 'Valid' : 'Invalid');
        this.isAuthenticatedSubject.next(isValid);
        return of(isValid);
    }
 
    setTokens(authToken: string, refreshToken: string, userId?: string, accessToken?: string): void {
        console.log('🔐 Setting tokens in localStorage');
        localStorage.setItem(this.authTokenKey, authToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userId) {
            localStorage.setItem(this.userIdKey, userId);
        }
        if (accessToken) {
            localStorage.setItem(this.accessTokenKey, accessToken);
            this.accessTokenSubject.next(accessToken);
        }
        this.isAuthenticatedSubject.next(true);
    }

    /**
     * Set access token only
     */
    setAccessToken(token: string): void {
        console.log('🔐 Setting access token:', token.substring(0, 20) + '...');
        localStorage.setItem(this.accessTokenKey, token);
        this.accessTokenSubject.next(token);
        this.isAuthenticatedSubject.next(true);
    }

    /**
     * Get access token
     */
    getAccessToken(): string | null {
        const token = localStorage.getItem(this.accessTokenKey);
        return token;
    }

    /**
     * Get auth token
     */
    getAuthToken(): string | null {
        return localStorage.getItem(this.authTokenKey);
    }

    /**
     * Get refresh token
     */
    getRefreshToken(): string | null {
        return localStorage.getItem(this.refreshTokenKey);
    }

    /**
     * Get user ID
     */
    getUserId(): string | null {
        return localStorage.getItem(this.userIdKey);
    }

    /**
     * Clear all tokens
     */
    clearTokens(): void {
        console.log('🔐 Clearing all tokens');
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.authTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userIdKey);
        this.accessTokenSubject.next(null);
        this.isAuthenticatedSubject.next(false);
    }

    /**
     * Check if valid token exists
     */
    hasValidToken(): boolean {
        const token = this.getAccessToken();
        const isValid = !!token && token.length > 10;
        return isValid;
    }

    /**
     * Get current authentication state
     */
    getCurrentAuthState() {
        return {
            accessToken: this.getAccessToken(),
            authToken: this.getAuthToken(),
            refreshToken: this.getRefreshToken(),
            userId: this.getUserId(),
            isAuthenticated: this.hasValidToken()
        };
    }
}