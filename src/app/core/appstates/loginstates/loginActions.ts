import { Action } from '@ngrx/store';
import { Login } from '../../modules/login/login';


export const RESET_STATE = "[login] RESET_STATE";
export const PLAYER_LOGGEDIN = "[login] PLAYER_LOGGEDIN";

export const LOGIN_START = "[login] LOGIN_START";
export const LOGIN_SUCCESS = "[login] LOGIN_SUCCESS";
export const LOGIN_FAIL = "[login] LOGIN_FAIL";

export const LOGOUT_START = "[login] LOGOUT_START";
export const LOGOUT_SUCCESS = "[login] LOGOUT_SUCCESS";
export const LOGOUT_FAIL = "[login] LOGOUT_FAIL";

export const FORGOTPASSWORD_START = "[login] FORGOTPASSWORD_START";
export const FORGOTPASSWORD_SUCCESS = "[login] FORGOTPASSWORD_SUCCESS";
export const FORGOTPASSWORD_FAIL = "[login] FORGOTPASSWORD_FAIL";

export const REGISTER_START = "[login] REGISTER_START";
export const REGISTER_SUCCESS = "[login] REGISTER_SUCCESS";
export const REGISTER_FAIL = "[login] REGISTER_FAIL";

export const REGISTER_GET_COUNTRY = "[login] REGISTER_GET_COUNTRY";
export const REGISTER_GET_COUNTRY_SUCCESS = "[login] REGISTER_GET_COUNTRY_SUCCESS";
export const REGISTER_GET_COUNTRY_FAIL = "[login] REGISTER_GET_COUNTRY_FAIL";

export class ResetState implements Action {
    readonly type = RESET_STATE;
    constructor() { }
}
export class PlayerLoggedIn implements Action {
    readonly type = PLAYER_LOGGEDIN;
    constructor(public payload: { loggedIn: boolean }) { }
}
export class LoginStart implements Action {
    readonly type = LOGIN_START;
    constructor(public payload: Object) { }
}
export class LoginSuccess implements Action {
    readonly type = LOGIN_SUCCESS;
    constructor(public payload: Login) { }
}
export class LoginFail implements Action {
    readonly type = LOGIN_FAIL;
    constructor(public payload: Object) { }
}
export class LogoutStart implements Action {
    readonly type = LOGOUT_START;
    constructor() { }
}
export class LogoutSuccess implements Action {
    readonly type = LOGOUT_SUCCESS;
    constructor(public payload: Object) { }
}
export class LogoutFail implements Action {
    readonly type = LOGOUT_FAIL;
    constructor(public payload: Object) { }
}
export class ForgotPasswordStart implements Action {
    readonly type = FORGOTPASSWORD_START;
    constructor(public payload: Object) { }
}
export class ForgotPasswordSuccess implements Action {
    readonly type = FORGOTPASSWORD_SUCCESS;
    constructor(public payload: Object) { }
}
export class ForgotPasswordFail implements Action {
    readonly type = FORGOTPASSWORD_FAIL;
    constructor(public payload: Object) { }
}
export class RegisterStart implements Action {
    readonly type = REGISTER_START;
    constructor(public payload: Object) { }
}
export class RegisterSuccess implements Action {
    readonly type = REGISTER_SUCCESS;
    constructor(public payload: Login) { }
}
export class RegisterFail implements Action {
    readonly type = REGISTER_FAIL;
    constructor(public payload: Object) { }
}

export type LoginActions = ResetState | PlayerLoggedIn |
    LoginStart | LoginSuccess | LoginFail |
    LogoutStart | LogoutSuccess | LogoutFail |
    RegisterStart | RegisterSuccess | RegisterFail |
    ForgotPasswordStart | ForgotPasswordSuccess | ForgotPasswordFail;