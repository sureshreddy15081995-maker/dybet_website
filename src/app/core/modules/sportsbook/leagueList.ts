export interface LeaguesListResponse {
    message: string;
    status: number;
    data: { [key: string]: LeaguesList[] };
}

export interface LeaguesList {
    league: string;
    leagueId: string;
    no: number;
}