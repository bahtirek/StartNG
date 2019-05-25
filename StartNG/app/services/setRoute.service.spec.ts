/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SetModuleService } from './setModule.service';

describe('Service: SetRoute', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SetModuleService]
    });
  });

  it('should ...', inject([SetModuleService], (service: SetModuleService) => {
    expect(service).toBeTruthy();
  }));
});
