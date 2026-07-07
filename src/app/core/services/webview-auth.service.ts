// src/app/core/services/webview-auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface CreateTokenResponse {
    auth_token: string;
    userId: number;
    token: string;
}

export interface ValidateTokenResponse {
    wsession: any;
    success: boolean;
}

export interface PlayerDetails {
    user_id: string;
    name: string;
    email?: string;
    mobile_number?: string;
    state?: string;
    country?: string;
    session_key: string;
    timestamp: string;
    client_id: string;
}

export interface ApiError {
    errorcode: number;
    errormessage: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {
    private http = inject(HttpClient);
    private baseUrl = environment.baseUrl;

    /**
     * Create new auth token using refresh token
     */
    createAuthToken(refreshToken: string): Observable<CreateTokenResponse> {
        const url = `${this.baseUrl}/rest/rummy/player/createAuthToken`;
        console.log('🔐 API - Creating auth token:', url);

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${refreshToken}`,
            'Content-Type': 'application/json'
        });

        return this.http.post<CreateTokenResponse>(url, {}, { headers });
    }

    /**
     * Validate access token
     */
    validateToken(accessToken: string): Observable<ValidateTokenResponse> {
        const url = `${this.baseUrl}/rest/rummy/player/validateToken`;
        console.log('🔐 API - Validating token:', url);

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        });

        return this.http.post<ValidateTokenResponse>(url, {}, { headers });
    }

    /**
     * Get player details
     */
    getPlayerDetails(accessToken: string): Observable<PlayerDetails> {
        const url = `${this.baseUrl}/api/player/getProfile`;
        console.log('🔐 API - Getting player details:', url);

        const headers = new HttpHeaders({
            'Authorization': `bearer ${accessToken}`,
            'Content-Type': 'application/json'
        });

        return this.http.get<PlayerDetails>(url, { headers });
    }

    /**
     * Validate token with error handling
     */
    validateTokenWithErrorHandling(accessToken: string): Observable<ValidateTokenResponse | ApiError> {
        const url = `${this.baseUrl}/rest/rummy/player/validateToken`;

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        });

        return this.http.post<ValidateTokenResponse | ApiError>(url, {}, { headers });
    }
}