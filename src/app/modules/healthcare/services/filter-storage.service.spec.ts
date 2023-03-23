import { TestBed } from '@angular/core/testing';

import { FilterStorageService } from './filter-storage.service';

describe('FilterStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilterStorageService = TestBed.get(FilterStorageService);
    expect(service).toBeTruthy();
  });
});
