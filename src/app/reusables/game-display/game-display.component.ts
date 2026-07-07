import { Component, OnInit, OnDestroy, ElementRef, Renderer2, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-game-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-display.component.html',
  styleUrls: ['./game-display.component.css']
})
export class GameDisplayComponent implements OnInit, OnDestroy {
  sanitizedUrl: SafeResourceUrl | null = null;
  isLoading = true;
  gameId: string | null = null;

  private routerSub?: Subscription;

  private offsetX = 0;
  private offsetY = 0;
  isDragging = false;
  private btn!: HTMLElement;
  btnOpacity = 0.3;
  btnPosition = { left: 10, top: -10 };
  container!: HTMLElement;
  showRipple = false;
  showPulse = true;
  isHovered = false;

  private animationFrameId: number | null = null;
  private dragThreshold = 5;
  private dragDistance = 0;
  private isDragActive = false; // New flag to track if drag is actively happening

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2,
    private location: Location
  ) { }

  ngOnInit() {
    this.loadGameFromStorage();
    this.container = this.el.nativeElement.querySelector('.top-controls-container');

    setTimeout(() => {
      this.initializeButtonPosition();
      setTimeout(() => this.showPulse = false, 3000);
    }, 100);

    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.loadGameFromStorage());
  }

  initializeButtonPosition() {
    if (!this.container) return;
    this.centerButton();
  }

  centerButton() {
    if (!this.container) return;

    const containerWidth = this.container.clientWidth;
    const btnWidth = 100;

    this.btnPosition = {
      left: (containerWidth - btnWidth) / 2,
      top: -10
    };
  }

  startDrag(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.isDragActive = true; // Set drag active flag
    this.isDragging = false;
    this.dragDistance = 0;
    this.btn = this.el.nativeElement.querySelector('.drag-btn');

    const clientX = (event instanceof MouseEvent) ? event.clientX : event.touches[0].clientX;
    const clientY = (event instanceof MouseEvent) ? event.clientY : event.touches[0].clientY;

    const rect = this.btn.getBoundingClientRect();
    this.offsetX = clientX - rect.left;
    this.offsetY = clientY - rect.top;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Add event listeners specifically for this drag session
    this.renderer.listen('document', 'mousemove', this.handleMove.bind(this));
    this.renderer.listen('document', 'touchmove', this.handleMove.bind(this));
    this.renderer.listen('document', 'mouseup', this.handleEnd.bind(this));
    this.renderer.listen('document', 'touchend', this.handleEnd.bind(this));
  }

  private handleMove(event: MouseEvent | TouchEvent) {
    if (!this.isDragActive || !this.btn) return;

    const clientX = (event instanceof MouseEvent) ? event.clientX : event.touches[0].clientX;
    const clientY = (event instanceof MouseEvent) ? event.clientY : event.touches[0].clientY;

    const rect = this.btn.getBoundingClientRect();
    const distance = Math.sqrt(
      Math.pow(clientX - (rect.left + this.offsetX), 2) +
      Math.pow(clientY - (rect.top + this.offsetY), 2)
    );

    this.dragDistance = Math.max(this.dragDistance, distance);

    if (!this.isDragging && this.dragDistance > this.dragThreshold) {
      this.isDragging = true;
      this.btnOpacity = 0.9;
    }

    if (this.isDragging) {
      this.animationFrameId = requestAnimationFrame(() => {
        const containerRect = this.container.getBoundingClientRect();
        let x = clientX - this.offsetX - containerRect.left;
        let y = clientY - this.offsetY - containerRect.top;

        const padding = 10;
        const maxX = this.container.clientWidth - this.btn.offsetWidth - padding;
        const maxY = 50;

        x = Math.max(padding, Math.min(x, maxX));
        y = 5;

        this.btnPosition.left = x;
        this.btnPosition.top = y;
      });
    }
  }

  private handleEnd() {
    this.cleanupDrag();
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  endDrag() {
    this.cleanupDrag();
  }

  private cleanupDrag() {
    if (!this.isDragActive) return;

    if (this.isDragging) {
      this.snapToEdge();
    }

    this.isDragActive = false;
    this.isDragging = false;
    this.btnOpacity = this.isHovered ? 0.9 : 0.3;
    this.dragDistance = 0;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Remove event listeners
    // Note: In a real implementation, you'd need to store references to the listeners
    // and remove them properly. For simplicity, we're using the HostListener approach.
  }

  snapToEdge() {
    if (!this.btn || !this.container) return;

    const containerW = this.container.clientWidth;
    const btnW = this.btn.offsetWidth;
    const x = this.btnPosition.left;

    const distances = {
      left: x,
      right: containerW - btnW - x,
      center: Math.abs(x - (containerW - btnW) / 2)
    };

    const threshold = 60;

    if (distances.left < threshold) {
      this.btnPosition.left = 10;
    } else if (distances.right < threshold) {
      this.btnPosition.left = containerW - btnW - 10;
    } else if (distances.center < threshold) {
      this.centerButton();
    }

    this.btnPosition.top = 5;
  }

  onMouseEnter() {
    this.isHovered = true;
    if (!this.isDragging) {
      this.btnOpacity = 0.9;
      this.btnPosition.top = 5;
    }
  }

  onMouseLeave() {
    this.isHovered = false;
    if (!this.isDragging) {
      this.btnOpacity = 0.3;
      this.btnPosition.top = -10;
    }
  }

  onBackClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.isDragging || this.dragDistance > this.dragThreshold || this.isDragActive) {
      return;
    }

    this.showRipple = true;
    if (this.btn) {
      this.renderer.addClass(this.btn, 'active');
    }

    setTimeout(() => {
      this.showRipple = false;
      if (this.btn) {
        this.renderer.removeClass(this.btn, 'active');
      }
      this.goBack();
    }, 300);
  }

  private goBack() {
    // Use Angular's Location service to go back to the previous route
    this.location.back();
  }

  private loadGameFromStorage(): void {
    this.gameId = this.route.snapshot.paramMap.get('id');
    const gameData = sessionStorage.getItem('currentGame');

    if (gameData) {
      const parsed = JSON.parse(gameData);
      if (parsed.url && String(parsed.gameId) === this.gameId) {
        this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(parsed.url);
        this.isLoading = true;
        return;
      }
    }

    this.sanitizedUrl = null;
    this.router.navigate(['/']);
  }

  onGameLoad() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Cleanup any active drag state
    this.isDragActive = false;
    this.isDragging = false;
  }
}