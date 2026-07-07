import { Component, DOCUMENT, ElementRef, HostListener, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginState } from '../../core/appstates/loginstates/loginState';
import { Store } from '@ngrx/store';
import * as appState from '../../core/appstates/appState';
import { Slots } from '../../core/services/slots';
import { GameCmsService } from '../../core/services/games_cms/game-cms.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Games } from '../../services/games';
import { LoginService } from '../../core/services/login/login.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-casino',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, ReactiveFormsModule,
    FormsModule, TranslateModule
  ],
  templateUrl: './casino.html',
  styleUrl: './casino.css'
})

export class Casino implements OnInit, OnDestroy {

  private storeSub!: Subscription;

  playerLoggedIn: boolean = false;
  @ViewChild('dropdownContainer', { static: false })
  dropdownContainer!: ElementRef;
  allGames: any[] = [];
  searchText: string = '';
  providers: any[] = [];
  visibleCount: number = 40;
  groupedGames: any[] = [];
  loadMoreStep: number = 20;
  selectedProvider: string = 'all';
  showLogoutPopup = false;

  showAllMode: boolean = false;
  singleProviderView: boolean = false;

  currentCount: number = 40;
  loadStep: number = 20;
  isLoadingMore: boolean = false;
  errorMessage: any;
  filteredGames: any[] = [];
  visibleGames: any[] = [];
  showProviders = false;
  data:any = {
    title: 'Casino Games - Dybet',
    description: 'Play casino games at Dybet',
    ogTitle: 'Dybet Casino'
  }
  getActiveRoute: any;

