import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { exhaustMap, map, catchError, tap } from 'rxjs/operators';

import * as playerActions from './playerActions';
import { PlayerService } from '../../services/player/player.service';
import { LoginService } from '../../services/login/login.service';
import { CashierService } from '../../services/cashier/cashier.service';
import { Profile } from '../../modules/player/profile';
import { Stats } from '../../modules/player/stats';
import { PlayerLevel } from '../../modules/player/playerLevel';
import { RemoteGamesHistory } from '../../modules/remotegamehistory/remotegamehistory';

// Centralized error handler
const handleError = (error: any, ActionClass: any) => {
    let message = 'Something went wrong, please contact admin';
    if (error.error instanceof Error) {
        message = error.error.message;
    } else if (error.error?.message) {
        message = error.error.message;
    } else if (error.message) {
        message = error.message;
    }
    return of(new ActionClass({ message }));
};

@Injectable()
export class PlayerEffects {
    private actions$ = inject(Actions);
    private playerService = inject(PlayerService);
    private loginService = inject(LoginService);
    private cashierService = inject(CashierService);

    // ================= PROFILE =================
    playerGetProfile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(playerActions.PLAYER_GET_PROFILE),
            exhaustMap(() =>
                this.playerService.onPlayerGetProfile().pipe(
                    map((response: Profile) => new playerActions.PlayerGetProfileSuccess(response)),
                    catchError((error: HttpErrorResponse) =>
                        handleError(error, playerActions.PlayerGetProfileFail)
                    )
                )
            )
        )
    );

    playerGetProfileSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(playerActions.PLAYER_GET_PROFILE_SUCCESS),
                tap((action: playerActions.PlayerGetProfileSuccess) => {
                    if (action.payload?.code === 'SESSION_EXPIRED') {
                        this.cashierService.sessionExpire(true);
                        this.loginService.onPlayerLoggedIn(false);
                    } else {
                        this.cashierService.sessionExpire(false);
                        this.loginService.onPlayerLoggedIn(true);
                    }

                    // if (action.payload?.success) {
                    //     sessionStorage.setItem('profile', JSON.stringify(action.payload));
                    // }
                })
            ),
        { dispatch: false }
    );


    playerUpdateProfile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(playerActions.PLAYER_UPDATE_PROFILE),
            exhaustMap((action: playerActions.PlayerUpdateProfile) =>
                this.playerService.onPlayerUpdateProfile(action.payload).pipe(
                    map((response: Profile) => new playerActions.PlayerUpdateProfileSuccess(response)),
                    catchError((error: HttpErrorResponse) =>
                        handleError(error, playerActions.PlayerUpdateProfileFail)
                    )
                )
            )
        )
    );

    playerUpdatePassword$ = createEffect(() =>
        this.actions$.pipe(
            ofType(playerActions.PLAYER_UPDATE_PASSWORD),
            exhaustMap((action: playerActions.PlayerUpdatePassword) =>
                this.playerService.onPlayerUpdatePassword(action.payload).pipe(
                    map((response: Profile) => new playerActions.PlayerUpdatePasswordSuccess(response)),
                    catchError((error: HttpErrorResponse) =>
                        handleError(error, playerActions.PlayerUpdatePasswordFail)
                    )
                )
            )
        )
    );

    // ================= STATS =================
    playerGetStats$ = createEffect(() =>
        this.actions$.pipe(
            ofType(playerActions.PLAYER_GET_STATS),
            exhaustMap(() =>
                this.playerService.onPlayerGetStats().pipe(
                    map((response: Stats) => new playerActions.PlayerGetStatsSuccess(response)),
                    catchError((error: HttpErrorResponse) =>
                        handleError(error, playerActions.PLAYER_GET_STATS_FAIL)
                    )
                )
            )
        )
    );

    // ================= PLAYER LEVEL =================
    playerGetPlayerLevels$ = createEffect(() =>
        this.actions$.pipe(
            ofType(playerActions.PLAYER_GET_PLAYERLEVELS),
            exhaustMap(() =>
                this.playerService.onPlayerGetPlayerLevels().pipe(
                    map((response: PlayerLevel) => new playerActions.PlayerGetPlayerLevelsSuccess(response)),
                    catchError((error: HttpErrorResponse) =>
                        handleError(error, playerActions.PlayerGetPlayerLevelsFail)
                    )
                )
            )
        )
    );

    // ================= REMOTE GAME HISTORY =================
    playerGetRemoteGameHistory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(playerActions.PLAYER_GET_REMOTE_GAME_HISTORY),
            exhaustMap((action: playerActions.PlayerGetRemoteGameHistory) =>
                this.playerService.onPlayerGetRemoteGameHistory(action.payload).pipe(
                    map((response: RemoteGamesHistory) => new playerActions.PlayerGetRemoteGameHistorySuccess(response)),
                    catchError((error: HttpErrorResponse) =>
                        handleError(error, playerActions.PlayerGetRemoteGameHistoryFail)
                    )
                )
            )
        )
    );
}
