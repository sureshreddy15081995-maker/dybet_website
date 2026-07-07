import { Common } from '../common';

export interface Balance extends Common {
    values: WalletInfo[];
}

export interface WalletInfo {
    lockedBonus: any;
    wallet: Wallet;
    cash: Value;
    cashInPlay: Value;
    bonus: Value;
    bonusInPlay: Value;
    tournamentMoney: Value;
    ticketsAmount: Value;
    tickets: Ticket[];
    preferred: boolean;
    symbol: string;
}

export interface Wallet {
    id: string;
    name: string;
}

export interface Value {
    value: number;
}

export interface Ticket {
    guid: Guid;
    cost: Value;
    walletType: Wallet;
    creationDate: number;
    utilizationDate?: null;
    tournamentGoupName: string;
    status: Status;
}

export interface Guid {
    hi: number;
    lo: number;
}

export interface Status {
    id: number;
    name: string;
}