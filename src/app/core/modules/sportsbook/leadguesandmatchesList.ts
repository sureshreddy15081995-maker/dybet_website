export interface LeaguesAndMatchesList {
    message: string;
    status: number;
    data: Leagues[];
}

export interface Leagues {
    name: string;
    matchId: number;
    league: string;
    leagueId: string;
    startDate: string;
    startTime: string;
    oddIndex: Array<any>;
    homeIndex: number;
    oddCount: number;
    odd: { [key: string]: Odd[] };
}

export interface Odd {
    id: number;
    oddtypeid: number;
    rowId: number;
    oddSelections: number;
    eu: Eu;
    na: Na;
    us: Us;
    oddstype: string;
    homeMktId: number;
    neutMktId: number;
    awayMktId: number;
}

export interface Eu {
    home: number;
    away: number | null;
    draw: number | null;
    matchId: number;
    titleHome: string;
    titleAway: null | string;
    titleDraw: null | string;
}

export interface Na {
    home: number;
    away: number | null;
    draw: number | null;
    matchId: number;
    titleHome: string;
    titleAway: null | string;
    titleDraw: null | string;
}

export interface Us {
    home: number;
    away: number | null;
    draw: number | null;
    matchId: number;
    titleHome: string;
    titleAway: null | string;
    titleDraw: null | string;
}
