/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FormsNoUIService } from './formsNoUI.service';

describe('Service: FormsNoUI', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormsNoUIService]
    });
  });

  it('should ...', inject([FormsNoUIService], (service: FormsNoUIService) => {
    expect(service).toBeTruthy();
  }));
});
