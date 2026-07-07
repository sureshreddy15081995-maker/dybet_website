export interface SportBookGetSportsResponse {
    message: string;
    status: number;
    data: SportsMenu[];
}

export interface SportsMenu {
    sport: string;
    matches: number;
}