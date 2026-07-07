export interface Profile {
    pixelURL: any;
    withdrawal: boolean;
    deposits: boolean;
    success: boolean;
    code?: string | null;
    description?: string | null;
    login: string;
    nickname: string;
    email: string;
    firstName: string;
    lastName: string;
    birthday?: string | null;
    address: Address;
    mobileVerified: number;
}


export interface Address {
    address?: string | null;
    city: string;
    state?: string | null;
    zipCode?: string | null;
    country: string;
    phone: string;
}
