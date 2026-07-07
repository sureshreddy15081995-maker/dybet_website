import { Action } from '@ngrx/store';
import { Profile } from '../../modules/player/profile';
// import { GameLaunchURLs } from '../../modules/player/gameLaunchURLs';
import { TournamentsList } from '../../modules/player/tournamentsList';
import { GameHistoryData } from '../../modules/gamehistory';
import { RemoteGamesHistory } from '../../modules/remotegamehistory/remotegamehistory';


export const PLAYER_GET_PROFILE = "[profile] PLAYER_GET_PROFILE";
export const PLAYER_GET_PROFILE_SUCCESS = "[profile] PLAYER_GET_PROFILE_SUCCESS";
export const PLAYER_GET_PROFILE_FAIL = "[profile] PLAYER_GET_PROFILE_FAIL";

export const PLAYER_UPDATE_PROFILE = "[profile] PLAYER_UPDATE_PROFILE";
export const PLAYER_UPDATE_PROFILE_SUCCESS = "[profile] PLAYER_UPDATE_PROFILE_SUCCESS";
export const PLAYER_UPDATE_PROFILE_FAIL = "[profile] PLAYER_UPDATE_PROFILE_FAIL";

export const PLAYER_UPDATE_PASSWORD = "[profile] PLAYER_UPDATE_PASSWORD";
export const PLAYER_UPDATE_PASSWORD_SUCCESS = "[profile] PLAYER_UPDATE_PASSWORD_SUCCESS";
export const PLAYER_UPDATE_PASSWORD_FAIL = "[profile] PLAYER_UPDATE_PASSWORD_FAIL";

export const PLAYER_GET_LAUNCHURLS = "[profile] PLAYER_GET_LAUNCURLS";
export const PLAYER_GET_LAUNCHURLS_SUCCESS = "[profile] PLAYER_GET_LAUNCURLS_SUCCESS";
export const PLAYER_GET_LAUNCHURLS_FAIL = "[profile] PLAYER_GET_LAUNCURLS_FAIL";

export const PLAYER_GET_GAME_HISTORY = "[profile] PLAYER_GET_GAME_HISTORY";
export const PLAYER_GET_GAME_HISTORY_SUCCESS = "[profile] PLAYER_GET_GAME_HISTORY_SUCCESS";
export const PLAYER_GET_GAME_HISTORY_FAIL = "[profile] PLAYER_GET_GAME_HISTORY_FAIL";

export const PLAYER_GET_TOURNAMENTS_LIST = "[profile] PLAYER_GET_TOURNAMENTS_LIST";
export const PLAYER_GET_TOURNAMENTS_LIST_SUCCESS = "[profile] PLAYER_GET_TOURNAMENTS_LIST_SUCCESS";
export const PLAYER_GET_TOURNAMENTS_LIST_FAIL = "[profile] PLAYER_GET_TOURNAMENTS_LIST_FAIL";

export const PLAYER_GET_STATS = "[profile] PLAYER_GET_STATS";
export const PLAYER_GET_STATS_SUCCESS = "[profile] PLAYER_GET_STATS_SUCCESS";
export const PLAYER_GET_STATS_FAIL = "[profile] PLAYER_GET_STATS_FAIL";

export const PLAYER_GET_PLAYERLEVELS = "[profile] PLAYER_GET_PLAYERLEVELS";
export const PLAYER_GET_PLAYERLEVELS_SUCCESS = "[profile] PLAYER_GET_PLAYERLEVELS_SUCCESS";
export const PLAYER_GET_PLAYERLEVELS_FAIL = "[profile] PLAYER_GET_PLAYERLEVELS_FAIL";

export const PLAYER_GET_LEADERBORAD_LIST = "[profile] PLAYER_GET_LEADERBORAD_LIST";
export const PLAYER_GET_LEADERBORAD_LIST_SUCCESS = "[profile] PLAYER_GET_LEADERBORAD_LIST_SUCCESS";
export const PLAYER_GET_LEADERBORAD_LIST_FAIL = "[profile] PLAYER_GET_LEADERBORAD_LIST_FAIL";

export const PLAYER_GET_LEADERBORAD_GET_PARTICIPANTS = "[profile] PLAYER_GET_LEADERBORAD_GET_PARTICIPANTS";
export const PLAYER_GET_LEADERBORAD_GET_PARTICIPANTS_SUCCESS = "[profile] PLAYER_GET_LEADERBORAD_GET_PARTICIPANTS_SUCCESS";
export const PLAYER_GET_LEADERBORAD_GET_PARTICIPANTS_FAIL = "[profile] PLAYER_GET_LEADERBORAD_GET_PARTICIPANTS_FAIL";

