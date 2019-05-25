/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FormNoUIService } from './form-noUI.service';

describe('Service: FormNoUI', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormNoUIService]
    });
  });

  it('should ...', inject([FormNoUIService], (service: FormNoUIService) => {
    expect(service).toBeTruthy();
  }));
});
