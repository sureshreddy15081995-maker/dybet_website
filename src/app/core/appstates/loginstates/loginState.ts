import * as loginActions from './loginActions';
import { Countries } from '../../modules/login/countries';
import { Login } from '../../modules/login/login';
import { ForgotPassword } from '../../modules/login/forgotpassword';
import { HttpClientError } from '../../modules/login/httpClientError';
import { PlayerLoggedIn } from '../../modules/login/playerLoggedIn';

export interface LoginState {
    countries: Countries | null;
    loginResponse: Login | null;
    loginErrorResponse: HttpClientError | null;
    forgotPasswordResponse: ForgotPassword | null;
    forgotPasswordErrorResponse: HttpClientError | null;
    playerLoggedIn: PlayerLoggedIn | null;
    generatedCaptcha: Blob | null;
    generatedCaptchaError: HttpClientError | null;
    allgamesError: HttpClientError | null;
    allGamesLunchError: HttpClientError | null;
    error: string | null;
    lastAction: string;
    loading: boolean;
}

const initialState: LoginState = {
    loginResponse: null,
    countries: null,
    loginErrorResponse: null,
    forgotPasswordResponse: null,
    forgotPasswordErrorResponse: null,
    playerLoggedIn: {
        loggedIn: false
    },
    generatedCaptcha: null,
    generatedCaptchaError: null,
    allgamesError: null,
    allGamesLunchError: null,
    error: null,
    lastAction: "",
    loading: false
}

export function loginReducer(state: LoginState = initialState, action: loginActions.LoginActions) {
    switch (action.type) {
        case loginActions.RESET_STATE:
            return {
                ...state,
                loginResponse: null,
                countries: null,
                loginErrorResponse: null,
                forgotPasswordResponse: null,
                forgotPasswordErrorResponse: null,
                playerLoggedIn: null,
                generatedCaptcha: null,
                generatedCaptchaError: null,
                allgamesError: null,
                allGamesLunchError: null,
                loading: false,
                lastAction: "RESET_STATE"
            }
        case loginActions.PLAYER_LOGGEDIN:
            return {
                ...state,
                playerLoggedIn: { ...state.playerLoggedIn, ...action.payload },
                lastAction: "PLAYER_LOGGEDIN"
            }
        case loginActions.LOGIN_START:
            return {
                ...state,
                loginResponse: null,
                loginErrorResponse: null,
                forgotPasswordResponse: null,
                loading: true,
                lastAction: "LOGIN_START"
            }
        case loginActions.REGISTER_START:
            return {
                ...state,
                loginResponse: null,
                loginErrorResponse: null,
                forgotPasswordResponse: null,
                loading: true,
                lastAction: "REGISTER_START"
            }
        case loginActions.LOGIN_SUCCESS:
            return {
                ...state,
                loginResponse: { ...state.loginResponse, ...action.payload },
                loginErrorResponse: null,
                loading: false,
                lastAction: "LOGIN_SUCCESS"
            }
        case loginActions.REGISTER_SUCCESS:
            return {
                ...state,
                loginResponse: { ...state.loginResponse, ...action.payload },
                loginErrorResponse: null,
                loading: false,
                lastAction: "REGISTER_SUCCESS"
            }
        case loginActions.LOGIN_FAIL:
            return {
                ...state,
                loginResponse: null,
                loginErrorResponse: { ...state.loginErrorResponse, ...action.payload },
                loading: false,
                lastAction: "LOGIN_FAIL"
            }
        case loginActions.REGISTER_FAIL:
            return {
                ...state,
                loginResponse: null,
                loginErrorResponse: { ...state.loginErrorResponse, ...action.payload },
                loading: false,
                lastAction: "REGISTER_FAIL"
            }
        case loginActions.FORGOTPASSWORD_START:
            return {
                ...state,
                forgotPasswordResponse: null,
                forgotPasswordErrorResponse: null,
                loading: true,
                lastAction: "FORGOTPASSWORD_START"
            }
        case loginActions.FORGOTPASSWORD_SUCCESS:
            return {
                ...state,
                forgotPasswordResponse: { ...state.forgotPasswordResponse, ...action.payload },
                forgotPasswordErrorResponse: null,
                loading: false,
                lastAction: "FORGOTPASSWORD_SUCCESS"
            }
        case loginActions.FORGOTPASSWORD_FAIL:
            return {
                ...state,
                forgotPasswordResponse: null,
                forgotPasswordErrorResponse: { ...state.forgotPasswordErrorResponse, ...action.payload },
                loading: false,
                lastAction: "FORGOTPASSWORD_FAIL"
            }
        default:
            return state;
    }
}