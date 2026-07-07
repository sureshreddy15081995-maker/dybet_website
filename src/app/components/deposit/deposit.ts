import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from '../../core/services/player/player.service';
import { CashierService } from '../../core/services/cashier/cashier.service';
import { GameLauncherService } from '../../core/services/gameLauncher/game-launcher.service';
import { TranslateModule } from '@ngx-translate/core';
import { Slots } from '../../core/services/slots';

@Component({
  selector: 'app-deposit',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule],
  templateUrl: './deposit.html',
  styleUrl: './deposit.css'
})
export class Deposit {
  loading = false;
  depositForm!: FormGroup;
  playerDetails: any = null;
  availableBalance: string = '0.00';
  isLoading: boolean = false;
  selectedOperator = 'Orange Money';
  selectedAmount = 0;
  quickAmounts: number[] = [];
  type: any;
  paymentMethods: any[] = [];
  selectedPaymentMethod: any = null;
  paymentDropdownOpen = false;
  errormassage: any;
  systemDropdownOpen = false;
  supportedSystems: string[] = [];
  selectedSystem: string = '';
  showSuccessPopup = false

  showErrorPopup = false;

  successMessage = '';
  noPaymentMethods = false;
  errorMessage = '';
  constructor(private fb: FormBuilder, private slotservice: Slots, private cashierService: CashierService, private playerService: PlayerService, private gameLauncherService: GameLauncherService) {

  }

  ngOnInit() {

    this.loadPlayerBalance();
    this.loadPlayerProfile();
    this.depositForm = this.fb.group({
      amount: [
        '',
        [
          Validators.required,
          Validators.min(1000)
        ]
      ],
      phone: [
        '',

      ]
    });
    this.slotservice.PaymentMethodslist().subscribe((res: any) => {

      const depositMethods = res?.data?.deposit;
      if (
        !depositMethods ||
        Object.keys(depositMethods).length === 0
      ) {

        this.noPaymentMethods = true;

        return;

      }
      this.noPaymentMethods = false;
      this.paymentMethods = Object.keys(depositMethods).map((key) => ({
        key: key,
        ...depositMethods[key]
      }));

      // default first button active

      if (this.paymentMethods.length > 0) {

        this.onSelectPaymentMethod(
          this.paymentMethods[0]
        );

      }

    });
  }
  get isMtnPayment(): boolean {
    return this.selectedPaymentMethod?.paymethod === 'MTN_PAYMENT';
  }
  //   onSelectPaymentMethod(method: any): void {
  //     this.selectedPaymentMethod = method;   
  // this.supportedSystems = [method.paymethod]; 
  // if (method.supportedSystems &&
  //     method.supportedSystems.length > 0) {
  //   this.supportedSystems = [
  //     method.paymethod,
  //     ...method.supportedSystems
  //   ];
  // }      
  //     this.selectedSystem = this.supportedSystems[0];  
  //     this.depositForm.get('amount')?.setValidators([
  //       Validators.required,
  //       Validators.min(method.minPayinValue),
  //       Validators.max(method.maxPayinValue)
  //     ]);

  //     this.depositForm.get('amount')?.updateValueAndValidity();

  //     // dynamic quick amounts

  //     this.quickAmounts = this.generateQuickAmounts(
  //       method.minPayinValue,
  //       method.maxPayinValue
  //     );

  //   }

  onSelectPaymentMethod(method: any): void {

    this.selectedPaymentMethod = method;

    const phoneControl = this.depositForm.get('phone');

    if (method.paymethod === 'MTN_PAYMENT') {

      phoneControl?.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]{9,12}$/)
      ]);

    } else {

      phoneControl?.clearValidators();
      phoneControl?.setValue('');

    }

    phoneControl?.updateValueAndValidity();

    this.depositForm.get('amount')?.setValidators([
      Validators.required,
      Validators.min(method.minPayinValue),
      Validators.max(method.maxPayinValue)
    ]);

    this.depositForm.get('amount')?.updateValueAndValidity();

    this.quickAmounts = this.generateQuickAmounts(
      method.minPayinValue,
      method.maxPayinValue
    );
  }
  generateQuickAmounts(min: number, max: number): number[] {

    const amounts = [];

    amounts.push(min);

    amounts.push(
      Math.round((min + max * 0.25) / 100) * 100
    );

    amounts.push(
      Math.round((min + max * 0.5) / 100) * 100
    );

    amounts.push(max);

    // remove duplicates

    return [...new Set(amounts)];

  }
  selectOperator(operator: string): void {

    this.selectedOperator = operator;

  }

  selectAmount(amount: number): void {

    this.selectedAmount = amount;

    this.depositForm.patchValue({
      amount: amount
    });

  }
  loadPlayerBalance(): void {
    this.cashierService.onCashierGetBalance().subscribe((res) => this.handleCashierResponse(res));
  }

  handleCashierResponse(apiRes: any) {
    if (apiRes.success && Array.isArray(apiRes.values)) {
      let available = 0;
      let bonus = 0;
      let inPlay = 0;
      apiRes.values.forEach((wallet: any) => {
        available = wallet.cash.value;
        bonus = wallet.bonus.value;
        inPlay = wallet.cashInPlay.value;
        this.type = wallet.wallet.name
      });
      this.availableBalance = `${available.toFixed(2)}`;
    }
  }


  loadPlayerProfile(): void {
    this.playerService.onPlayerGetProfile().subscribe((res) => {
      if (res.success) {
        this.playerDetails = res;
        console.log(this.playerDetails)
      }
    });
  }


  deposituse(event: KeyboardEvent) {
    const allowedKeys = '0123456789';
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  onDeposit(): void {
    if (!this.selectedPaymentMethod) {
      return;
    }
    if (this.depositForm.invalid) {
      this.depositForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    let body: any = {
      paymentMethod: "345",
      paymentType: 'deposit',
      "type": "deposit",
      currency: this.type,
      amount: this.depositForm.value.amount,
      userName: this.playerDetails?.login,
      emailId: this.playerDetails?.email,
      payMethod: this.selectedPaymentMethod.paymethod,
    };
    if (this.selectedPaymentMethod?.paymethod === 'MTN_PAYMENT') {
      body.phoneNumber = this.depositForm.value.phone;
    }
    this.slotservice.depositnew(body).subscribe({
      next: (data: any) => {
        this.loading = false;

        if (data?.success) {
          window.open(data?.result?.redirectUrl, '_self');
        } else {
          this.showError(data?.description || data?.code);
        }
      },
      error: (err) => {
        this.loading = false;
        this.showError('Something went wrong');
        console.error(err);
      }
    });



  }

  get amount() {
    return this.depositForm.get('amount');
  }
  showSuccess(message: string): void {

    this.successMessage = message;

    this.showSuccessPopup = true;

  }

  showError(message: string): void {

    this.errorMessage = message;

    this.showErrorPopup = true;

  }

  closePopup(): void {

    this.showSuccessPopup = false;

    this.showErrorPopup = false;

  }
}

