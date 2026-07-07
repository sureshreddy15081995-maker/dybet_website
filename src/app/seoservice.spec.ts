import { TestBed } from '@angular/core/testing';

import { Seoservice } from './seoservice';

describe('Seoservice', () => {
  let service: Seoservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Seoservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
