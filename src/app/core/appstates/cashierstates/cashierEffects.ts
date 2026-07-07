import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { exhaustMap, map, catchError, tap } from 'rxjs/operators';

import * as cashierActions from './cashierActions';
import { CashierService } from '../../services/cashier/cashier.service';
import { LoginService } from '../../services/login/login.service';
import { Balance } from '../../modules/cashier/balance';
import { TrasactionHistory } from '../../modules/cashier/trasactionhistory';

const handleError = (error: any, ActionClass: any) => {
    if (error.error instanceof Error) {
        return of(new ActionClass({ message: error.error.message }));
    } else {
        try {
            if (error.error?.message) {
                return of(new ActionClass({ message: error.error.message }));
            } else if (error.message) {
                return of(new ActionClass({ message: error.message }));
            }
            return of(new ActionClass({ message: "Something went wrong, please contact admin." }));
        } catch (err) {
            console.error("Error : ", err);
            return of(new ActionClass({ message: "Something went wrong, please contact admin." }));
        }
    }
};

@Injectable()
export class CashierEffects {
    // Use ONLY inject() - remove constructor
    private actions$ = inject(Actions);
    private router = inject(Router);
    private cashierservice = inject(CashierService);
    private loginService = inject(LoginService);

    cashierGetBalance$ = createEffect(() =>
        this.actions$.pipe(
            ofType(cashierActions.CASHIER_GET_BALANCE),
            exhaustMap((action: cashierActions.CashierGetBalanceStart) =>
                this.cashierservice.onCashierGetBalance().pipe(
                    map((response: Balance) => new cashierActions.CashierGetBalanceSuccess(response)),
                    catchError((error: HttpErrorResponse) => handleError(error, cashierActions.CashierGetBalanceFail))
                )
            )
        )
    );

    cashierGetBalanceSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(cashierActions.CASHIER_GET_BALANCE_SUCCESS),
            tap((action: cashierActions.CashierGetBalanceSuccess) => {
                const { payload } = action;
                if (payload && payload.code) {
                    if (payload.code === 'SESSION_EXPIRED') {
                        this.cashierservice.sessionExpire(true);
                        this.loginService.onPlayerLoggedIn(false);
                    } else {
                        this.cashierservice.sessionExpire(false);
                    }
                }
            })
        ),
        { dispatch: false }
    );

    cashierTransactionHistory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(cashierActions.CASHIER_TRANSACTION_HISTORY),
            exhaustMap((action: cashierActions.CashierTransactionHistory) =>
                this.cashierservice.onCashierTransactionHistory(action.payload).pipe(
                    map((response: TrasactionHistory) => new cashierActions.CashierTransactionHistorySuccess(response)),
                    catchError((error: HttpErrorResponse) => handleError(error, cashierActions.CashierTransactionHistoryFail))
                )
            )
        )
    );
}