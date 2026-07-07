export interface IGenerateBetSlip {
    flag: boolean;
    name: string;
    matchId: number;
    type: string;
    oddstype: string;
    oddId: number;
    oddTitle: string;
    odd: number;
    decimalOdd: number;
    mktId: number;
    betString: string;
}

export class BetSlip {
    public generateBetSlip: GenerateBetSlip[];
    constructor(generateBetSlip: GenerateBetSlip[]) {
        this.generateBetSlip = generateBetSlip;
    }
}

export class GenerateBetSlip {
    public flag: boolean;
    public name: string;
    public matchId: number;
    public type: string;
    public oddstype: string;
    public oddId: number;
    public oddTitle: string;
    public odd: number;
    public decimalOdd: number;
    public mktId: number;
    public betString: string;
    constructor(flag: boolean, name: string, matchId: number,
        type: string, oddstype: string, oddId: number,
        oddTitle: string, odd: number, decimalOdd: number, mktId: number, betString: string) {
        this.flag = flag;
        this.name = name;
        this.matchId = matchId;
        this.type = type;
        this.oddstype = oddstype;
        this.oddId = oddId;
        this.oddTitle = oddTitle;
        this.odd = odd;
        this.decimalOdd = decimalOdd;
        this.mktId = mktId;
        this.betString = betString;
    }
}