import { Common } from './common';

export interface GameHistoryData extends Common {
    success: boolean;
    values: Value[];
}

export interface Value {
    guid: Guid;
    buyIn: BuyIn;
    closingBalance: ClosingBalance;
    endDate: string;
    initialBalance: InitialBalance;
    payout: Payout;
    startDate: string;
    bet: Bet;
    game: Game;
    rounds: number;
    tableName: string;
    win: Win;
}

export interface Guid {
    hi: number;
    lo: number;
}

export interface BuyIn {
    value: number;
}

export interface ClosingBalance {
    value: number;
}

export interface InitialBalance {
    value: number;
}

export interface Payout {
    value: number;
}

export interface Bet {
    value: number;
}

export interface Guid2 {
    hi: number;
    lo: number;
}

export interface PokerType {
    id: number;
    name: string;
}

export interface Type {
    id: number;
    name: string;
}

export interface Wallet {
    id: number;
    name: string;
}

export interface Game {
    guid: Guid2;
    caption: string;
    name: string;
    pokerType: PokerType;
    type: Type;
    wallet: Wallet;
}

export interface Win {
    value: number;
}
