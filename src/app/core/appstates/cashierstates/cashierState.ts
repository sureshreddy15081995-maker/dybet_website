import * as cashierActions from './cashierActions';
import { Balance } from '../../modules/cashier/balance';
import { PaymentSystems } from '../../modules/cashier/paymentSystems';
import { DepositResponse } from '../../modules/cashier/depositResponse';
import { HttpClientError } from '../../modules/login/httpClientError';
import { WithDrawResponse } from '../../modules/cashier/withdrawResponse';
import { BankAccountInfo } from '../../modules/cashier/bankAccountInfo';
import { DepositSystems } from '../../modules/cashier/depositSystems';
import { WithdrawSystems } from '../../modules/cashier/withDraw';
import { TrasactionHistory } from '../../modules/cashier/trasactionhistory';
import { addBankAccountResponse } from '../../modules/cashier/addbankaccount';
import { sessionExpire } from '../../modules/login/sessionExpire';

export interface CashierState {
    balance: Balance | null;
    sessionexpire: sessionExpire | null;
    paymentSystems: PaymentSystems | null;
    depositResponse: DepositResponse | null;
    depositFail: HttpClientError | null;
    withDrawResponse: WithDrawResponse | null;
    bankAccountInfo: BankAccountInfo | null;
    bankAccountInfoError: HttpClientError | null;
    withDrawRequestResponse: object | null;
    withDrawRequestResponseFail: HttpClientError | null;
    depositeSystem: DepositSystems | null;
    depositeSystemResponseFail: HttpClientError | null;
    withDrawSystem: WithdrawSystems | null;
    withDrawSystemResponseFail: HttpClientError | null;
    TrasactionHistory: TrasactionHistory | null;
    TrasactionHistoryerror: HttpClientError | null;
    addBankAccountResponse: addBankAccountResponse | null;
    addBankAccountError: HttpClientError | null
}

const initialState: CashierState = {
    balance: null,
    sessionexpire: null,
    paymentSystems: null,
    depositResponse: null,
    depositFail: null,
    withDrawResponse: null,
    bankAccountInfo: null,
    bankAccountInfoError: null,
    withDrawRequestResponse: null,
    withDrawRequestResponseFail: null,
    depositeSystem: null,
    depositeSystemResponseFail: null,
    withDrawSystem: null,
    withDrawSystemResponseFail: null,
    TrasactionHistory: null,
    TrasactionHistoryerror: null,
    addBankAccountResponse: null,
    addBankAccountError: null
}

