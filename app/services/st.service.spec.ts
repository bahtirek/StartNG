/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StService } from './st.service';

describe('Service: St', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StService]
    });
  });

  it('should ...', inject([StService], (service: StService) => {
    expect(service).toBeTruthy();
  }));
});
