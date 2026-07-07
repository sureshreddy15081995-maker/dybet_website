import { Common } from '../common';

export interface Countries extends Common {
    values: Country[],
}

export interface Country {
    id: string,
    shortCode: string,
    longCode: string,
    name: string,
}