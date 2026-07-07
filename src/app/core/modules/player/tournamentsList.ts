import { Common } from '../common';
import { Guid, Value } from '../cashier/balance';

export interface TournamentsList extends Common {
    offset: number;
    limit: number;
    total: number;
    values: Values[];
}

export interface Values {
    guid: Guid;
    name: string;
    description: string;
    startDate: number;
    type: IdName;
    game: Game;
    buyIn: Value;
    fee: Value;
    knockoutFee: Value;
    status: IdName;
    playersCount: number;
}

export interface Game {
    guid: Guid;
    name: string;
    caption: string;
    wallet: IdName;
    pokerType: IdName;
}

export interface IdName {
    id: number;
    name: string;
}