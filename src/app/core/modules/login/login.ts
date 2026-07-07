import { Common } from '../common';

export interface Login extends Common {
    loginResponse: LoginResponse;
    sessionId?: string;
    gameClientLaunchResponse?: ClientLaunchResponse;
}

export interface LoginResponse extends Common {
    affiliatePostBackURL: any;
    sessionId: string;
    gameClientLaunchResponse: ClientLaunchResponse;
}

export interface ClientLaunchResponse extends Common {
    connections: Connections[];
    dateResponse: DateResponse;
}

export interface Connections {
    uri: string;
    host: string;
    port: number;
}

export interface DateResponse {
    txt: string;
    gmt: string;
    local: string;
    est: string;
}
