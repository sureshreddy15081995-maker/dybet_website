import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import moment from 'moment';

import { PlayerService } from '../../core/services/player/player.service';
import * as appState from '../../core/appstates/appState';
import * as cashierActions from '../../core/appstates/cashierstates/cashierActions';
import { PlayerGetRemoteGameHistory } from '../../core/appstates/playerstates/playerActions';
import { ProfileState } from '../../core/appstates/playerstates/playerState';
import { MessageService } from '../../reusables/message/message.service';
import { TranslateModule } from '@ngx-translate/core';

interface GameHistoryEntry {
  from: string;
  to: string;
  name: string;
  initialBalance: string;
  bet: string;
  buyIn: string;
  win: string;
  closingBalance: string;
}

interface Transaction {
  from_date: string;
  to_date: string;
  name: string;
  initialBalance: string;
  bet: string;
  buyIn: string;
  win: number;
  closingBalance: string;
}

@Component({
  selector: 'app-game-history',
  imports: [CommonModule, ReactiveFormsModule, FormsModule , TranslateModule],
  templateUrl: './game-history.html',
  styleUrl: './game-history.css'
})
export class GameHistory {
parseFloat(arg0: string) {
throw new Error('Method not implemented.');
}
  private storeSub!: Subscription;
  transactionForm: FormGroup;
  today: string;
  gamesHistory: Transaction[] = [];
  paginatedGamesHistory: Transaction[] = [];
  isLoading = false;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(
    private fb: FormBuilder,
    private playerService: PlayerService,
    private store: Store<appState.AppState>,
    public messageService: MessageService
  ) {
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0];

    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    this.transactionForm = this.fb.group({
      startDate: [sevenDaysAgoStr, Validators.required],
      endDate: [this.today, Validators.required]
    });
  }

  // Math function for template
  Math = Math;

  updateEndDateMin(): void {
    const startDate = this.transactionForm.get('startDate')?.value;
    const endDateControl = this.transactionForm.get('endDate');

    if (endDateControl && endDateControl.value < startDate) {
      endDateControl.setValue(startDate);
    }
  }

  getTransactions(): void {
    if (this.transactionForm.valid) {
      this.isLoading = true;
      const { startDate, endDate } = this.transactionForm.value;

      const body = {
        currency: "CDF",
        startDate: moment(startDate).format('DD-MM-YYYY'),
        endDate: moment(endDate).format('DD-MM-YYYY'),
        limit: "1000",
        index: "0"
      };

      this.store.dispatch(new cashierActions.CashierGetBalanceStart());
      this.store.dispatch(new PlayerGetRemoteGameHistory(body));
    } else {
      this.messageService.error("Form Error", "Please select valid start and end dates");
    }
  }

  private parseAmount(amountString: string): number {
    if (!amountString) return 0;

    const numericValue = amountString.replace(/CDF\s|,/g, '');
    return parseFloat(numericValue) || 0;
  }

  private dateCache = new Map<string, string>();

  private formatDateCached(dateString: string): string {
    if (!dateString || dateString === 'null') return 'N/A';

    if (this.dateCache.has(dateString)) {
      return this.dateCache.get(dateString) as string;
    }

    try {
      const date = new Date(dateString);
      const formatted = date.toISOString().split('T')[0];
      this.dateCache.set(dateString, formatted);
      return formatted;
    } catch (e) {
      return dateString;
    }
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.gamesHistory.length / this.itemsPerPage);

    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedGamesHistory = this.gamesHistory.slice(startIndex, endIndex);
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

  trackByTransaction(index: number, transaction: Transaction): string {
    return `${transaction.from_date}-${transaction.to_date}-${transaction.name}-${index}`;
  }

  ngOnInit(): void {
    this.gamesHistory = [];
    this.storeSub = this.store.select("playerState").subscribe(
      (playerState: ProfileState) => {
        if (playerState.remotegameshistory?.values) {
          this.gamesHistory = playerState.remotegameshistory.values.map((entry: GameHistoryEntry) => ({
            from_date: this.formatDateCached(entry.from),
            to_date: this.formatDateCached(entry.to),
            name: entry.name,
            initialBalance: entry.initialBalance,
            bet: entry.bet,
            buyIn: entry.buyIn,
            win: this.parseAmount(entry.win),
            closingBalance: entry.closingBalance
          }));

          this.updatePagination();

          if (this.gamesHistory.length > 0) {
            this.messageService.success("Success", `Loaded ${this.gamesHistory.length} game history records`);
          } else {
            this.messageService.warning("No Data", "No game history found for the selected period");
          }
        } else if (playerState.remotegameshistory?.description) {
          this.messageService.error("Error", String(playerState.remotegameshistory.description));
        }

        this.isLoading = false;
      },
      (error) => {
        this.messageService.error("Error", "Failed to load game history");
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
    this.dateCache.clear();
    this.gamesHistory = [];
  }
  formatAmount(value: any): number {

    if (!value) return 0;
  
    return parseFloat(
      value.toString().replace('BDT', '')
    ) || 0;
  
  }
}