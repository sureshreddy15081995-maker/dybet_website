import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cashout } from './cashout';

describe('Cashout', () => {
  let component: Cashout;
  let fixture: ComponentFixture<Cashout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cashout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cashout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
