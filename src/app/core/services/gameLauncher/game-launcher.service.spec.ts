import { TestBed } from '@angular/core/testing';

import { GameLauncherService } from './game-launcher.service';

describe('GameLauncherService', () => {
  let service: GameLauncherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameLauncherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