export const PLAYER_CONTACTUS_STATS = "[profile] PLAYER_GET_STATS";
export const PLAYER_CONTACTUS_STATS_SUCCESS = "[profile] PLAYER_GET_STATS_SUCCESS";
export const PLAYER_CONTACTUS_STATS_FAIL = "[profile] PLAYER_GET_STATS_FAIL"

export const PLAYER_GET_REMOTE_GAME_HISTORY = "[profile] PLAYER_GET_REMOTE_GAME_HISTORY";
export const PLAYER_GET_REMOTE_GAME_HISTORY_SUCCESS = "[profile] PLAYER_GET_REMOTE_GAME_HISTORY_SUCCESS";
export const PLAYER_GET_REMOTE_GAME_HISTORY_FAIL = "[profile] PLAYER_GET_REMOTE_GAME_HISTORY_FAIL";

export const RESET_STATE = "[profile] RESET_STATE";

export class ResetState implements Action {
    readonly type = RESET_STATE;
    constructor() { }
}
export class PlayerGetProfile implements Action {
    readonly type = PLAYER_GET_PROFILE;
    constructor() { }
}
export class PlayerGetProfileSuccess implements Action {
    readonly type = PLAYER_GET_PROFILE_SUCCESS;
    constructor(public payload: Profile) { }
}
export class PlayerGetProfileFail implements Action {
    readonly type = PLAYER_GET_PROFILE_FAIL;
    constructor(public payload: Object) { }
}
export class PlayerUpdateProfile implements Action {
    readonly type = PLAYER_UPDATE_PROFILE;
    constructor(public payload: Object) { }
}
export class PlayerUpdateProfileSuccess implements Action {
    readonly type = PLAYER_UPDATE_PROFILE_SUCCESS;
    constructor(public payload: Object) { }
}
export class PlayerUpdateProfileFail implements Action {
    readonly type = PLAYER_UPDATE_PROFILE_FAIL;
    constructor(public payload: Object) { }
}
export class PlayerUpdatePassword implements Action {
    readonly type = PLAYER_UPDATE_PASSWORD;
    constructor(public payload: Object) { }
}
export class PlayerUpdatePasswordSuccess implements Action {
    readonly type = PLAYER_UPDATE_PASSWORD_SUCCESS;
    constructor(public payload: Object) { }
}
export class PlayerUpdatePasswordFail implements Action {
    readonly type = PLAYER_UPDATE_PASSWORD_FAIL;
    constructor(public payload: Object) { }
}
export class PlayerGetLaunchURLs implements Action {
    readonly type = PLAYER_GET_LAUNCHURLS;
    constructor() { }
}
export class PlayerGetLaunchURLsFail implements Action {
    readonly type = PLAYER_GET_LAUNCHURLS_FAIL;
    constructor(public payload: Object) { }
}
export class PlayerGetGameHistory implements Action {
    readonly type = PLAYER_GET_GAME_HISTORY;
    constructor(public payload: Object) { }
}
export class PlayerGetGameHistorySuccess implements Action {
    readonly type = PLAYER_GET_GAME_HISTORY_SUCCESS;
    constructor(public payload: GameHistoryData) { }
}
export class PlayerGetGameHistoryFail implements Action {
    readonly type = PLAYER_GET_GAME_HISTORY_FAIL;
    constructor(public payload: Object) { }
}
export class PlayerGetTournamentsList implements Action {
    readonly type = PLAYER_GET_TOURNAMENTS_LIST;
    constructor(public payload: Object) { }
}
export class PlayerGetTournamentsListSuccess implements Action {
    readonly type = PLAYER_GET_TOURNAMENTS_LIST_SUCCESS;
    constructor(public payload: TournamentsList) { }
}
export class PlayerGetTournamentsListFail implements Action {
    readonly type = PLAYER_GET_TOURNAMENTS_LIST_FAIL;
    constructor(public payload: Object) { }
}
export class PlayerGetStats implements Action {
    readonly type = PLAYER_GET_STATS;
    constructor() { }
}
export class PlayerGetStatsSuccess implements Action {
    readonly type = PLAYER_GET_STATS_SUCCESS;
    constructor(public payload: Object) { }
}
export class PlayerGetStatsFail implements Action {
    readonly type = PLAYER_GET_STATS_FAIL;
    constructor(public payload: Object) { }
}
export class PlayerGetPlayerLevels implements Action {
    readonly type = PLAYER_GET_PLAYERLEVELS;
    constructor() { }
}
export class PlayerGetPlayerLevelsSuccess implements Action {
    readonly type = PLAYER_GET_PLAYERLEVELS_SUCCESS;
    constructor(public payload: Object) { }
}
export class PlayerGetPlayerLevelsFail implements Action {
    readonly type = PLAYER_GET_PLAYERLEVELS_FAIL;
    constructor(public payload: Object) { }
}
export class PlayerLeaderBoardList implements Action {
    readonly type = PLAYER_GET_LEADERBORAD_LIST;
    constructor() { }
}
export class PlayerLeaderBoardListSuccess implements Action {
    readonly type = PLAYER_GET_LEADERBORAD_LIST_SUCCESS;
    constructor(public payload: Object) { }
}
export class PlayerLeaderBoardListFail implements Action {
    readonly type = PLAYER_GET_LEADERBORAD_LIST_FAIL;
    constructor(public payload: Object) { }
}
export class PlayerLeaderBoardGetParticipants implements Action {
    readonly type = PLAYER_GET_LEADERBORAD_GET_PARTICIPANTS;
    constructor() { }
}
export class PlayerLeaderBoardGetParticipantsSuccess implements Action {
    readonly type = PLAYER_GET_LEADERBORAD_GET_PARTICIPANTS_SUCCESS;
    constructor(public payload: Object) { }
}
export class PlayerLeaderBoardGetParticipantsFail implements Action {
    readonly type = PLAYER_GET_LEADERBORAD_GET_PARTICIPANTS_FAIL;
    constructor(public payload: Object) { }
}
export class PlayerContactUsStart implements Action {
    readonly type = PLAYER_CONTACTUS_STATS;
    constructor() { }
}
export class PlayerContactUsSuccess implements Action {
    readonly type = PLAYER_CONTACTUS_STATS_SUCCESS;
    constructor(public payload: Object) { }
}
export class PlayerContactUsFail implements Action {
    readonly type = PLAYER_CONTACTUS_STATS_FAIL;
    constructor(public payload: Object) { }
}
export class PlayerGetRemoteGameHistory implements Action {
    readonly type = PLAYER_GET_REMOTE_GAME_HISTORY;
    constructor(public payload: Object) { }
}
export class PlayerGetRemoteGameHistorySuccess implements Action {
    readonly type = PLAYER_GET_REMOTE_GAME_HISTORY_SUCCESS;
    constructor(public payload: RemoteGamesHistory) { }
}
export class PlayerGetRemoteGameHistoryFail implements Action {
    readonly type = PLAYER_GET_REMOTE_GAME_HISTORY_FAIL;
    constructor(public payload: Object) { }
}

