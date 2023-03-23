import { TestBed } from '@angular/core/testing';

import { ImagingService } from './imaging.service';

describe('ImagingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImagingService = TestBed.get(ImagingService);
    expect(service).toBeTruthy();
  });
});
