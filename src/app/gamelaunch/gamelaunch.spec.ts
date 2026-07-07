import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gamelaunch } from './gamelaunch';

describe('Gamelaunch', () => {
  let component: Gamelaunch;
  let fixture: ComponentFixture<Gamelaunch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gamelaunch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gamelaunch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
