export interface BonusConfigReference {
    bonus: Bonus;
    limits: Limits;
}

export interface Bonus {
    selections: Selections;
    bonusType: string;
}

export interface Selections {
    conditions: Conditions;
    structure: Structure;
}

export interface Conditions {
    oddValue: number;
}

export interface Structure {
    percentages: Percentage[];
}

export interface Percentage {
    bonus: number;
    end: number;
    start: number;
}

export interface Limits {
    betLimits: BetLimits;
    betLimitsByBetType: BetLimitsByBetType[];
    payouts: Payouts;
}

export interface BetLimits {
    Bet_max_limit: number;
    Bet_min_limit: number;
    stake_error_message: string;
}

export interface BetLimitsByBetType {
    betType: number;
    maxBetSelections: number;
    bettype_error_message: string;
}

export interface Payouts {
    maxPayout: number;
    minPayout: number;
    potentional_error_message: string;
}
