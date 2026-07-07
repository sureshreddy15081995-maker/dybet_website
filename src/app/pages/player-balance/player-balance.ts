import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../core/services/player/player.service';
import { CashierService } from '../../core/services/cashier/cashier.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-player-balance',
  imports: [CommonModule, TranslateModule],
  templateUrl: './player-balance.html',
  styleUrl: './player-balance.css'
})
export class PlayerBalance {
  playerDetails: any = null;
  vipLevel: string = 'Loading...';
  availableBalance: number = 0;
  bonusBalance: number = 0;
  inPlayBalance: number = 0;
  totalBalance: number = 0;

  vipLevels: any[] = [];
  vipObj: any[] = [];
  vipPointsFilter: number[] = [];
  vipNameFilter: string[] = [];
  loadercondition: boolean = false;
  playerLevelloader: boolean = true;

  vipPoints: number = 1000;
  monthCollectedPints: number = 0;
  yearCollectedPints: number = 0;
  weeklyCollectedPints: number = 0;
  goldPoints: number = 0;

  endDateYearly: string = '';
  endDateMonthly: string = '';
  endDateWeekly: string = '';
  endDateHourly: string = '';
  currencysymbol:any;
  constructor(private playerService: PlayerService, private cashierService: CashierService) { }

  ngOnInit() {
    this.loadPlayerData();
    this.loadPlayerProfile();
  }

  loadPlayerProfile(): void {
    this.playerService.onPlayerGetProfile().subscribe({
      next: (res) => {
        if (res.success) {
          this.playerDetails = res;
        }
      },
      error: (error) => console.error('Failed to load player profile:', error)
    });
  }

  loadPlayerData() {
    this.playerService.onPlayerGetPlayerLevels().subscribe({
      next: (levelRes: any) => this.levelHandler(levelRes),
      error: (error) => console.error('Failed to load player levels:', error)
    });

    this.cashierService.onCashierGetBalance().subscribe({
      next: (cashierRes: any) => this.handleCashierResponse(cashierRes),
      error: (error) => console.error('Failed to load balance:', error)
    });
  }

  levelHandler(apiRes: any) {
    if (!apiRes.success) {
      this.setError('Failed to load VIP data');
      return;
    }

    this.vipLevels = apiRes.playerLevelResponses || [];

    this.endDateYearly = apiRes.yearkyCounter?.endDate?.replace('999', '') || '';
    this.endDateMonthly = apiRes.monthlyCounter?.endDate?.replace('999', '') || this.endDateYearly;
    this.endDateWeekly = apiRes.weeklyCounter?.endDate?.replace('999', '') || this.endDateYearly;
    this.endDateHourly = apiRes.hourlyCounter?.endDate?.replace('999', '') || '';

    this.vipObj = [];
    let currentLevelFound = false;

    for (let level of this.vipLevels) {
      if (this.vipPoints < level.compPoints && !currentLevelFound) {
        this.vipPointsFilter.push(level.compPoints);
        this.vipNameFilter.push(level.name);

        let endDate =
          level.period === 'Week' ? this.endDateWeekly :
            level.period === 'Month' ? this.endDateMonthly :
              level.period === 'Year' ? this.endDateYearly :
                this.endDateHourly;

        this.vipObj.push({
          name: level.name,
          endDate: endDate,
          compPoints: level.compPoints
        });
      } else if (!currentLevelFound) {
        this.vipLevel = level.name;
        currentLevelFound = true;
        this.loadercondition = false;
      }
    }

    // Format dates
    this.vipObj.forEach(obj => {
      if (obj.endDate) {
        try {
          let formattedDate = obj.endDate.substring(0, obj.endDate.length - 7);
          let dateObj = new Date(formattedDate);
          let vipEndDateStr = `${dateObj.toString().replace("GMT+0530 (India Standard Time)", "(IST)")}`;
          obj.endDate = "by " + vipEndDateStr;
        } catch (e) {
          obj.endDate = "Date not available";
        }
      } else {
        obj.endDate = "No deadline";
      }
    });

    this.monthCollectedPints = apiRes.monthlyCounter?.compPoints || 0;
    this.yearCollectedPints = apiRes.yearkyCounter?.compPoints || 0;
    this.weeklyCollectedPints = apiRes.weeklyCounter?.compPoints || 0;
    this.goldPoints = apiRes.goldCounter?.compPoints || 0;

    this.playerLevelloader = false;

    if (!currentLevelFound && this.vipLevels.length > 0) {
      this.vipLevel = this.vipLevels[this.vipLevels.length - 1].name;
    } else if (this.vipLevels.length === 0) {
      this.vipLevel = 'NA';
    }
  }

  handleCashierResponse(apiRes: any) {
    if (apiRes.success && Array.isArray(apiRes.values)) {
      let available = 0;
      let bonus = 0;
      let inPlay = 0;
let symbol: any
      apiRes.values.forEach((wallet: any) => {
        available = wallet.cash?.value || 0;
        bonus = wallet.bonus?.value || 0;
        inPlay = wallet.cashInPlay?.value || 0;
        symbol =  wallet.symbol
      });

      const total = available + bonus + inPlay;

      this.availableBalance = available;
      this.bonusBalance = bonus;
      this.inPlayBalance = inPlay;
      this.totalBalance = total;
      this.currencysymbol = symbol;
    }
  }

  getInitials(): string {
    if (!this.playerDetails) return 'US';
    const firstInitial = this.playerDetails.firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = this.playerDetails.lastName?.charAt(0)?.toUpperCase() || '';
    return firstInitial + lastInitial || 'US';
  }

  getVipLevelClass(): string {
    const level = this.vipLevel.toLowerCase();
    if (level.includes('bronze')) return 'bronze';
    if (level.includes('silver')) return 'silver';
    if (level.includes('gold')) return 'gold';
    if (level.includes('platinum')) return 'platinum';
    if (level.includes('diamond')) return 'diamond';
    return 'gold'; // default
  }

  calculateProgress(requiredPoints: number): number {
    if (!requiredPoints || requiredPoints <= 0) return 0;
    const progress = (this.vipPoints / requiredPoints) * 100;
    return Math.min(Math.round(progress), 100);
  }

  setError(msg: string) {
    console.error('Error:', msg);
    this.playerLevelloader = false;
  }
}