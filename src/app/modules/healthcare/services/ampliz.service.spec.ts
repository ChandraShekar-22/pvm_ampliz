import { TestBed } from '@angular/core/testing';

import { AmplizService } from './ampliz.service';

describe('AmplizService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AmplizService = TestBed.get(AmplizService);
    expect(service).toBeTruthy();
  });
});
