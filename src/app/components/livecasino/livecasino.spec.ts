import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Livecasino } from './livecasino';

describe('Livecasino', () => {
  let component: Livecasino;
  let fixture: ComponentFixture<Livecasino>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Livecasino]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Livecasino);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
