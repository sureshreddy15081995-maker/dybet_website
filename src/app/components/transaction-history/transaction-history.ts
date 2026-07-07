import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import * as cashierActions from '../../core/appstates/cashierstates/cashierActions';
import * as appState from '../../core/appstates/appState';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { CashierState } from '../../core/appstates/cashierstates/cashierState';
import { MessageService } from '../../reusables/message/message.service';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-transaction-history',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule],
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.css'
})
export class TransactionHistory implements OnInit, OnDestroy {
  transactionForm: FormGroup;
  today: string;
  transactions: any[] = [];
  pagedTransactions: any[] = [];
  isLoading: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  private storeSub!: Subscription;

  // Math function for template
  Math = Math;

  constructor(
    private store: Store<appState.AppState>,
    private fb: FormBuilder,
    public messageService: MessageService
  ) {
    const currentDate = new Date();
    this.today = this.formatDateForInput(currentDate);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 7);
    const sevenDaysAgoStr = this.formatDateForInput(sevenDaysAgo);

    this.transactionForm = this.fb.group({
      startDate: [sevenDaysAgoStr, Validators.required],
      endDate: [this.today, Validators.required]
    });
  }

  // Helper method to format date as YYYY-MM-DD for input[type="date"]
  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Helper method to format date as DD-MM-YYYY for API
  private formatDateForAPI(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Format date for display
  formatDisplayDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  }

  // Get status class for styling
  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('start') || statusLower.includes('complete') || statusLower.includes('success')) {
      return 'started';
    } else if (statusLower.includes('fail') || statusLower.includes('error')) {
      return 'failed';
    } else if (statusLower.includes('lock')) {
      return 'locked';
    } else if (statusLower.includes('pending')) {
      return 'pending';
    } else {
      return 'started'; // default
    }
  }

  // Get status icon
  getStatusIcon(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('start') || statusLower.includes('complete') || statusLower.includes('success')) {
      return 'fas fa-check-circle';
    } else if (statusLower.includes('fail') || statusLower.includes('error')) {
      return 'fas fa-times-circle';
    } else if (statusLower.includes('lock')) {
      return 'fas fa-lock';
    } else if (statusLower.includes('pending')) {
      return 'fas fa-clock';
    } else {
      return 'fas fa-info-circle'; // default
    }
  }

  updateEndDateMin() {
    const startDate = this.transactionForm.get('startDate')?.value;
    const endDateControl = this.transactionForm.get('endDate');
    if (endDateControl && endDateControl.value < startDate) {
      endDateControl.setValue(startDate);
    }
  }

  getTransactions() {
    if (this.transactionForm.valid) {
      const { startDate, endDate } = this.transactionForm.value;
      this.isLoading = true;

      const body = {
        currency: "CDF",
        startDate: this.formatDateForAPI(startDate),
        endDate: this.formatDateForAPI(endDate),
        limit: "100",
        index: "0",
        type: "Deposits"
      };

      this.store.dispatch(new cashierActions.CashierGetBalanceStart());
      this.store.dispatch(new cashierActions.CashierTransactionHistory(body));
    } else {
      this.messageService.error("Form Error", "Please select valid start and end dates");
    }
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.transactions.length / this.itemsPerPage);

    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedTransactions = this.transactions.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  onPageSizeChange(newSize: string): void {
    this.itemsPerPage = parseInt(newSize, 10);
    this.currentPage = 1;
    this.updatePagination();
  }

  ngOnInit() {
    this.transactions = [];
    this.storeSub = this.store.select("cashierState").pipe(
      map((cashierState: CashierState) => cashierState.TrasactionHistory),
      distinctUntilChanged((prev, curr) => {
        return JSON.stringify(prev) === JSON.stringify(curr);
      })
    ).subscribe(
      (transactionHistory: any | null) => {
        const depositHistory = transactionHistory?.deposits;
        this.isLoading = false;

        if (depositHistory && Array.isArray(depositHistory)) {
          this.transactions = depositHistory.map((deposit: any) => {
            const cleanDate = deposit.startDate.replace('[UTC]', '');
            const dateObj = new Date(cleanDate);

            // Parse amounts properly
            const cashAmount = parseFloat(deposit.cashAmount?.replace(',', '.') || '0');
            const bonusAmount = parseFloat(deposit.bonus?.replace(',', '.') || '0');

            return {
              date: dateObj.toISOString().substring(0, 23),
              amount: cashAmount,
              bonus: bonusAmount,
              status: deposit.status
            };
          });

          this.updatePagination();

          if (this.transactions.length > 0) {
            this.messageService.success("Success", `Loaded ${this.transactions.length} transaction records`);
          } else {
            this.messageService.warning("No Data", "No transactions found for the selected period");
          }
        } else {
          this.transactions = [];
          this.pagedTransactions = [];
          if (this.transactionForm.valid) {
            this.messageService.error("Error", "Failed to load transaction history");
          }
        }
      },
      (error) => {
        this.messageService.error("Error", "Failed to load transaction history");
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.transactions = [];
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}