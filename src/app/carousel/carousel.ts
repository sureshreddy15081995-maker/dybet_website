import { Component, ElementRef, ViewChild } from '@angular/core';
import { Slots } from '../core/services/slots';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule,
    RouterModule, ReactiveFormsModule,
    FormsModule, TranslateModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css'
})
export class Carousel {
  bannerEngList: any[] = [];
  currentIndex = 0;

  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  bannerLoaded: boolean[] = [];
  constructor(private slotsservie: Slots) {

  }
  ngOnInit() {
    this.slotsservie.banners$.subscribe((data: any) => {
      if (data) {
        this.bannerEngList = data;
      }
    });
  }
  ngAfterViewInit() {
    setInterval(() => {
      this.autoScroll();
    }, 3000);
  }
  autoScroll() {
    const container = this.scrollContainer.nativeElement;
    if (!container) return;

    const cards = container.querySelectorAll('.banner-card');
    if (!cards || cards.length === 0) return;

    this.currentIndex++;

    if (this.currentIndex >= cards.length) {
      this.currentIndex = 0;
    }

    const cardWidth = cards[0].offsetWidth;

    container.scrollTo({
      left: this.currentIndex * cardWidth,
      behavior: 'smooth'
    });
  }
}
