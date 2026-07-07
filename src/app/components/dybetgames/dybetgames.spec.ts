import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dybetgames } from './dybetgames';

describe('Dybetgames', () => {
  let component: Dybetgames;
  let fixture: ComponentFixture<Dybetgames>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dybetgames]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dybetgames);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
