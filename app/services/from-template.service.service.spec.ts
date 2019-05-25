/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FromTemplate.serviceService } from './from-template.service.service';

describe('Service: FromTemplate.service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FromTemplate.serviceService]
    });
  });

  it('should ...', inject([FromTemplate.serviceService], (service: FromTemplate.serviceService) => {
    expect(service).toBeTruthy();
  }));
});
