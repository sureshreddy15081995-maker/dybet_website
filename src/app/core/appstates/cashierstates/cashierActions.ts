import { Action } from '@ngrx/store';
import { Balance } from '../../modules/cashier/balance';
import { PaymentSystems } from '../../modules/cashier/paymentSystems';
import { DepositResponse } from '../../modules/cashier/depositResponse';
import { WithDrawResponse } from '../../modules/cashier/withdrawResponse';
import { BankAccountInfo } from '../../modules/cashier/bankAccountInfo';
import { DepositSystems } from '../../modules/cashier/depositSystems';
import { TrasactionHistory } from '../../modules/cashier/trasactionhistory';
import { addBankAccountResponse } from '../../modules/cashier/addbankaccount';


export const CASHIER_GET_BALANCE = "[cashier] CASHIER_GET_BALANCE";
export const CASHIER_GET_BALANCE_SUCCESS = "[cashier] CASHIER_GET_BALANCE_SUCCESS";
export const CASHIER_GET_BALANCE_FAIL = "[cashier] CASHIER_GET_BALANCE_FAIL";

export const CASHIER_RESET_PLAYMONEY = "[cashier] CASHIER_RESET_PLAYMONEY";
export const CASHIER_RESET_PLAYMONEY_SUCCESS = "[cashier] CASHIER_RESET_PLAYMONEY_SUCCESS";
export const CASHIER_RESET_PLAYMONEY_FAIL = "[cashier] CASHIER_RESET_PLAYMONEY_FAIL";

export const CASHIER_GET_PAYMENTS_SYSTEMS = "[cashier] CASHIER_GET_PAYMENTS_SYSTEMS";
export const CASHIER_GET_PAYMENTS_SYSTEMS_SUCCESS = "[cashier] CASHIER_GET_PAYMENTS_SYSTEMS_SUCCESS";
export const CASHIER_GET_PAYMENTS_SYSTEMS_FAIL = "[cashier] CASHIER_GET_PAYMENTS_SYSTEMS_FAIL";

export const CASHIER_DEPOSIT = "[cashier] CASHIER_DEPOSIT";
export const CASHIER_DEPOSIT_SUCCESS = "[cashier] CASHIER_DEPOSIT_SUCCESS";
export const CASHIER_DEPOSIT_FAIL = "[cashier] CASHIER_DEPOSIT_FAIL";

export const CASHIER_OPEN_WITHDRAW_REQUEST = "[cashier] CASHIER_OPEN_WITHDRAW_REQUEST";
export const CASHIER_OPEN_WITHDRAW_REQUEST_SUCCESS = "[cashier] CASHIER_OPEN_WITHDRAW_REQUEST_SUCCESS";
export const CASHIER_OPEN_WITHDRAW_REQUEST_FAIL = "[cashier] CASHIER_OPEN_WITHDRAW_REQUEST_FAIL";

export const CASHIER_WITHDRAW_REQUEST = "[cashier] CASHIER_WITHDRAW_REQUEST";
export const CASHIER_WITHDRAW_REQUEST_SUCCESS = "[cashier] CASHIER_WITHDRAW_REQUEST_SUCCESS";
export const CASHIER_WITHDRAW_REQUEST_FAIL = "[cashier] CASHIER_WITHDRAW_REQUEST_FAIL";

export const CASHIER_CANCEL_WITHDRAW_REQUEST = "[cashier] CASHIER_CANCEL_WITHDRAW_REQUEST";
export const CASHIER_CANCEL_WITHDRAW_REQUEST_SUCCESS = "[cashier] CASHIER_CANCEL_WITHDRAW_REQUEST_SUCCESS";
export const CASHIER_CANCEL_WITHDRAW_REQUEST_FAIL = "[cashier] CASHIER_CANCEL_WITHDRAW_REQUEST_FAIL";

export const CASHIER_TRANSACTION_HISTORY = "[cashier] CASHIER_TRANSACTION_HISTORY";
export const CASHIER_TRANSACTION_HISTORY_SUCCESS = "[cashier] CASHIER_TRANSACTION_HISTORY_SUCCESS";
export const CASHIER_TRANSACTION_HISTORY_FAIL = "[cashier] CASHIER_TRANSACTION_HISTORY_FAIL";

