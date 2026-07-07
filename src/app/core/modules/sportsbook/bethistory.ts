export interface BetHistory {
    login_name: string;
    bet_slip_id: number;
    slip_date: Date;
    bet_type: number;
    total_bets: number;
    total_bet_amount: number;
    status: string;
    total_payout: number;
    betlines: Betline[];
}

export interface Betline {
    bet_id: number;
    bet_amount: number;
    odd_title: string;
    oddtype: string;
    odd_value: number;
    match_name: string;
    bet_payout: number;
    bet_result_status: string;
}