/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FormTemplateService } from './form-template.service';

describe('Service: FormTemplate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormTemplateService]
    });
  });

  it('should ...', inject([FormTemplateService], (service: FormTemplateService) => {
    expect(service).toBeTruthy();
  }));
});
