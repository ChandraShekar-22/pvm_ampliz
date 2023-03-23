import { TestBed } from '@angular/core/testing';

import { ImagingDataService } from './imaging-data.service';

describe('ImagingDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImagingDataService = TestBed.get(ImagingDataService);
    expect(service).toBeTruthy();
  });
});
