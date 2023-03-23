import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { PhysicianGuard } from './physician.guard';

describe('PhysicianGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhysicianGuard]
    });
  });

  it('should ...', inject([PhysicianGuard], (guard: PhysicianGuard) => {
    expect(guard).toBeTruthy();
  }));
});
