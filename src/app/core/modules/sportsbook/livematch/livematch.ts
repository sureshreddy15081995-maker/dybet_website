export interface LiveMatch {
  data: { [key: string]: Data };
}

export interface Data {
  leagues: League[];
}

export interface League {
  id: number;
  name: string;
  startTime: string;
  odds: { [key: string]: LiveOdds };
}

export interface LiveOdds {
  id: string;
  name: string;
  short_name: string;
  suspend: number;
  order: number;
  info: string;
  participants: { [key: string]: Participant[] };
}

export interface Participant {
  id: number;
  order: number;
  name: string;
  short_name: string;
  value_eu: string;
  value_na: string;
  value_us: string;
  handicap: string;
  suspend: number;
}
