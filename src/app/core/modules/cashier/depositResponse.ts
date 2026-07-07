import { Common } from '../common';

export interface DepositResponse extends Common {
    result: Result;
}

export interface Result {
    externalLink: boolean;
    form: Form;
    redirectUrl: string;
    transactionId: string;
}

export interface Form {
    method: string;
    params: Params;
    url: string;
}

export interface Params {
    callback_url: string;
    image: null;
    "prefill[contact]": string;
    key_id: string;
    "prefill[email]": string;
    name: string;
    description: string;
    order_id: string;
    "notes[shipping address]": null;
    cancel_url: string;
    "prefill[name]": null;
}