import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDownloads } from './application-downloads';

describe('ApplicationDownloads', () => {
  let component: ApplicationDownloads;
  let fixture: ComponentFixture<ApplicationDownloads>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationDownloads]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationDownloads);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
