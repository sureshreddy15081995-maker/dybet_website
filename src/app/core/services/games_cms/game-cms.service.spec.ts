import { TestBed } from '@angular/core/testing';

import { GameCmsService } from './game-cms.service';

describe('GameCmsService', () => {
  let service: GameCmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameCmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
