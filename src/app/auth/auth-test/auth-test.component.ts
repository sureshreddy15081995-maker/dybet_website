// src/app/components/auth-test/auth-test.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../core/services/token.service';
import { WebViewIntegrationService } from '../../core/services/webview-integration.service';
import { AuthApiService } from '../../core/services/webview-auth.service';

@Component({
  selector: 'app-auth-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
 
  `,
   
})
export class AuthTestComponent implements OnInit {
  private tokenService = inject(TokenService);
  private webViewService = inject(WebViewIntegrationService);
  private authApiService = inject(AuthApiService);

  // testAccessToken = 'test-access-token-123';
  testAccessToken = localStorage.getItem("bearer") || "";
  testRefreshToken = 'test-refresh-token-456';

  storageTestResult = '';
  webViewTestResult = '';
  apiTestResult = '';
  completeTestResult = '';

  isTesting = false;
  consoleOutput = '';
  isAuthenticated = false;

  get hasAccessToken(): boolean {
    return !!this.tokenService.getAccessToken();
  }

  get hasRefreshToken(): boolean {
    return !!this.tokenService.getRefreshToken();
  }

  get hasAuthToken(): boolean {
    return !!this.tokenService.getAuthToken();
  }

  get userId(): string | null {
    return this.tokenService.getUserId();
  }

  ngOnInit() {
    // Subscribe to authentication state
    this.tokenService.isAuthenticated$.subscribe(auth => {
      this.isAuthenticated = auth;
      this.log(`Authentication state changed: ${auth}`);
    });

    this.log('Auth Test Component Initialized');
  }

  // 1. Token Storage Tests
  async testTokenStorage() {
    this.log('Testing token storage...');

    try {
      // Test setting tokens
      this.tokenService.setTokens('test-auth', 'test-refresh', 'test-user-123', 'test-access');

      // Verify tokens were stored
      const accessToken = this.tokenService.getAccessToken();
      const authToken = this.tokenService.getAuthToken();
      const refreshToken = this.tokenService.getRefreshToken();
      const userId = this.tokenService.getUserId();

      const allPresent = accessToken && authToken && refreshToken && userId;

      if (allPresent) {
        this.storageTestResult = 'pass';
        this.log('✅ Token storage test PASSED');
      } else {
        this.storageTestResult = 'fail';
        this.log('❌ Token storage test FAILED - Missing tokens');
      }

      // Clean up
      this.tokenService.clearTokens();

    } catch (error) {
      this.storageTestResult = 'fail';
      this.log(`❌ Token storage test FAILED - Error: ${error}`);
    }
  }
  

  // 3. API Integration Tests
  async testTokenValidation() {
    this.isTesting = true;
    this.log('Testing token validation API...');

    try {
      const accessToken = this.tokenService.getAccessToken();

      if (!accessToken) {
        this.log('⚠️ No access token available for validation test');
        this.apiTestResult = 'No token available';
        return;
      }

      const result = await this.tokenService.validateToken().toPromise();
      this.log(`Token validation result: ${JSON.stringify(result)}`);

      if (result) {
        this.apiTestResult = 'pass';
        this.log('✅ Token validation API test PASSED');
      } else {
        this.apiTestResult = 'fail';
        this.log('❌ Token validation API test FAILED');
      }

    } catch (error) {
      this.apiTestResult = 'fail';
      this.log(`❌ Token validation API test FAILED - Error: ${error}`);
    } finally {
      this.isTesting = false;
    }
  }

  async testTokenRefresh() {
    this.isTesting = true;
    this.log('Testing token refresh API...');

    try {
      // First set a refresh token
      this.tokenService.setTokens('', 'test-refresh-token');

      const result = await this.tokenService.createAuthToken().toPromise();
      this.log(`Token refresh result: ${JSON.stringify(result)}`);

      // Note: This will likely fail with a test token, but that's expected
      if (result !== null) {
        this.apiTestResult = 'pass';
        this.log('✅ Token refresh API test PASSED');
      } else {
        this.apiTestResult = 'expected_fail';
        this.log('⚠️ Token refresh failed (expected with test token)');
      }

    } catch (error) {
      this.apiTestResult = 'expected_fail';
      this.log(`⚠️ Token refresh failed (expected): ${error}`);
    } finally {
      this.isTesting = false;
      this.tokenService.clearTokens();
    }
  }

  async testPlayerDetails() {
    this.isTesting = true;
    this.log('Testing player details API...');

    try {
      const accessToken = this.tokenService.getAccessToken();

      if (!accessToken) {
        this.log('⚠️ No access token available for player details test');
        this.apiTestResult = 'No token available';
        return;
      }

      const result = await this.authApiService.getPlayerDetails(accessToken).toPromise();
      this.log(`Player details result: ${JSON.stringify(result)}`);

      this.apiTestResult = 'pass';
      this.log('✅ Player details API test PASSED');

    } catch (error) {
      this.apiTestResult = 'expected_fail';
      this.log(`⚠️ Player details API failed (may be expected): ${error}`);
    } finally {
      this.isTesting = false;
    }
  }
 
  // Utility methods
  clearAllTokens() {
    this.tokenService.clearTokens();
    this.log('🗑️ All tokens cleared');
  }

  showConsoleLogs() {
    this.log('📋 Current state:');
    this.log(`- Access Token: ${this.hasAccessToken}`);
    this.log(`- Refresh Token: ${this.hasRefreshToken}`);
    this.log(`- Auth Token: ${this.hasAuthToken}`);
    this.log(`- User ID: ${this.userId}`);
    this.log(`- Authenticated: ${this.isAuthenticated}`);
  }

  clearConsole() {
    this.consoleOutput = '';
    this.log('Console cleared');
  }

  private log(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.consoleOutput += `[${timestamp}] ${message}\n`;
    console.log(`[AuthTest] ${message}`);
  }
}