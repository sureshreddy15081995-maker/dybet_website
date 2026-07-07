import { Component, OnInit } from '@angular/core';
import { Games } from '../services/games';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-gamelaunch',
  imports: [],
  templateUrl: './gamelaunch.html',
  styleUrl: './gamelaunch.css'
})
export class Gamelaunch implements OnInit {

  gameUrl!: SafeResourceUrl;

  constructor(
    private gamesService: Games,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {

    this.gamesService.gameUrl$
      .subscribe((data: any) => {
  
        console.log('GAME DATA', data);
  
        if (data?.url) {
  
          this.gameUrl =
            this.sanitizer
              .bypassSecurityTrustResourceUrl(
                data.url
              );
  
        }
  
      });
  
  }

  closeGame() { this.gamesService .closeIframeGame(); }

}