export const CASHIER_ADD_BANK_ACCOUNT = "[cashier] CASHIER_ADD_BANK_ACCOUNT";
export const CASHIER_ADD_BANK_ACCOUNT_SUCCESS = "[cashier] CASHIER_ADD_BANK_ACCOUNT_SUCCESS";
export const CASHIER_ADD_BANK_ACCOUNT_FAIL = "[cashier] CASHIER_ADD_BANK_ACCOUNT_FAIL";

export const CASHIER_GET_BANK_ACCOUNT = "[cashier] CASHIER_GET_BANK_ACCOUNT";
export const CASHIER_GET_BANK_ACCOUNT_SUCCESS = "[cashier] CASHIER_GET_BANK_ACCOUNT_SUCCESS";
export const CASHIER_GET_BANK_ACCOUNT_FAIL = "[cashier] CASHIER_GET_BANK_ACCOUNT_FAIL";

export const CASHIER_DELETE_BANK_ACCOUNT = "[cashier] CASHIER_DELETE_BANK_ACCOUNT";
export const CASHIER_DELETE_BANK_ACCOUNT_SUCCESS = "[cashier] CASHIER_DELETE_BANK_ACCOUNT_SUCCESS";
export const CASHIER_DELETE_BANK_ACCOUNT_FAIL = "[cashier] CASHIER_DELETE_BANK_ACCOUNT_FAIL";

export const CASHIER_GET_DEPOSIT_SYSTEMS = "[cashier] CASHIER_GET_DEPOSIT_SYSTEMS";
export const CASHIER_GET_DEPOSIT_SYSTEMS_SUCCESS = "[cashier] CASHIER_GET_DEPOSIT_SYSTEMS_SUCCESS";
export const CASHIER_GET_DEPOSIT_SYSTEMS_FAIL = "[cashier] CASHIER_GET_DEPOSIT_SYSTEMS_FAIL";

export const CASHIER_GET_WITHDRAW_SYSTEMS = "[cashier] CASHIER_GET_WITHDRAW_SYSTEMS";
export const CASHIER_GET_WITHDRAW_SYSTEMS_SUCCESS = "[cashier] CASHIER_GET_WITHDRAW_SYSTEMS_SUCCESS";
export const CASHIER_GET_WITHDRAW_SYSTEMS_FAIL = "[cashier] CASHIER_GET_WITHDRAW_SYSTEMS_FAIL";

export const CASHIER_WITHDRAW_CASHOUT = "[cashier] CASHIER_WITHDRAW_CASHOUT";
export const CASHIER_WITHDRAW_CASHOUT_SUCCESS = "[cashier] CASHIER_WITHDRAW_CASHOUT_SUCCESS";
export const CASHIER_WITHDRAW_CASHOUT_FAIL = "[cashier] CASHIER_WITHDRAW_CASHOUT_FAIL";

export const RESET_STATE = "[cashier] RESET_STATE";
export const CASHIER_SUBMIT_DEPOSIT_FORM = "[cashier] CASHIER_SUBMIT_DEPOSIT_FORM";
export const CASHIER_SUBMIT_DEPOSIT_FORM_SUCCESS = "[cashier] CASHIER_SUBMIT_DEPOSIT_FORM_SUCCESS";
export const CASHIER_SUBMIT_DEPOSIT_FORM_FAIL = "[cashier] CASHIER_SUBMIT_DEPOSIT_FORM_FAIL";
export const PLAYER_SESSION = "[cashier] PLAYER_SESSION";

