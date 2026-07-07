export interface PlayerLevel {
  success: boolean;
  code?: any;
  description?: any;
  offset?: any;
  limit?: any;
  total?: any;
  playerLevelResponses: PlayerLevelResponse[];
  monthlyCounter: MonthlyCounter;
  yearkyCounter: MonthlyCounter;
}

export interface MonthlyCounter {
  periodType: string;
  periodNumber: number;
  startDate?: any;
  endDate?: any;
  deposits: number;
  compPoints: number;
  bets: number;
}

export interface PlayerLevelResponse {
  compPointsMultiplier?: number;
  name: string;
  priority: number;
  period?: string;
  compPoints?: number;
  deposits?: number;
  bets?: number;
  expPeriodsNumber: number;
  expiryPeriod?: string;
}