import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule
} from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { Slots } from '../core/services/slots';
import { PlayerService } from '../core/services/player/player.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../core/appstates/appState';
import { WalletInfo } from '../core/modules/cashier/balance';
import { CashierState } from '../core/appstates/cashierstates/cashierState';

@Component({
  selector: 'app-cashout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './cashout.html',
  styleUrl: './cashout.css'
})

export class Cashout {

  withdrawalForm!: FormGroup;

  showSuccessPopup:boolean = false;
  showFailedPopup:boolean = false;

  balance: number = 500000;
  errorMessage = '';

  selectedAmount: number = 0;
  mobileNumber:any;
  loading = false;

  operators = [
    'Orange Money',
    'M-Pesa',
    'Airtel Money'
  ];

  quickAmounts = [1000, 5000, 10000, 50000];
  showErrorPopup = false;

  profile:any;

  private subscriptions: Subscription = new Subscription();

  walleteInfo!: WalletInfo[];

  cash: any;
  type: any;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private slotservice: Slots,
    private playerservice: PlayerService
  ) { }

  ngOnInit(): void {

    // PLAYER PROFILE
    this.playerservice.onPlayerGetProfile().subscribe((data: any) => {

      if (data) {
        this.profile = data;
      }

    });

    // WALLET INFO
    this.subscriptions = this.store
      .select("cashierState")
      .subscribe((cashierState: CashierState) => {

        if (cashierState.balance) {

          if (cashierState.balance.values) {

            this.walleteInfo = cashierState.balance.values;

            for (let wallet of this.walleteInfo) {

              if (wallet.preferred == true) {

                this.cash = wallet.cash.value;
                this.type = wallet.wallet.name;

              }

            }

          }

        }

      });

    // FORM
    this.withdrawalForm = this.fb.group({

      amount: [
        '',
        [
          Validators.required,
          Validators.min(1000),
          Validators.max(this.balance),
          Validators.pattern('^[0-9]*$')
        ]
      ]

    });

  }

  // QUICK SELECT AMOUNT
  selectAmount(amount: number): void {

    this.selectedAmount = amount;

    this.withdrawalForm.patchValue({
      amount: amount
    });

  }

  // GETTERS
  get amount() {
    return this.withdrawalForm.get('amount');
  }

  get mobile() {
    return this.withdrawalForm.get('mobile');
  }

  // WITHDRAW API
  onWithdraw(): void {

    if (this.withdrawalForm.invalid) {

      this.withdrawalForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const formValue = this.withdrawalForm.value;
    const payload = {

      amount: formValue.amount,
      paymentMethod: "6",
      "accountType": "",  
      "bankName": "",
      "personalNumber": this.mobileNumber,   
      "nameOnAccount": this.profile?.login,   
      "ifsc": this.mobileNumber

    };
    {  
  }
    console.log(payload);

    this.slotservice
      .onCashierWithdrawCashout(payload)
      .subscribe({

        next: (response: any) => {

          this.loading = false;

          if (response.result.success) {
 
this.errorMessage = 'Your cashout request submitted successfully.'
            this.showSuccessPopup = true; 
            this.withdrawalForm.reset();
            this.selectedAmount = 0;

          } else { 
            this.showError(response.result.errorMsg?response.result.errorMsg:response.result.comments);
            this.showFailedPopup = true;

          }

        },

        error: (error: any) => {

          this.loading = false;

          console.log(error);

          this.showFailedPopup = true;
          this.showError('Withdrawal Failed'); 

        }

      });

  }
  showError(message: string): void {

    this.errorMessage = message;

    this.showErrorPopup = true;

  }
  closePopup(): void {

    this.showSuccessPopup = false;

    this.showErrorPopup = false;
this.errorMessage = ''
  }
}