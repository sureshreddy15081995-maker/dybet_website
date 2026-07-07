import { Common } from '../common';

export interface RemoteGamesHistory extends Common {
    total: number;
    values: Value[];
}

export interface Value {
    bet: string;
    buyIn: string;
    closingBalance: string;
    from: string;
    initialBalance: string;
    name: string;
    payouts: string;
    to: string;
    win: string;
    active: string;
}
