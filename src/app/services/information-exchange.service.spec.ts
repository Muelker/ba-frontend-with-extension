import { TestBed } from '@angular/core/testing';

import { InformationExchangeService } from './information-exchange.service';

describe('InformationExchangeService', () => {
  let service: InformationExchangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformationExchangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
