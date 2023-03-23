import { TestBed } from '@angular/core/testing';

import { LTCDataService } from './ltc-data.service';

describe('LTCDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LTCDataService = TestBed.get(LTCDataService);
    expect(service).toBeTruthy();
  });
});
