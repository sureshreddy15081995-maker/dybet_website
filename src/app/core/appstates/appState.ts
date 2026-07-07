import { Action, ActionReducerMap } from '@ngrx/store';
import * as loginState from './loginstates/loginState';
import * as playerState from './playerstates/playerState';
import * as cashierState from './cashierstates/cashierState';

export interface AppState {
    loginState: loginState.LoginState;
    playerState: playerState.ProfileState;
    cashierState: cashierState.CashierState;
}

export const AppReducer: ActionReducerMap<AppState> = {
    loginState: loginState.loginReducer as (state: loginState.LoginState | undefined, action: Action) => loginState.LoginState,
    playerState: playerState.playerReducer as (state: playerState.ProfileState | undefined, action: Action) => playerState.ProfileState,
    cashierState: cashierState.cashierReducer as (state: cashierState.CashierState | undefined, action: Action) => cashierState.CashierState,
};
