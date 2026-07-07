import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map, tap, exhaustMap } from 'rxjs/operators';

import * as loginActions from './loginActions';
import { LoginService } from '../../services/login/login.service';
import { MessageService } from '../../../reusables/message/message.service';
import { Games } from '../../../services/games';

@Injectable()
export class LoginEffects {
    private readonly MESSAGE_DURATION = 5000;

    // Use inject() for better reliability
    private actions$ = inject(Actions);
    private loginService = inject(LoginService);
    private router = inject(Router);
    private messageService = inject(MessageService);
constructor(private gameserive:Games){

}
    private handleError(error: HttpErrorResponse, ActionClass: any) {
        let errorMessage = 'Something went wrong. Please contact admin.';

        if (error.error instanceof Error) {
            errorMessage = error.error.message;
        } else if (error.error?.message) {
            errorMessage = error.error.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        return new ActionClass({ message: errorMessage });
    }

    // Login Effects
    loginStart$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginActions.LOGIN_START),
            exhaustMap((action: loginActions.LoginStart) =>
                this.loginService.onLogin(action.payload).pipe(
                    map((response: any) => new loginActions.LoginSuccess(response)),
                    catchError((error: HttpErrorResponse) =>
                        of(this.handleError(error, loginActions.LoginFail))
                    )
                )
            )
        )
    );

    loginSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginActions.LOGIN_SUCCESS),
            tap((action: loginActions.LoginSuccess) => {
                const payload: any = action.payload;
                if (payload?.success === true && payload?.sessionId) {
                    this.gameserive.setSession(payload.sessionId);
                    sessionStorage.setItem('wsessionDY', payload.sessionId);
                    localStorage.setItem('wsessionDY', payload.sessionId);
                    this.messageService.success('Authentication', 'Login successful', this.MESSAGE_DURATION);
                    this.loginService.closeLogin();
                    this.loginService.closeRegister();
                    this.loginService.onPlayerLoggedIn(true);
                } else {
                    this.loginService.onPlayerLoggedIn(false);
                    const errorMessage = payload?.description || 'Login failed';
                    this.messageService.error('Authentication', errorMessage, this.MESSAGE_DURATION);
                }
            })
        ),
        { dispatch: false }
    );

    loginFail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginActions.LOGIN_FAIL),
            tap((action: loginActions.LoginFail) => {
                const payload: any = action.payload;
                const errorMessage = payload?.message || 'Login failed';
                this.messageService.error('Authentication', errorMessage, this.MESSAGE_DURATION);
            })
        ),
        { dispatch: false }
    );

    // Register Effects
    registerStart$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginActions.REGISTER_START),
            exhaustMap((action: loginActions.RegisterStart) =>
                this.loginService.onRegister(action.payload).pipe(
                    map((response: any) => new loginActions.RegisterSuccess(response)),
                    catchError((error: HttpErrorResponse) =>
                        of(this.handleError(error, loginActions.RegisterFail))
                    )
                )
            )
        )
    );

    registerSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginActions.REGISTER_SUCCESS),
            tap((action: loginActions.RegisterSuccess) => {
                const payload: any = action.payload;
                if (payload?.success === true && payload?.loginResponse?.sessionId) {
                    sessionStorage.setItem('wsessionDY', payload.loginResponse.sessionId);
                    localStorage.setItem('wsessionDY', payload.loginResponse.sessionId);

                    if (payload.loginResponse.affiliatePostBackURL) {
                        sessionStorage.setItem('register_su', payload.loginResponse.affiliatePostBackURL);
                    }

                    this.loginService.onPlayerLoggedIn(true);
                    this.messageService.success('Authentication', 'Registration successful', this.MESSAGE_DURATION);
                } else {
                    this.loginService.onPlayerLoggedIn(false);
                    const errorMessage = payload?.description || 'Registration failed';
                    this.messageService.error('Authentication', errorMessage, this.MESSAGE_DURATION);
                }
            })
        ),
        { dispatch: false }
    );

    registerFail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginActions.REGISTER_FAIL),
            tap((action: loginActions.RegisterFail) => {
                const payload: any = action.payload;
                const errorMessage = payload?.message || 'Registration failed';
                this.messageService.error('Authentication', errorMessage, this.MESSAGE_DURATION);
            })
        ),
        { dispatch: false }
    );

    // Logout Effects
    logoutStart$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginActions.LOGOUT_START),
            exhaustMap(() =>
                this.loginService.onLogOut().pipe(
                    map((response: any) => {
                        sessionStorage.clear();
                        this.loginService.onPlayerLoggedIn(false);
                        return new loginActions.LogoutSuccess(response);
                    }),
                    catchError((error: HttpErrorResponse) =>
                        of(this.handleError(error, loginActions.LogoutFail))
                    )
                )
            )
        )
    );

    logoutSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginActions.LOGOUT_SUCCESS),
            tap((action: loginActions.LogoutSuccess) => {
                const payload: any = action.payload;
                if (payload?.success === true) {
                    this.messageService.info('Authentication', 'Logout successful');
                    this.router.navigate(['/home']);
                    sessionStorage.removeItem('wsessionDY');
                    localStorage.removeItem('wsessionDY');
                    this.loginService.onPlayerLoggedIn(false);
                } else {
                    this.messageService.error('Authentication', 'Logout failed', this.MESSAGE_DURATION);
                }
            })
        ),
        { dispatch: false }
    );

    logoutFail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginActions.LOGOUT_FAIL),
            tap(() => {
                sessionStorage.removeItem('wsessionDY');
                localStorage.removeItem('wsessionDY');
                this.loginService.onPlayerLoggedIn(false);
                this.messageService.error('Authentication', 'Logout failed', this.MESSAGE_DURATION);
            })
        ),
        { dispatch: false }
    );

    // Forgot Password Effects
    forgotPasswordStart$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginActions.FORGOTPASSWORD_START),
            exhaustMap((action: loginActions.ForgotPasswordStart) =>
                this.loginService.onForgotPassword(action.payload).pipe(
                    map((response: any) => new loginActions.ForgotPasswordSuccess(response)),
                    catchError((error: HttpErrorResponse) =>
                        of(this.handleError(error, loginActions.ForgotPasswordFail))
                    )
                )
            )
        )
    );

    forgotPasswordSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginActions.FORGOTPASSWORD_SUCCESS),
            tap((action: loginActions.ForgotPasswordSuccess) => {
                const payload: any = action.payload;
                if (payload?.success === true) {
                    this.messageService.success('Authentication', 'Password reset instructions sent', this.MESSAGE_DURATION);
                } else {
                    this.messageService.error('Authentication', 'Failed to process password reset', this.MESSAGE_DURATION);
                }
            })
        ),
        { dispatch: false }
    );

    forgotPasswordFail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginActions.FORGOTPASSWORD_FAIL),
            tap((action: loginActions.ForgotPasswordFail) => {
                const payload: any = action.payload;
                const errorMessage = payload?.message || 'Password reset failed';
                this.messageService.error('Authentication', errorMessage, this.MESSAGE_DURATION);
            })
        ),
        { dispatch: false }
    );
}