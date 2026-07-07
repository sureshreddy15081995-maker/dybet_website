// src/app/core/services/webview-integration.service.ts
import { Injectable, inject } from '@angular/core';
import { TokenService } from './token.service';

declare global {
    interface Window {
        NativeWebinterface: {
            onWebInterfaceCallback: (data: any) => void;
        };
        onWebViewLoad: (data: any) => void;
    }
}

@Injectable({
    providedIn: 'root'
})
export class WebViewIntegrationService {
    private tokenService = inject(TokenService);
    private isInitialized = false;

    constructor() { 
    }

    /**
     * Initialize webview communication handlers
     */
// Inside your WebViewIntegrationService or component

 
     
 
}