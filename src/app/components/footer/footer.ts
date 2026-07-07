import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLinkWithHref } from "@angular/router";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [RouterLinkWithHref, CommonModule, TranslateModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {

  selectedLanguage = 'fr';
  dropdownOpen = false;

  languages = [
    {
      code: 'en',
      name: 'English'
    },
    {
      code: 'fr',
      name: 'Français'
    }
  ];
  year = new Date().getFullYear();

    
    
    constructor(private translate: TranslateService,private router: Router,){

      const savedLang = localStorage.getItem('lang');

      this.selectedLanguage = savedLang || 'fr';
  
      this.translate.use(this.selectedLanguage);
    }
    get selectedLanguageName(): string {
  
      const lang = this.languages.find(
        x => x.code === this.selectedLanguage
      );
  
      return lang ? lang.name : 'Language';
    }

  changeLanguage(lang: string) {

    this.selectedLanguage = lang;

    this.translate.use(lang);

    localStorage.setItem('lang', lang);

    this.dropdownOpen = false;

    const isHome =
    this.router.url === '/' ||
    this.router.url === '/home';

  if (isHome) {
    window.location.reload();
  }
  window.scroll(0,0);
  }
  toggleDropdown() {

    this.dropdownOpen = !this.dropdownOpen;
  }
  @HostListener('document:click', ['$event'])
  closeDropdown(event: any) {

    const clickedInside = event.target.closest(
      '.custom-language-dropdown'
    );

    if (!clickedInside) {

      this.dropdownOpen = false;
    }
  }
  topview(){
    window.scroll(0,0)
  }
}
