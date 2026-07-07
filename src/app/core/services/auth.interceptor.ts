// src/app/core/services/auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { TokenService } from './token.service';

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const tokenService = inject(TokenService);
    const router = inject(Router);  
    let authReq = req;
        return next(authReq).pipe(
        catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse) {
                console.error('🔐 Interceptor - HTTP Error:', error.status, error.message);

                switch (error.status) {
                    case 401: // Unauthorized
                        console.log('🔐 Interceptor - 401 Unauthorized, clearing tokens');
                        tokenService.clearTokens();
                        router.navigate(['/login']);
                        break;
                    case 403: // Forbidden
                        console.log('🔐 Interceptor - 403 Forbidden');
                        break;
                    case 400: // Bad Request
                        console.error('🔐 Interceptor - 400 Bad Request:', error.error);
                        break;
                    case 500: // Server Error
                        console.error('🔐 Interceptor - 500 Server Error');
                        break;
                    default:
                        console.error('🔐 Interceptor - Unknown error:', error.status);
                }
            } else {
                console.error('🔐 Interceptor - Unknown error type:', error);
            }

            return throwError(() => error);
        })
    );
};