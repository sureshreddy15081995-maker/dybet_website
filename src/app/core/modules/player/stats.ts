import { Common } from '../common';

export interface Stats extends Common {
    offset?: null;
    limit?: null;
    total?: null;
    playersCount: number;
    tournamentsCount: number;
    activeTables: number;
    tablesCount: number;
    playersOnTables: number;
    playersInTournaments: number;
    playersInSitAndGo: number;
    activeTournaments: number;
    activeSitAndGo: number;
    sitAndGoCount: number;
    remainingInTournaments: number;
    remainingInSitAndGo: number;
}