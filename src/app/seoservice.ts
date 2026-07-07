import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Seoservice {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private meta: Meta
  ) {}
  init() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.activatedRoute;

        while (route.firstChild) {
          route = route.firstChild;
        }

        const data = route.snapshot.data;

        if (data['title']) {
          this.title.setTitle(data['title']);
        }

        if (data['description']) {
          this.meta.updateTag({
            name: 'description',
            content: data['description']
          });
        }
      });
  }
}
