import { TestBed } from '@angular/core/testing';

import { LTCService } from './ltc.service';

describe('ImagingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LTCService = TestBed.get(LTCService);
    expect(service).toBeTruthy();
  });
});
