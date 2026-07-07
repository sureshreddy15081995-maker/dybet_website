import { Common } from '../common';

export interface DepositSystems extends Common {
    depositSystems: DepositSystemsClass;
}

export interface DepositSystemsClass {
    gateWays: { [key: string]: string };
    limits: Limit[];
    name: string;
    params: Param[];
    selector: string;
    currency: string;
    additional: TelecomProvider[];
}

export interface Limit {
    amountLimit: number;
    currency: Currency;
    depositCount: number;
    max: number;
    min: number;
    period: number;
}

export interface Currency {
    code: string;
    name: string;
    selected: boolean;
    symbol: string;
}

export interface Param {
    name: string;
    required: boolean;
    title: string;
}

export interface TelecomProvider {
    method: string;
    description: string;
    fee: string;
    processTime: string;
    min: string;
    max: string;
}
