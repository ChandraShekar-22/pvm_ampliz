import { TestBed } from '@angular/core/testing';

import { SkeletonloaderService } from './skeletonloader.service';

describe('SkeletonloaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SkeletonloaderService = TestBed.get(SkeletonloaderService);
    expect(service).toBeTruthy();
  });
});
