import { TestBed } from '@angular/core/testing';

import { MeterialService } from './meterial.service';

describe('MeterialService', () => {
  let service: MeterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
