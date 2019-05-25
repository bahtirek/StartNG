/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FormBootstrapUIService } from './form-bootstrapUI.service';

describe('Service: FormBootstrapUI', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormBootstrapUIService]
    });
  });

  it('should ...', inject([FormBootstrapUIService], (service: FormBootstrapUIService) => {
    expect(service).toBeTruthy();
  }));
});