export class PlayerSessionExpired implements Action {
    readonly type = PLAYER_SESSION;
    constructor(public payload: { session: boolean }) { }
}
export class CashierGetBalanceStart implements Action {
    readonly type = CASHIER_GET_BALANCE;
    constructor() { }
}
export class CashierGetBalanceSuccess implements Action {
    readonly type = CASHIER_GET_BALANCE_SUCCESS;
    constructor(public payload: Balance) { }
}
export class CashierGetBalanceFail implements Action {
    readonly type = CASHIER_GET_BALANCE_FAIL;
    constructor(public payload: Object) { }
}
export class CashierResetPlayMoneyStart implements Action {
    readonly type = CASHIER_RESET_PLAYMONEY;
    constructor() { }
}
export class CashierResetPlayMoneySuccess implements Action {
    readonly type = CASHIER_RESET_PLAYMONEY_SUCCESS;
    constructor(public payload: Object) { }
}
export class CashierResetPlayMoneyFail implements Action {
    readonly type = CASHIER_RESET_PLAYMONEY_FAIL;
    constructor(public payload: Object) { }
}
export class CashierGetPaymentSystemsStart implements Action {
    readonly type = CASHIER_GET_PAYMENTS_SYSTEMS;
    constructor() { }
}
export class CashierGetPaymentSystemsSuccess implements Action {
    readonly type = CASHIER_GET_PAYMENTS_SYSTEMS_SUCCESS;
    constructor(public payload: PaymentSystems) { }
}
export class CashierGetPaymentSystemsFail implements Action {
    readonly type = CASHIER_GET_PAYMENTS_SYSTEMS_FAIL;
    constructor(public payload: Object) { }
}
export class CashierDepositStart implements Action {
    readonly type = CASHIER_DEPOSIT;
    constructor(public payload: object) { }
}
export class CashierDepositSuccess implements Action {
    readonly type = CASHIER_DEPOSIT_SUCCESS;
    constructor(public payload: DepositResponse) { }
}
export class CashierDepositFail implements Action {
    readonly type = CASHIER_DEPOSIT_FAIL;
    constructor(public payload: Object) { }
}
export class CashierGetOpenWithDrawRequest implements Action {
    readonly type = CASHIER_OPEN_WITHDRAW_REQUEST;
    constructor() { }
}
export class CashierGetOpenWithDrawRequestSuccess implements Action {
    readonly type = CASHIER_OPEN_WITHDRAW_REQUEST_SUCCESS;
    constructor(public payload: WithDrawResponse) { }
}
export class CashierGetOpenWithDrawRequestFail implements Action {
    readonly type = CASHIER_OPEN_WITHDRAW_REQUEST_FAIL;
    constructor(public payload: Object) { }
}
export class CashierWithDrawRequest implements Action {
    readonly type = CASHIER_WITHDRAW_REQUEST;
    constructor(public payload: Object) { }
}
export class CashierWithDrawRequestSuccess implements Action {
    readonly type = CASHIER_WITHDRAW_REQUEST_SUCCESS;
    constructor(public payload: Object) { }
}
export class CashierWithDrawRequestFail implements Action {
    readonly type = CASHIER_WITHDRAW_REQUEST_FAIL;
    constructor(public payload: Object) { }
}
export class CashierCancelWithDrawRequest implements Action {
    readonly type = CASHIER_CANCEL_WITHDRAW_REQUEST;
    constructor(public payload: Object) { }
}
export class CashierCancelWithDrawRequestSuccess implements Action {
    readonly type = CASHIER_CANCEL_WITHDRAW_REQUEST_SUCCESS;
    constructor(public payload: Object) { }
}
export class CashierCancelWithDrawRequestFail implements Action {
    readonly type = CASHIER_CANCEL_WITHDRAW_REQUEST_FAIL;
    constructor(public payload: Object) { }
}
export class CashierTransactionHistory implements Action {
    readonly type = CASHIER_TRANSACTION_HISTORY;
    constructor(public payload: Object) { }
}
export class CashierTransactionHistorySuccess implements Action {
    readonly type = CASHIER_TRANSACTION_HISTORY_SUCCESS;
    constructor(public payload: TrasactionHistory) { }
}
export class CashierTransactionHistoryFail implements Action {
    readonly type = CASHIER_TRANSACTION_HISTORY_FAIL;
    constructor(public payload: Object) { }
}
export class CashierAddBankAccount implements Action {
    readonly type = CASHIER_ADD_BANK_ACCOUNT;
    constructor(public payload: Object) { }
}
export class CashierAddBankAccountSuccess implements Action {
    readonly type = CASHIER_ADD_BANK_ACCOUNT_SUCCESS;
    constructor(public payload: addBankAccountResponse) { }
}
export class CashierAddBankAccountFail implements Action {
    readonly type = CASHIER_ADD_BANK_ACCOUNT_FAIL;
    constructor(public payload: Object) { }
}
export class CashierGetBankAccount implements Action {
    readonly type = CASHIER_GET_BANK_ACCOUNT;
    constructor() { }
}
export class CashierGetBankAccountSuccess implements Action {
    readonly type = CASHIER_GET_BANK_ACCOUNT_SUCCESS;
    constructor(public payload: BankAccountInfo) { }
}
export class CashierGetBankAccountFail implements Action {
    readonly type = CASHIER_GET_BANK_ACCOUNT_FAIL;
    constructor(public payload: Object) { }
}
export class CashierDeleteBankAccount implements Action {
    readonly type = CASHIER_DELETE_BANK_ACCOUNT;
    constructor(public payload: Object) { }
}
export class CashierDeleteBankAccountSuccess implements Action {
    readonly type = CASHIER_DELETE_BANK_ACCOUNT_SUCCESS;
    constructor(public payload: Object) { }
}
export class CashierDeleteBankAccountFail implements Action {
    readonly type = CASHIER_DELETE_BANK_ACCOUNT_FAIL;
    constructor(public payload: Object) { }
}
export class CashierGetDepositSystems implements Action {
    readonly type = CASHIER_GET_DEPOSIT_SYSTEMS;
    constructor(public payload: Object) { }
}
export class CashierGetDepositSystemsSuccess implements Action {
    readonly type = CASHIER_GET_DEPOSIT_SYSTEMS_SUCCESS;
    constructor(public payload: DepositSystems) { }
}
export class CashierGetDepositSystemsFail implements Action {
    readonly type = CASHIER_GET_DEPOSIT_SYSTEMS_FAIL;
    constructor(public payload: Object) { }
}
export class CashierGetWithdrawSystems implements Action {
    readonly type = CASHIER_GET_WITHDRAW_SYSTEMS;
    constructor(public payload: Object) { }
}
export class CashierGetWithdrawSystemsSuccess implements Action {
    readonly type = CASHIER_GET_WITHDRAW_SYSTEMS_SUCCESS;
    constructor(public payload: Object) { }
}
export class CashierGetWithdrawSystemsFail implements Action {
    readonly type = CASHIER_GET_WITHDRAW_SYSTEMS_FAIL;
    constructor(public payload: Object) { }
}
export class CashierWithdrawCashout implements Action {
    readonly type = CASHIER_WITHDRAW_CASHOUT;
    constructor(public payload: Object) { }
}
export class CashierWithdrawCashoutSuccess implements Action {
    readonly type = CASHIER_WITHDRAW_CASHOUT_SUCCESS;
    constructor(public payload: Object) { }
}
export class CashierWithdrawCashoutFail implements Action {
    readonly type = CASHIER_WITHDRAW_CASHOUT_FAIL;
    constructor(public payload: Object) { }
}
export class ResetState implements Action {
    readonly type = RESET_STATE;
    constructor() { }
}

