import { Common } from '../common';

export interface PaymentSystems extends Common {
    paymentSystemList: PaymentSystemList[];
}

export interface PaymentSystemList {
    name: string;
    typeName: string;
    currency: string;
    minSingleDepositAmount: number;
    maxSingleDepositAmount: number;
    depositsNumberLimit: number;
    depositsAmountLimit: number;
    limitPeriod: number;
}