import { Routes } from '@angular/router';
import { RouteauthGuard } from './auth/routeauth.guard';
const gameRoutes = [
    { path: 'dybet', title: 'Dybet Games', desc: 'Exclusive Dybet games' },
    { path: 'crash', title: 'Crash Game', desc: 'Fast betting crash game' },
    { path: 'bingo', title: 'Bingo Game', desc: 'Play online bingo' },
    { path: 'cards', title: 'Card Games', desc: 'Poker & blackjack games' },
    { path: 'keno', title: 'Keno Game', desc: 'Lottery keno game' },
    { path: 'football', title: 'Football Betting', desc: 'Sports betting football' },
    { path: 'fishing', title: 'Fishing Game', desc: 'Arcade fishing game' },
    { path: 'shooting', title: 'Shooting Game', desc: 'Action shooting game' },
    { path: 'lottery', title: 'Lottery Game', desc: 'Win lottery prizes' },
    { path: 'chicken', title: 'Chicken Game', desc: 'Fun casino chicken game' },
    { path: 'table', title: 'Table Game', desc: 'Fun casino table game' }
  ];
export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./components/main/main').then(m => m.Main), data: {
            animation: "HomePage"
        },
    },
    {
        path: 'register',
        loadComponent: () => import('./components/main/main').then(m => m.Main), data: {
            animation: "HomePage"
        },
    },
    {
        path: 'casino',
        loadComponent: () => import('./components/casino/casino').then(m => m.Casino), data: {
            animation: "CasinoPage"
        },
    },
    {
        path: 'livecasino', loadComponent: () => import('./components/livecasino/livecasino').then(m => m.Livecasino), data: { animation: "LivecasinoPage" }
    },
    ...gameRoutes.map((r) => ({
        path: r.path,
        loadComponent: () =>
          import('./components/dybetgames/dybetgames').then(m => m.Dybetgames),
        data: {
          tag: r.path,
          title: r.title,
          description: r.desc
        }
      })),
    {
        path: 'about-us',
        loadComponent: () => import('./aboutus/aboutus').then(m => m.Aboutus), data: { tag: "about-us" }
    },
    {
        path: 'terms-of-use',
        loadComponent: () => import('./aboutus/aboutus').then(m => m.Aboutus), data: { tag: "terms-of-use" }
    },
    {
        path: 'confidentiality',
        loadComponent: () => import('./aboutus/aboutus').then(m => m.Aboutus), data: { tag: "confidentiality" }
    },
    {
        path: 'cookies',
        loadComponent: () => import('./aboutus/aboutus').then(m => m.Aboutus), data: { tag: "cookies" }
    },
    {
        path: 'responsible-gaming',
        loadComponent: () => import('./aboutus/aboutus').then(m => m.Aboutus), data: { tag: "responsible-gaming" }
    },
    {
        path: 'aml-policy',
        loadComponent: () => import('./aboutus/aboutus').then(m => m.Aboutus), data: { tag: "aml-policy" }
    },
    {
        path: 'help',
        loadComponent: () => import('./aboutus/aboutus').then(m => m.Aboutus), data: { tag: "help" }
    },
    {
        path: 'contact-us',
        loadComponent: () => import('./aboutus/aboutus').then(m => m.Aboutus), data: { tag: "contact-us" }
    },

    {
        path: '',
        loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard),
        data: { animation: 'DashboardPage', title: 'Dashboard' },
        canActivate: [RouteauthGuard],
        children: [
            {
                path: 'profile',
                loadComponent: () => import('./components/profile/profile').then(m => m.Profile),
                data: { title: 'Player Profile', animation: 'ProfilePage' }
            },
            {
                path: 'balance',
                loadComponent: () => import('./pages/player-balance/player-balance').then(m => m.PlayerBalance),
                data: { title: 'Player Balance', animation: 'PlayerBalancePage' }
            },
            {
                path: 'deposit',
                loadComponent: () => import('./components/deposit/deposit').then(m => m.Deposit),
                data: { title: 'Deposit', animation: 'DepositPage' }
            },
            {
                path: 'deposit-pending',
                loadComponent: () =>
                  import('./components/deposit/deposit').then(m => m.Deposit)
              },
            {
                path: 'cashout',
                loadComponent: () => import('./cashout/cashout').then(m => m.Cashout),
                data: { title: 'Cashout', animation: 'CashoutPage' }
            },
            {
                path: 'transactions',
                loadComponent: () => import('./components/transaction-history/transaction-history').then(m => m.TransactionHistory),
                data: { title: 'TransactionHistory', animation: 'TransactionHistoryPage' }
            },
            {
                path: 'game-history',
                loadComponent: () => import('./components/game-history/game-history').then(m => m.GameHistory),
                data: { title: 'GameHistory', animation: 'GameHistoryPage' }
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