export function cashierReducer(state: CashierState = initialState, action: cashierActions.CashierActions) {
    switch (action.type) {
        case cashierActions.RESET_STATE:
            return {
                ...state,
                balance: null,
                sessionexpire: null,
                paymentSystems: null,
                depositResponse: null,
                depositFail: null,
                withDrawResponse: null,
                bankAccountInfo: null,
                bankAccountInfoError: null,
                withDrawRequestResponse: null,
                withDrawRequestResponseFail: null,
                depositeSystem: null,
                depositeSystemResponseFail: null,
                withDrawSystem: null,
                withDrawSystemResponseFail: null,
                TrasactionHistory: null,
                TrasactionHistoryerror: null,
                addBankAccountResponse: null,
                addBankAccountError: null
            };
        case cashierActions.CASHIER_GET_BALANCE:
            return {
                ...state,
                balance: null
            }
        case cashierActions.CASHIER_GET_BALANCE_SUCCESS:
            return {
                ...state,
                balance: action.payload
            }
        case cashierActions.CASHIER_GET_BALANCE_FAIL:
            return {
                ...state,
                balance: null
            }
        case cashierActions.CASHIER_GET_PAYMENTS_SYSTEMS:
            return {
                ...state,
                paymentSystems: null
            }
        case cashierActions.CASHIER_GET_PAYMENTS_SYSTEMS_SUCCESS:
            return {
                ...state,
                paymentSystems: { ...state, ...action.payload }
            }
        case cashierActions.CASHIER_GET_PAYMENTS_SYSTEMS_FAIL:
            return {
                ...state,
                paymentSystems: null
            }
        case cashierActions.PLAYER_SESSION:
            return {
                ...state,
                sessionexpire: action.payload
            }
        case cashierActions.CASHIER_OPEN_WITHDRAW_REQUEST:
            return {
                ...state,
                withDrawResponse: null
            }
        case cashierActions.CASHIER_OPEN_WITHDRAW_REQUEST_SUCCESS:
            return {
                ...state,
                withDrawResponse: { ...state.withDrawResponse, ...action.payload }
            }
        case cashierActions.CASHIER_OPEN_WITHDRAW_REQUEST_FAIL:
            return {
                ...state,
                withDrawResponse: null
            }
        case cashierActions.CASHIER_WITHDRAW_REQUEST:
            return {
                ...state,
                withDrawRequestResponse: null,
                withDrawRequestResponseFail: null
            }
        case cashierActions.CASHIER_WITHDRAW_REQUEST_SUCCESS:
            return {
                ...state,
                withDrawRequestResponse: { ...state.withDrawRequestResponse, ...action.payload },
                withDrawRequestResponseFail: null
            }
        case cashierActions.CASHIER_WITHDRAW_REQUEST_FAIL:
            return {
                ...state,
                withDrawRequestResponse: null,
                withDrawRequestResponseFail: { ...state.withDrawRequestResponseFail, ...action.payload }
            }
        case cashierActions.CASHIER_DEPOSIT:
            return {
                ...state,
                depositResponse: null,
                depositFail: null
            }
        case cashierActions.CASHIER_DEPOSIT_SUCCESS:
            return {
                ...state,
                depositResponse: { ...state.depositResponse, ...action.payload },
                depositFail: null
            }
        case cashierActions.CASHIER_DEPOSIT_FAIL:
            return {
                ...state,
                depositResponse: null,
                depositFail: { ...state.depositFail, ...action.payload }
            }
        case cashierActions.CASHIER_GET_BANK_ACCOUNT:
            return {
                ...state,
                bankAccountInfo: null,
                bankAccountInfoError: null

            }
        case cashierActions.CASHIER_GET_BANK_ACCOUNT_SUCCESS:
            return {
                ...state,
                bankAccountInfo: { ...state.bankAccountInfo, ...action.payload },
                bankAccountInfoError: null
            }
        case cashierActions.CASHIER_GET_BANK_ACCOUNT_FAIL:
            return {
                ...state,
                bankAccountInfo: null,
                bankAccountInfoError: { ...state.bankAccountInfoError, ...action.payload }
            }
        case cashierActions.CASHIER_GET_DEPOSIT_SYSTEMS:
            return {
                ...state,
                depositeSystem: null,
                depositeSystemResponseFail: null,
                depositResponse: null
            }
        case cashierActions.CASHIER_GET_DEPOSIT_SYSTEMS_SUCCESS:
            return {
                ...state,
                depositeSystem: { ...state.depositeSystem, ...action.payload },
                depositeSystemResponseFail: null
            }
        case cashierActions.CASHIER_GET_DEPOSIT_SYSTEMS_FAIL:
            return {
                ...state,
                depositeSystem: null,
                depositeSystemResponseFail: { ...state.depositeSystemResponseFail, ...action.payload }
            }
        case cashierActions.CASHIER_GET_WITHDRAW_SYSTEMS:
            return {
                ...state,
                withDrawSystem: null,
                withDrawSystemResponseFail: null
            }
        case cashierActions.CASHIER_GET_WITHDRAW_SYSTEMS_SUCCESS:
            return {
                ...state,
                withDrawSystem: { ...state.withDrawSystem, ...action.payload },
                withDrawSystemResponseFail: null
            }
        case cashierActions.CASHIER_GET_WITHDRAW_SYSTEMS_FAIL:
            return {
                ...state,
                withDrawSystem: null,
                withDrawSystemResponseFail: { ...state.withDrawSystemResponseFail, ...action.payload }
            }
        case cashierActions.CASHIER_TRANSACTION_HISTORY:
            return {
                ...state,
                TrasactionHistory: null,
                TrasactionHistoryerror: null
            }
        case cashierActions.CASHIER_TRANSACTION_HISTORY_SUCCESS:
            return {
                ...state,
                TrasactionHistory: { ...state.TrasactionHistory, ...action.payload },
                TrasactionHistoryerror: null
            }
        case cashierActions.CASHIER_TRANSACTION_HISTORY_FAIL:
            return {
                ...state,
                TrasactionHistory: null,
                TrasactionHistoryerror: { ...state.TrasactionHistoryerror, ...action.payload }
            }
        case cashierActions.CASHIER_ADD_BANK_ACCOUNT:
            return {
                ...state,
                addBankAccountResponse: null,
                addBankAccountError: null
            }
        case cashierActions.CASHIER_ADD_BANK_ACCOUNT_SUCCESS:
            return {
                ...state,
                addBankAccountResponse: { ...state.addBankAccountResponse, ...action.payload },
                addBankAccountError: null
            }
        case cashierActions.CASHIER_ADD_BANK_ACCOUNT_FAIL:
            return {
                ...state,
                addBankAccountResponse: null,
                addBankAccountError: { ...state.addBankAccountError, ...action.payload }
            }
        default:
            return state;
    }
}