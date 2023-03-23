import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { B2bGuard } from './b2b-guard.guard';

describe('B2bGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [B2bGuard]
    });
  });

  it('should ...', inject([B2bGuard], (guard: B2bGuard) => {
    expect(guard).toBeTruthy();
  }));
});
