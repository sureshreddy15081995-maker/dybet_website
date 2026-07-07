import { Common } from '../common';

export interface BankAccountInfo extends Common {
    offset?: null;
    limit?: null;
    total?: null;
    bankAccountInfos: BankAccount[];
    activeBankCount: number;
}

export interface BankAccount {
    bankEncodedID: string;
    bankName: string;
    bankBranchName: string;
    nameOnBank: string;
    bankIFSCCOde: string;
    bankingType: string;
    bankAccountNumber: string;
    status: string;
}