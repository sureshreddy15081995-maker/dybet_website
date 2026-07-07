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
import { TokenService } from '../../core/services/token.service';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

interface RegisterRequest {
  login: string;
  nickname: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  // ssn: string;
  campaignCode: null;
  wmReferenceId: string;
  promocode: string | null;
  address: {
    phone: string;
  };
}

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class Register implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @ViewChild('registerContainer') registerContainer!: ElementRef;
  showTermsError = false;
  registerForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  passwordVisible = false;
  isVisible = false;
  termsAccepted = false;
  shakeForm = false;
  maxDate: string = '';
  // Focus states for form fields
  usernameFocused = false;
  firstNameFocused = false;
  lastNameFocused = false;
  passwordFocused = false;
  ssnFocused = false;
  emailFocused = false;
  phoneFocused = false;

  private agentId: string | null = null;
  private affcheckid: string | null = null;
  private type: string | null = null;
  private campaignCode: string = '70af5154';
  private wmReferenceId: string | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private store: Store<appState.AppState>,
    private fb: FormBuilder,
    private tokenService: TokenService,
    private messageService: MessageService,
    private loginService: LoginService,
    private playerService: PlayerService,
    private router: Router
  ) {
    this.parseUrlParameters();
    this.registerForm = this.createForm();
  }

  ngOnInit(): void {

    const today = new Date();

    const maxDob = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
  
    this.maxDate = maxDob.toISOString().split('T')[0];
    this.subscribeToRegisterVisibility();
    this.subscribeToLoginState();
  }
  ageValidator(control: any) {

    if (!control.value) {
      return null;
    }
  
    const dob = new Date(control.value);
    const today = new Date();
  
    let age = today.getFullYear() - dob.getFullYear();
  
    const monthDiff = today.getMonth() - dob.getMonth();
  
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dob.getDate())
    ) {
      age--;
    }
  
    return age >= 18 ? null : { underAge: true };
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isVisible) {
      this.closeRegister();
    }
  }

  private parseUrlParameters(): void {
    const urlParams = new URLSearchParams(window.location.search);

    if (window.location.search.includes('type=agent')) {
      this.type = 'agent';
      this.agentId = urlParams.get('ID');
      this.campaignCode = localStorage.getItem('agentCid') || this.agentId || this.campaignCode;
      if (this.agentId && !localStorage.getItem('agentCid')) {
        localStorage.setItem('agentCid', this.agentId);
      }
    }
    else if (window.location.search.includes('type=affiliate')) {
      this.type = 'affiliate';
      this.agentId = urlParams.get('ID');
      this.affcheckid = urlParams.get('click_id');

      this.campaignCode = localStorage.getItem('affCid') || this.agentId || this.campaignCode;
      this.wmReferenceId = localStorage.getItem('affcheckid') || this.affcheckid;

      if (this.agentId && !localStorage.getItem('affCid')) {
        localStorage.setItem('affCid', this.agentId);
      }
      if (this.affcheckid && !localStorage.getItem('affcheckid')) {
        localStorage.setItem('affcheckid', this.affcheckid);
      }
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
  
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
  
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
  
      login: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
  
      email: ['', [
        Validators.required,
        Validators.email
      ]],
  
      phone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{7,12}$/)
      ]],
      dob: ['', [
        Validators.required,
        this.ageValidator.bind(this)
      ]],
  
      city: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
  
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
  
    });
  }

  private subscribeToRegisterVisibility(): void {
    this.subscriptions.add(
      this.loginService.showRegister$.subscribe(state => {
        if (state.status && !this.isVisible) {
          this.isVisible = true;
          setTimeout(() => {
            this.resetForm();
            this.resetState();
            this.animateEntrance();
          }, 50);
        } else if (!state.status && this.isVisible) {
          this.animateExit().then(() => {
            this.isVisible = false;
          });
        }
      })
    );
  }
 
  
  get cityControl() {
    return this.registerForm.get('city');
  }
  private subscribeToLoginState(): void {
    this.subscriptions.add(
      this.store.select("loginState").pipe(
        filter(ls => ['REGISTER_START', 'REGISTER_SUCCESS', 'REGISTER_FAIL'].includes(ls.lastAction)),
        tap(ls => this.handleLoginState(ls))
      ).subscribe()
    );
  }

  private handleLoginState(loginState: LoginState): void {
    this.isLoading = loginState.loading;

    if (loginState.lastAction === 'REGISTER_SUCCESS' && loginState.loginResponse?.success) {
      this.handleSuccess(); 
    } else if (loginState.lastAction === 'REGISTER_FAIL') {
      this.handleLoginFailure(loginState);
    }
  }

 
  private handleSuccess(): void {
    // const loginMessage = '🎉Registration successful';
    // this.messageService.success('Authentication', loginMessage, 10000);
    this.animateSuccess().then(() => {
      this.closeRegister();
    });
  }

  private handleLoginFailure(loginState: LoginState): void {
    const errorMessage = loginState?.loginErrorResponse?.message || loginState?.loginResponse?.description || 'Registration failed';
    this.messageService.error('Authentication', errorMessage, 5000);
    this.error = errorMessage;
    this.animateError();
  }

  private animateEntrance(): void {
    if (this.registerContainer?.nativeElement) {
      const element = this.registerContainer.nativeElement;
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
      if (this.registerContainer?.nativeElement) {
        const element = this.registerContainer.nativeElement;
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
      if (this.registerContainer?.nativeElement) {
        const element = this.registerContainer.nativeElement;

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

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('login-modal')) {
      this.closeRegister();
    }
  }

  closeRegister(): void {
    this.animateExit().then(() => {
      this.loginService.closeRegister();
      this.close.emit();
    });
  }
  navigateToTerms() {
    this.closeRegister();
  
    setTimeout(() => {
      this.router.navigate(['/terms-of-use']);
    }, 100);
  }
  
  navigateToPrivacy() {
    this.closeRegister();
  
    setTimeout(() => {
      this.router.navigate(['/aml-policy']);
    }, 100);
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

  onCheckedTerms(): void {

    this.termsAccepted = !this.termsAccepted;
  
    if (this.termsAccepted) {
      this.showTermsError = false;
    }
  
  }
  get dobControl() {

    return this.registerForm.get('dob');
  
  }
  onSubmitRegister(): void {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      this.animateInvalidFields();
      return;
    }

    if (!this.termsAccepted) {
      this.messageService.error('Registration', 'Please accept terms and conditions', 5000);
      return;
    }

    const formData = this.registerForm.value;

    // const registerData: RegisterRequest = {
    //   login: formData.login,
    //   email: formData.email,
    //   password: formData.password,
    //   address: {
    //     phone: formData.phone
    //   }
    //   nickname: formData.login,
    //   firstName: formData.firstName,
    //   lastName: formData.lastName,
    //   ssn: formData.ssn,
    //   campaignCode: this.campaignCode,
    //   promocode: null,
    // };

    // const registerData: RegisterRequest = {
    //   login: formData.login,
    //   email: formData.email,
    //   password: formData.password,
    //   address: {
    //     phone: formData.phone
    //   }
    // };'
    const dobDate =
    new Date(formData.dob);
    const registerData: any = {
      login: formData.login,
    
      nickname: formData.login,
    
      email: formData.email,
    
      firstName: formData.firstName,
    
      lastName: formData.lastName,
    
      password: formData.password,
    
      campaignCode: this.campaignCode || '',
    
      wmReferenceId: this.wmReferenceId || '',
    
      referralType: this.type,
    
      promocode: null,
    
      birthday: {
        year: dobDate.getFullYear(),
        month: dobDate.getMonth() + 1,
        day: dobDate.getDate()
      },
    
      address: {
        city: formData.city,
        country: '178',
        phone: formData.phone
      },
    
      ...(this.agentId
        ? { referrerLogin: this.agentId }
        : {})
    };
    this.isLoading = true;
    this.error = null;

    this.store.dispatch(new loginActions.RegisterStart(registerData));
  }

  openLogin(): void {
    this.animateExit().then(() => {
      this.loginService.closeRegister();
      this.loginService.openLogin();
    });
  }

  private resetForm(): void {
    this.registerForm.reset();
    this.error = null;
    this.isLoading = false;
    this.termsAccepted = false;
    this.usernameFocused = false;
    this.firstNameFocused = false;
    this.lastNameFocused = false;
    this.passwordFocused = false;
    this.ssnFocused = false;
    this.emailFocused = false;
    this.phoneFocused = false;
    this.shakeForm = false;
  }

  private resetState(): void {
    this.store.dispatch(new loginActions.ResetState());
  }

  get loginControl() { return this.registerForm.get('login'); }
  get firstNameControl() { return this.registerForm.get('firstName'); }
  get lastNameControl() { return this.registerForm.get('lastName'); }
  get passwordControl() { return this.registerForm.get('password'); }
  get ssnControl() { return this.registerForm.get('ssn'); }
  get emailControl() { return this.registerForm.get('email'); }
  get phoneControl() { return this.registerForm.get('phone'); }
  allowNumbersOnly(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
  
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}