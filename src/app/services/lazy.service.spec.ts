/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LazyService } from './lazy.service';

describe('Service: Lazy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LazyService]
    });
  });

  it('should ...', inject([LazyService], (service: LazyService) => {
    expect(service).toBeTruthy();
  }));
});