  constructor( 
    private store: Store<appState.AppState>,
    private title: Title,
    private meta: Meta,
    private gamesService: Games,
    private router: Router,
    private route: ActivatedRoute,
    private slotsservie: Slots,
    private loginService: LoginService,
    private renderer: Renderer2, 
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {

    /* Login State */

    this.storeSub = this.store
      .select('loginState')
      .subscribe((loginState: LoginState) => {

        this.playerLoggedIn =
          !!loginState?.playerLoggedIn?.loggedIn;

      });

    /* Provider List */

    this.slotsservie.providerList$
      .subscribe((res: any) => {

        if (!res) return;

        const list = Array.from(res);

        const providerList = list.filter((name: any) =>

          name !== 'pragmaticplaylivecasinohd' &&
          name !== 'evolutiongv' &&
          name !== 'ezugigv' &&
          name !== 'powerplay' &&
          name !== 'vivogaming' &&
          name !== 'bti' &&
          name !== 'sexy' && name !== 'sales'

        );

        this.providers = [
          { name: 'all' },
          ...providerList.map(name => ({ name }))
        ];

      });

    /* Games */

    this.slotsservie.games$
      .subscribe((games: any[]) => {

        if (!Array.isArray(games)) return;

        const excludedProviders = [
          'pragmaticplaylivecasino',
          'powerplay',
          'evolutiongv',
          'ezugigv',
          'vivogaming',
          'bti',
          'sexy', 'sales'
        ];

        this.allGames = games
          .filter((game: any) => {
            const provider = (game.provider || '').toLowerCase();
            return !excludedProviders.includes(provider);

          })
          .map(game => ({
            ...game,
            imageUrl:
              `assets/games/${(game.provider || '').toLowerCase()}/${game.gameId}_230.webp`
          }));
 
this.route.queryParams.subscribe(params => {

  const provider = params['provider'];

  console.log('provider param=', provider);

  if (provider && provider !== 'all') {

    this.openProvider(provider);

  } else {

    this.selectedProvider = 'all';
    this.singleProviderView = false;
    this.showAllMode = false;

    this.buildProviderRows();
  }
});
      });

      this.title.setTitle('Casino Games - Dybet');

      this.meta.updateTag({
        name: 'description',
        content: 'Play casino betting and casino games at Dybet.'
      });
      
      const canonicalUrl = window.location.origin + this.router.url.split('?')[0];
      
      const canonical = this.document.querySelector('link[rel="canonical"]');
      
      if (canonical) {
        this.renderer.setAttribute(canonical, 'href', canonicalUrl);
      } else {
        const link = this.renderer.createElement('link');
        this.renderer.setAttribute(link, 'rel', 'canonical');
        this.renderer.setAttribute(link, 'href', canonicalUrl);
        this.renderer.appendChild(this.document.head, link);
      }

  }
 
  onImageLoad(event: any) {

    const image = event.target;

    image.classList.add('loaded');

    const loader =
      image.parentElement.querySelector('.image-loader');

    if (loader) {
      loader.style.display = 'none';
    }

  }
  /* Initial 10 Providers */

  buildProviderRows(): void {

    this.showAllMode = false;
    this.singleProviderView = false; 
  
    this.filteredGames = [];
    this.visibleGames = [];
    const providerMap: any = {};

    this.allGames.forEach((game: any) => {

      const provider =
        (game.provider || '').toLowerCase();

      if (!providerMap[provider]) {
        providerMap[provider] = [];
      }

      providerMap[provider].push(game);

    });

    const providers =
      Object.keys(providerMap).slice(0, 10);

    this.groupedGames = providers.map(provider => ({

      provider,

      /* Single Row Games */

      games: providerMap[provider].slice(0, 10),

      totalGames: providerMap[provider].length

    }));

  }

  /* Show All Games */

  showAllGames(provider: string): void {
    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams: {
          provider
        },
        queryParamsHandling: 'merge'
      }
    );

  }

  /* Dropdown Change */
  openProvider(provider: string): void {

    this.selectedProvider = provider;

    this.singleProviderView = true;

    this.showAllMode = true;

    /* First Load 40 */

    this.currentCount = 40;

    const providerGames =
      this.allGames.filter(
        g => (g.provider || '').toLowerCase() === provider
      );

    this.filteredGames = providerGames;

    this.visibleGames =
      this.filteredGames.slice(0, this.currentCount);

    this.groupedGames = [{

      provider,

      games: this.visibleGames,

      totalGames: providerGames.length

    }];

  }
  filterProvider(event: any): void {

    const value =
      (event.target.value || '').toLowerCase();

    /* All Providers */

    if (value === 'all') {

      this.singleProviderView = false;

      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: {
            provider: null
          },
          queryParamsHandling: 'merge'
        }
      );
      this.filteredGames = [];
      this.visibleGames = [];
  
      this.singleProviderView = false;
      this.buildProviderRows();

      return;
    }

    /* Single Provider */

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {
          provider: value
        },
        queryParamsHandling: 'merge'
      }
    );

  }
  loadMoreGames(): void {

    if (this.isLoadingMore) return;

    if (this.visibleGames.length >= this.filteredGames.length) {
      return;
    }

    this.isLoadingMore = true;

    setTimeout(() => {

      /* Next 20 only */

      const nextGames =
        this.filteredGames.slice(
          this.visibleGames.length,
          this.visibleGames.length + this.loadStep
        );

      /* Append only new games */

      this.visibleGames.push(...nextGames);

      /* IMPORTANT */

      this.groupedGames[0].games = this.visibleGames;

      this.isLoadingMore = false;

    }, 200);

  }
  /* Image Error */



  /* TrackBy */
  trackByGame(index: number, game: any): any {
    return game.gameId;
  }

  ngOnDestroy(): void {

    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }

  }
  searchGames(): void {

    const search =
      this.searchText.toLowerCase().trim();

    /* Initial Provider Rows */

    if (!this.singleProviderView) {

      if (!search) {

        this.buildProviderRows();

        return;
      }

      this.groupedGames = this.groupedGames.map(group => ({

        ...group,

        games: group.games.filter((game: any) =>
          (game.gameName || '')
            .toLowerCase()
            .includes(search)
        )

      })).filter(group => group.games.length);

      return;
    }

    /* Single Provider */

    /* Single Provider */

    const providerGames =
      this.allGames.filter(
        g => (g.provider || '').toLowerCase()
          === this.selectedProvider
      );

    const filteredGames =
      providerGames.filter((game: any) =>
        (game.gameName || '')
          .toLowerCase()
          .includes(search)
      );

    this.filteredGames = filteredGames;

    this.visibleGames =
      this.filteredGames.slice(0, this.currentCount);

    this.groupedGames = [{

      provider: this.selectedProvider,

      games: this.visibleGames,

      totalGames: filteredGames.length

    }];

  }
  toggleDropdown(event: Event) {

    event.stopPropagation();

    this.showProviders = !this.showProviders;

  }
  selectProvider(provider: any) {
    this.selectedProvider = provider.name;
    this.showProviders = false;

    this.filterProvider({
      target: {
        value: provider.name
      }
    });
  }
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {

    if (
      this.dropdownContainer &&
      !this.dropdownContainer.nativeElement.contains(event.target)
    ) {
      this.showProviders = false;
    }

  }

  launchGame(game: any) {
    if (this.playerLoggedIn) {
      const slotState = {
        provider: this.selectedProvider,
        gameId: game.gameId,
        scrollY: window.scrollY,
        currentCount: this.currentCount
      };

      sessionStorage.setItem(
        'slotPageState',
        JSON.stringify(slotState)
      );
      this.gamesService.launchGame(game, this.router.url).subscribe(result => {

        // ❌ Only handle error
        if (!result.success) {
          this.errorMessage = result.message;
          console.log(this.errorMessage)
          setTimeout(() => {
            this.errorMessage = "";

          }, 4000)
        }

      });
    } else {
      this.loginService.openLogin();
    }
  }

}