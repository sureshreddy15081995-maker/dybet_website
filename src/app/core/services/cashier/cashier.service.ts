import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlayerService } from '../player/player.service';
import { environment } from '../../../../environments/environment';
import { Balance } from '../../modules/cashier/balance';
import { Store } from '@ngrx/store';
import { AppState } from '../../appstates/appState';
import { PlayerSessionExpired } from '../../appstates/cashierstates/cashierActions';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CashierService {

  constructor(private httpClient: HttpClient,
    private playerservice: PlayerService,
    private store: Store<AppState>) { }

  onCashierGetBalance() {
    return this.httpClient.post<Balance>(`${environment.baseUrl}${environment.api.cashier.balance}`, {}, this.playerservice.httpOptions());
  }

  sessionExpire(value: boolean) {
    if (value === true) {
      this.store.dispatch(new PlayerSessionExpired({ session: value }));
    }
  }

  onCashierTransactionHistory(postData: any) {
    return this.httpClient.post<any>(`${environment.baseUrl}${environment.api.history.transaction}`, postData, this.playerservice.httpOptions());
  }

  public getdeposit(depositData: any): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}${environment.api.cashier.deposit}`,
      depositData,
      this.playerservice.httpOptions()
    );
  }

}
