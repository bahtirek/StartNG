/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RouteToStringService } from './routeToString.service';

describe('Service: RouteToString', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouteToStringService]
    });
  });

  it('should ...', inject([RouteToStringService], (service: RouteToStringService) => {
    expect(service).toBeTruthy();
  }));
});
