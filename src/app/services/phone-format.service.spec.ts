import { TestBed, inject } from '@angular/core/testing';

import { PhoneFormatService } from './phone-format.service';

describe('PhoneFormatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhoneFormatService]
    });
  });

  it('should be created', inject([PhoneFormatService], (service: PhoneFormatService) => {
    expect(service).toBeTruthy();
  }));
});