export type PlayerActions = ResetState | PlayerGetProfile | PlayerGetProfileSuccess | PlayerGetProfileFail |
    PlayerUpdateProfile | PlayerUpdateProfileSuccess | PlayerUpdateProfileFail |
    PlayerUpdatePassword | PlayerUpdatePasswordSuccess | PlayerUpdatePasswordFail |
    PlayerGetLaunchURLs | PlayerGetLaunchURLsFail |
    PlayerGetGameHistory | PlayerGetGameHistorySuccess | PlayerGetGameHistoryFail |
    PlayerGetTournamentsList | PlayerGetTournamentsListSuccess | PlayerGetTournamentsListFail |
    PlayerGetStats | PlayerGetStatsSuccess | PlayerGetStatsFail |
    PlayerGetPlayerLevels | PlayerGetPlayerLevelsSuccess | PlayerGetPlayerLevelsFail | PlayerLeaderBoardList |
    PlayerLeaderBoardListSuccess | PlayerLeaderBoardListFail |
    PlayerLeaderBoardGetParticipants | PlayerLeaderBoardGetParticipantsSuccess | PlayerLeaderBoardGetParticipantsFail
    | PlayerContactUsStart | PlayerContactUsSuccess | PlayerContactUsFail |
    PlayerGetRemoteGameHistory | PlayerGetRemoteGameHistorySuccess | PlayerGetRemoteGameHistoryFail;