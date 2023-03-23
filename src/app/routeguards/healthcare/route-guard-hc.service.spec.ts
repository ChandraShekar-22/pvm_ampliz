import { TestBed } from '@angular/core/testing';

import { RouteGuardHCService } from './route-guard-hc.service';

describe('RouteGuardHCService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouteGuardHCService = TestBed.get(RouteGuardHCService);
    expect(service).toBeTruthy();
  });
});