export type CashierActions = ResetState | PlayerSessionExpired | CashierGetBalanceStart | CashierGetBalanceSuccess | CashierGetBalanceFail |
    CashierResetPlayMoneyStart | CashierResetPlayMoneySuccess | CashierResetPlayMoneyFail |
    CashierGetPaymentSystemsStart | CashierGetPaymentSystemsSuccess | CashierGetPaymentSystemsFail |
    CashierDepositStart | CashierDepositSuccess | CashierDepositFail |
    CashierGetOpenWithDrawRequest | CashierGetOpenWithDrawRequestSuccess | CashierGetOpenWithDrawRequestFail |
    CashierWithDrawRequest | CashierWithDrawRequestSuccess | CashierWithDrawRequestFail |
    CashierCancelWithDrawRequest | CashierCancelWithDrawRequestSuccess | CashierCancelWithDrawRequestFail |
    CashierTransactionHistory | CashierTransactionHistorySuccess | CashierTransactionHistoryFail |
    CashierAddBankAccount | CashierAddBankAccountSuccess | CashierAddBankAccountFail |
    CashierGetBankAccount | CashierGetBankAccountSuccess | CashierGetBankAccountFail |
    CashierDeleteBankAccount | CashierDeleteBankAccountSuccess | CashierDeleteBankAccountFail |
    CashierGetDepositSystems | CashierGetDepositSystemsSuccess | CashierGetDepositSystemsFail |
    CashierGetWithdrawSystems | CashierGetWithdrawSystemsSuccess | CashierGetWithdrawSystemsFail | CashierWithdrawCashout |
    CashierWithdrawCashoutSuccess | CashierWithdrawCashoutFail;