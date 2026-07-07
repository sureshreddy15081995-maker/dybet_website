import * as playerActions from './playerActions';
import { Profile } from '../../modules/player/profile';
import { TournamentsList } from '../../modules/player/tournamentsList';
import { Stats } from '../../modules/player/stats';
import { HttpClientError } from '../../modules/login/httpClientError';
import { GameHistoryData } from '../../modules/gamehistory';
import { RemoteGamesHistory } from '../../modules/remotegamehistory/remotegamehistory';
import { PlayerLevel } from '../../modules/player/playerLevel';
import { Action } from '@ngrx/store';

export interface ProfileState {
        profile: Profile | null;
        profileUpdateResponse: object | null;
        profileUpdateFail: HttpClientError | null;
        tournamentList: TournamentsList | null;
        stats: Stats | null;
        playerLevel: PlayerLevel | null;
        playerLevelFail: HttpClientError | null;
        GameHistoryData: GameHistoryData | null;
        GameHistoryError: HttpClientError | null;
        remotegameshistory: RemoteGamesHistory | null;
        remotegameshistoryError: HttpClientError | null;
}

const initialState: ProfileState = {
        profile: null,
        profileUpdateResponse: null,
        profileUpdateFail: null,
        tournamentList: null,
        stats: null,
        playerLevel: null,
        playerLevelFail: null,
        GameHistoryData: null,
        GameHistoryError: null,
        remotegameshistory: null,
        remotegameshistoryError: null
};

export function playerReducer(
        state: ProfileState = initialState,
        action: Action & { payload?: any }
): ProfileState {
        switch (action.type) {

                case playerActions.RESET_STATE:
                        return { ...initialState };

                // PROFILE
                case playerActions.PLAYER_GET_PROFILE:
                        return { ...state, profile: null };

                case playerActions.PLAYER_GET_PROFILE_SUCCESS:
                        return { ...state, profile: action.payload as Profile };

                case playerActions.PLAYER_GET_PROFILE_FAIL:
                        return { ...state, profile: null };

                // TOURNAMENTS
                case playerActions.PLAYER_GET_TOURNAMENTS_LIST:
                        return { ...state, tournamentList: null };

                case playerActions.PLAYER_GET_TOURNAMENTS_LIST_SUCCESS:
                        return { ...state, tournamentList: action.payload as TournamentsList };

                case playerActions.PLAYER_GET_TOURNAMENTS_LIST_FAIL:
                        return { ...state, tournamentList: null };

                // STATS
                case playerActions.PLAYER_GET_STATS:
                        return { ...state, stats: null };

                case playerActions.PLAYER_GET_STATS_SUCCESS:
                        return { ...state, stats: action.payload as Stats };

                case playerActions.PLAYER_GET_STATS_FAIL:
                        return { ...state, stats: null };

                // PLAYER LEVEL
                case playerActions.PLAYER_GET_PLAYERLEVELS:
                        return { ...state, playerLevel: null, playerLevelFail: null };

                case playerActions.PLAYER_GET_PLAYERLEVELS_SUCCESS:
                        return { ...state, playerLevel: action.payload as PlayerLevel, playerLevelFail: null };

                case playerActions.PLAYER_GET_PLAYERLEVELS_FAIL:
                        return { ...state, playerLevel: null, playerLevelFail: action.payload as HttpClientError };

                // PROFILE UPDATE
                case playerActions.PLAYER_UPDATE_PROFILE:
                        return { ...state, profileUpdateResponse: null, profileUpdateFail: null };

                case playerActions.PLAYER_UPDATE_PROFILE_SUCCESS:
                case playerActions.PLAYER_UPDATE_PASSWORD_SUCCESS:
                        return { ...state, profileUpdateResponse: action.payload, profileUpdateFail: null };

                case playerActions.PLAYER_UPDATE_PROFILE_FAIL:
                case playerActions.PLAYER_UPDATE_PASSWORD_FAIL:
                        return { ...state, profileUpdateResponse: null, profileUpdateFail: action.payload as HttpClientError };

                // GAME HISTORY
                case playerActions.PLAYER_GET_GAME_HISTORY:
                        return { ...state, GameHistoryData: null, GameHistoryError: null };

                case playerActions.PLAYER_GET_GAME_HISTORY_SUCCESS:
                        return { ...state, GameHistoryData: action.payload as GameHistoryData, GameHistoryError: null };

                case playerActions.PLAYER_GET_GAME_HISTORY_FAIL:
                        return { ...state, GameHistoryData: null, GameHistoryError: action.payload as HttpClientError };

                // REMOTE GAME HISTORY
                case playerActions.PLAYER_GET_REMOTE_GAME_HISTORY:
                        return { ...state, remotegameshistory: null, remotegameshistoryError: null };

                case playerActions.PLAYER_GET_REMOTE_GAME_HISTORY_SUCCESS:
                        return { ...state, remotegameshistory: action.payload as RemoteGamesHistory, remotegameshistoryError: null };

                case playerActions.PLAYER_GET_REMOTE_GAME_HISTORY_FAIL:
                        return { ...state, remotegameshistory: null, remotegameshistoryError: action.payload as HttpClientError };

                default:
                        return state;
        }
}
