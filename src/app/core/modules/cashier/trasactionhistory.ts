import { Common } from '../common';

export interface TrasactionHistory extends Common {
    success: boolean;
    values: Value[];
    deposits: Value[];
    cashouts: Value[];
    bonus: Value[];
}

export interface Guid {
    hi: number;
    lo: number;
}

export interface BonusAmount {
    value: number;
}

export interface CashAmount {
    value: number;
}

export interface Bonus {
    value: number;
}

export interface BonusInPlay {
    value: number;
}

export interface Cash {
    value: number;
}

export interface CashInPlay {
    value: number;
}

export interface TicketsAmount {
    value: number;
}

export interface TournamentMoney {
    value: number;
}

export interface Wallet {
    id: number;
    name: string;
}

export interface InitialBalance {
    bonus: Bonus;
    bonusInPlay: BonusInPlay;
    cash: Cash;
    cashInPlay: CashInPlay;
    preferred: boolean;
    ticketsAmount: TicketsAmount;
    tournamentMoney: TournamentMoney;
    wallet: Wallet;
}

export interface Initiator {
    id: number;
    name: string;
}

export interface OperationType {
    id: number;
    name: string;
}

export interface TicketAmount {
    value: number;
}

export interface TournamentMoneyAmount {
    value: number;
}

export interface deposits {
    value: number
}

export interface Value {
    createdOn: any;
    startDate: any;
    guid: Guid;
    bonusAmount: BonusAmount;
    cashAmount: CashAmount;
    details: any[];
    initialBalance: InitialBalance;
    initiator: Initiator;
    operationDate: string;
    operationType: OperationType;
    ticketAmount: TicketAmount;
    tournamentMoneyAmount: TournamentMoneyAmount;
    deposits: deposits;
}
