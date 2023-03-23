import { TestBed } from '@angular/core/testing';

import { SuccessmessageService } from './successmessage.service';

describe('SuccessmessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SuccessmessageService = TestBed.get(SuccessmessageService);
    expect(service).toBeTruthy();
  });
});
