import { Component, Output, EventEmitter, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription, combineLatest } from 'rxjs';
import { CommonModule } from '@angular/common';
import { tap, filter } from 'rxjs/operators';

import * as appState from '../../core/appstates/appState';
import * as loginActions from '../../core/appstates/loginstates/loginActions';
import { LoginState } from '../../core/appstates/loginstates/loginState';

import { MessageService } from '../../reusables/message/message.service';
import { LoginService } from '../../core/services/login/login.service';
import { PlayerService } from '../../core/services/player/player.service';

import { PlayerLoginStateService } from '../../reusables/utils/playerLoginStateService';
import { TokenService } from '../../core/services/token.service';
import { TranslateModule } from '@ngx-translate/core';

interface LoginForm {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @ViewChild('loginContainer') loginContainer!: ElementRef;

  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  passwordVisible = false;
  isVisible = false;
  rememberMe = false;
  usernameFocused = false;
  passwordFocused = false;
  shakeForm = false;

  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private store: Store<appState.AppState>,
    private loginService: LoginService,
    private messageService: MessageService,
    private playerService: PlayerService,
private tokenService:TokenService,
    private playerStateService: PlayerLoginStateService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.loginService.showLogin$.subscribe((state:any) => {
        if (state.status && !this.isVisible) {
          this.isVisible = true;
          setTimeout(() => {
            this.resetForm();
            this.loadRememberedCredentials();
            this.animateEntrance();
          }, 50);
        } else if (!state.status && this.isVisible) {
          this.animateExit().then(() => {
            this.isVisible = false;
          });
        }
      })
    );

    this.subscriptions.add(
      this.store.select('loginState').pipe(
        filter(ls => ['LOGIN_START', 'LOGIN_SUCCESS', 'LOGIN_FAIL'].includes(ls.lastAction)),
        tap(ls => this.handleLoginState(ls))
      ).subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isVisible) {
      this.closePopup();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('login-modal')) {
      this.closePopup();
    }
  }

  private handleLoginState(loginState: LoginState): void {
    this.isLoading = loginState.loading;
console.log(loginState)
    if (loginState.lastAction === 'LOGIN_SUCCESS' && loginState.loginResponse?.success) {
      // this.messageService.success('Authentication', 'Login successful', 3000);
      this.persistCredentials();
 
      this.animateSuccess().then(() => {
        this.closePopup();
      });
    } else if (loginState.lastAction === 'LOGIN_FAIL') {
      this.error = loginState.loginErrorResponse?.message || 'Login failed';
      this.animateError();
      this.messageService.error('Authentication', this.error, 3000);
    }
  }

  
  private animateEntrance(): void {
    if (this.loginContainer?.nativeElement) {
      const element = this.loginContainer.nativeElement;
      element.style.transform = 'scale(0.8) translateY(-50px)';
      element.style.opacity = '0';

      setTimeout(() => {
        element.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        element.style.transform = 'scale(1) translateY(0)';
        element.style.opacity = '1';
      }, 50);
    }
  }

  private animateExit(): Promise<void> {
    return new Promise((resolve) => {
      if (this.loginContainer?.nativeElement) {
        const element = this.loginContainer.nativeElement;
        element.style.transition = 'all 0.3s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
        element.style.transform = 'scale(0.9) translateY(20px)';
        element.style.opacity = '0';

        setTimeout(() => {
          resolve();
        }, 300);
      } else {
        resolve();
      }
    });
  }

  private animateSuccess(): Promise<void> {
    return new Promise((resolve) => {
      if (this.loginContainer?.nativeElement) {
        const element = this.loginContainer.nativeElement;

        element.style.boxShadow = '0 0 0 0 rgba(5, 214, 142, 0.7)';
        element.style.transition = 'all 0.4s ease';

        setTimeout(() => {
          element.style.boxShadow = '0 0 0 20px rgba(5, 214, 142, 0)';
        }, 100);

        setTimeout(() => {
          resolve();
        }, 500);
      } else {
        resolve();
      }
    });
  }

  private animateError(): void {
    this.shakeForm = true;
    setTimeout(() => {
      this.shakeForm = false;
    }, 600);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const toggleBtn = document.querySelector('.toggle-pass') as HTMLElement;
    if (toggleBtn) {
      toggleBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        toggleBtn.style.transform = 'scale(1)';
        toggleBtn.style.transition = 'transform 0.2s ease';
      }, 150);
    }
  }

  onRemember(): void {
    this.rememberMe = !this.rememberMe;
  }

  onSubmitLogin(): void {
    if (this.loginForm.invalid) {
      this.animateInvalidFields();
      return;
    }

    this.error = null;
    this.isLoading = true;
    const formValue: LoginForm = this.loginForm.value;

    this.store.dispatch(new loginActions.LoginStart({
      login: formValue.username,
      password: formValue.password
    }));
  }

  private animateInvalidFields(): void {
    const invalidFields = document.querySelectorAll('.form-group.error');
    invalidFields.forEach((field, index) => {
      (field as HTMLElement).style.transform = 'translateX(0)';
      setTimeout(() => {
        (field as HTMLElement).style.transition = 'transform 0.1s ease';
        (field as HTMLElement).style.transform = 'translateX(-5px)';
        setTimeout(() => {
          (field as HTMLElement).style.transform = 'translateX(5px)';
          setTimeout(() => {
            (field as HTMLElement).style.transform = 'translateX(0)';
          }, 100);
        }, 100);
      }, index * 100);
    });
  }

  openRegister(): void {
    this.animateExit().then(() => {
      this.loginService.closeLogin();
      this.loginService.openRegister();
    });
  }

  closePopup(): void {
    this.animateExit().then(() => {
      this.loginService.closeLogin();
      this.close.emit();
    });
  }

  private resetForm(): void {
    this.loginForm.reset();
    this.error = null;
    this.isLoading = false;
    this.usernameFocused = false;
    this.passwordFocused = false;
    this.shakeForm = false;
  }

  private loadRememberedCredentials(): void {
    try {
      const loginDetails = localStorage.getItem('loginDetails');
      if (loginDetails) {
        const parsed = JSON.parse(loginDetails);
        if (parsed?.loginName) {
          this.rememberMe = true;
          this.loginForm.patchValue({
            username: parsed.loginName || '',
            password: parsed.password || ''
          });

          setTimeout(() => {
            const usernameField = document.querySelector('[formControlName="username"]') as HTMLElement;
            if (usernameField) {
              usernameField.style.transform = 'scale(1.02)';
              usernameField.style.transition = 'transform 0.3s ease';
              setTimeout(() => {
                usernameField.style.transform = 'scale(1)';
              }, 300);
            }
          }, 500);
        }
      }
    } catch {
      localStorage.removeItem('loginDetails');
    }
  }

  private persistCredentials(): void {
    if (this.rememberMe) {
      localStorage.setItem('loginDetails', JSON.stringify({ loginName: this.loginForm.value.username, password: this.loginForm.value.password }));
    } else {
      localStorage.removeItem('loginDetails');
    }
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
}