export interface BetsByCouponResponse {
    bet: Bet;
    date_time: Date;
    result: string;
    win_amount: number;
}

export interface Bet {
    betString: BetString;
}

export interface BetString {
    betType: number;
    betslip: Betslip[];
    betAmount: number;
    acceptOddChange: boolean;
    totalOdds: number;
    possiblePayout: number;
    possibleBonus: number;
    possibleWinnings: number;
    bonusPercentage: number;
    selections: number;
    remote: boolean;
}

export interface Betslip {
    betString: string;
    decimalOdd: number;
    matchId: number;
    name: string;
    odd: number;
    oddId: number;
    oddTitle: string;
    flag: boolean;
    oddstype: string;
    mktId: number;
}
