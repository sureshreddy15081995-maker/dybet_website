import { Common } from '../common';

export interface WithDrawResponse extends Common {
    withdrawsResponses: WithDrawsResponses[];
}

export interface WithDrawsResponses extends Common {
    status: string;
    amount: string;
    currency: string;
    creationDate: number;
    refTxnID: string;
    displayRefTxnID: string;
}