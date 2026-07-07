import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Slots } from '../../core/services/slots';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from '../../core/services/login/login.service';
import { Games } from '../../services/games';
import { LoginState } from '../../core/appstates/loginstates/loginState';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as appState from '../../core/appstates/appState';
import { Seoservice } from '../../seoservice';
@Component({
  selector: 'app-dybetgames',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule, TranslateModule
  ],
  templateUrl: './dybetgames.html',
  styleUrls: ['./dybetgames.css']
})
export class Dybetgames implements OnInit {
  @ViewChild('dropdownContainer', { static: false })
  dropdownContainer!: ElementRef;
  showProviders = false;
  TabName: string = '';
  isLoading: boolean = true;
  allGames: any[] = [];

  providerTotalList: any[] = [];

  providers: any[] = [];

  dybetgames: any[] = [];

  showAllMode: boolean = false;

  searchText: string = '';

  selectedProvider: string = 'all';
  private storeSub!: Subscription;
  errorMessage:any;

  playerLoggedIn:boolean = false;
  constructor(
    private route: ActivatedRoute,
    private slotsservie: Slots,
    private loginService:LoginService,
    private router: Router,
    private gamesService:Games,
    private store: Store<appState.AppState>,
    private seo: Seoservice

  ) {}

  ngOnInit(): void {

    this.seo.init();
    this.storeSub = this.store
    .select('loginState')
    .subscribe((loginState: LoginState) => {

      this.playerLoggedIn =
        !!loginState?.playerLoggedIn?.loggedIn;

    });
    const selectedTag =
      (this.route.snapshot.data['tag'] || '')
        .toLowerCase();

    this.TabName = selectedTag;
    this.isLoading = true
    console.log(this.isLoading = true);
    this.slotsservie.games$
      .subscribe((games: any[]) => {

        if (!Array.isArray(games) || games.length === 0) {
          return;
        }

        const excludedProviders = [
          'pragmaticplaylivecasino',
          'powerplay',
          'evolutiongv',
          'ezugigv',
          'vivogaming'
        ];

        const isMobile =
          /Android|iPhone/i.test(navigator.userAgent);

        this.allGames = games
        .filter((game: any) => {

          const provider =
            String(game.provider || '')
              .toLowerCase();
        
          const tags =
            this.getTags(game);
         
        
          // DYBET PAGE
          if (selectedTag === 'dybet') {

            return (
              !excludedProviders.includes(provider) &&
              provider === 'ballagames'
            );
          
          }else{

            return (
              !excludedProviders.includes(provider) &&
              tags.includes(selectedTag)
            );
          }
          
        
        }).map((game: any) => ({

            ...game,

            provider:
              (game.provider || '')
                .toLowerCase(),

            tags:
              this.getTags(game),

            imageUrl:
              `assets/games/${(game.provider || '').toLowerCase()}/${game.gameId}${isMobile ? '_149' : '_230'}.webp`

          }));
console.log(this.allGames)
        // Provider list
        const providerSet =
          new Set(
            this.allGames.map(g => g.provider)
          );

        this.providerTotalList = [
          { name: 'all' },
          ...Array.from(providerSet)
            .map(name => ({ name }))
        ];

        this.providers =
          this.providerTotalList;

        this.dybetgames =
          [...this.allGames];
          this.isLoading = false;
      });

  }

  getTags(game: any): string[] { 
    const tags: string[] = [];
  
    // Add tags field
    if (game.tags) {
  
      if (Array.isArray(game.tags)) {
  
        tags.push(
          ...game.tags.map((t: string) =>
            t.toLowerCase()
          )
        );
  
      } else {
  
        tags.push(
          String(game.tags).toLowerCase()
        );
  
      }
  
    }
  
    // Add provider name
    if (game.provider) {
  
      tags.push(
        String(game.provider).toLowerCase()
      );
  
    }
  
    return tags;
  
  }

  hasTag(game: any, tag: string): boolean {

    return this.getTags(game)
      .includes(tag);

  }

  trackByGame(
    index: number,
    game: any
  ): any {

    return game.gameId;

  }

  searchGames(): void {

    const search =
      (this.searchText || '')
        .toLowerCase();

    this.dybetgames =
      this.allGames.filter((game: any) => {

        const matchesProvider =
          this.selectedProvider === 'all' ||
          game.provider === this.selectedProvider;

        const matchesSearch =
          !search ||
          (game.gameName || '')
            .toLowerCase()
            .includes(search);

        return (
          matchesProvider &&
          matchesSearch
        );

      });

  }

  toggleDropdown(event: Event) {

    event.stopPropagation();
  
    this.showProviders = !this.showProviders;
  
  }
  selectProvider(provider: any) {
    this.selectedProvider = provider.name;
    this.showProviders = false;
  
 
    this.searchGames();
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
  filterProvider(event: any): void {

    this.selectedProvider =
      event.target.value.toLowerCase();
  
    this.searchGames();
  
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
    if(this.playerLoggedIn){
      const slotState = {
        provider: this.selectedProvider,
        gameId: game.gameId,
        scrollY: window.scrollY,
      };
      
      sessionStorage.setItem(
        'slotPageState',
        JSON.stringify(slotState)
      );
      this.gamesService.launchGame(game, this.router.url).subscribe(result => {
     
        if (!result.success) {
        this.errorMessage = result.message;
         console.log(this.errorMessage)
         setTimeout(()=>{
    this.errorMessage = "";

         }, 4000)
        }
    
      });
    }else {
      this.loginService.openLogin();
    }
  }
}