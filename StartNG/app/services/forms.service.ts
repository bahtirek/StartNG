import { FormFBtemplateService } from './form-FBtemplate.service';
import { FormNoUIService } from './form-noUI.service';
import { FormTemplateService } from './form-template.service';
import { FormsData } from './../data/forms.interface';
import { FormBootstrapUIService } from './form-bootstrapUI.service';
import { Comp } from './../data/comp.interface';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  temp: any;
  component: Comp;
  formControls: string = '';
  formGroup: string = '';
  properties: string = '';
  formsGroupUI: string = '';
  radios: string[] = [];
  tempController: any;

constructor(private tempNoUI: FormNoUIService, private tempUI: FormBootstrapUIService, private tempContrFB: FormFBtemplateService, private tempContr: FormTemplateService) { 
  
}

setForms(component: Comp, fb, UI, scss){
  this.component = component;
  if (UI) {
    this.temp = this.tempUI;
  } else {
    this.temp = this.tempNoUI;
  }
  if (fb) {
    this.tempController = this.tempContrFB;
  } else {
    this.tempController = this.tempContr;
  }
  let css = 'css';
  if (scss) {
    css = 'scss';
  }

  component.forms.forEach((form: FormsData, index) => {
    this.setUI(form, UI);
    this.setController(form);
    if (index === component.forms.length - 1) {
      this.formControls = this.formControls.slice(0, -2);
      component.ts = this.tempController.ts(component.name, component.upName, this.properties, this.formControls, this.formGroup, css);
      component.html = this.temp.form(this.formsGroupUI)
      this.properties = '';
      this.formControls = '';
      this.formGroup = '';
      this.formsGroupUI = '';
      this.radios = [];
    }
  })

}

setController(form: FormsData) {
  const index = this.radios.indexOf(form.propertyName);
  if (index === -1) {
    this.properties += this.tempController.property(form.propertyName);
    this.formGroup += this.tempController.createFormGroup(form.propertyName);
    this.setFormControls(form);
    if (form.inputType === 'radio') {
      this.radios.push(form.propertyName);
    }
  }
  
}

setFormControls(form: FormsData): any {
  let validators = '';
  if (form.required) {
    validators += this.tempController.validator('required');
  }
  if (form.maxLength) {
    validators += this.tempController.validator('maxLength(' + form.maxLength +')');
  }
  if (form.minLength) {
    validators += this.tempController.validator('minLength(' + form.minLength +')');
  }
  if (form.inputType === 'email') {
    validators += this.tempController.validator('email');
  }
  if (form.pattern) {
    validators += this.tempController.validator('pattern(' + form.pattern + ')');
  }
  this.formControls += this.tempController.createFormControl(form.propertyName, validators);
}




setUI(form: FormsData, UI) {
  const errorsGroup = this.setErrors(form);  
  if (UI) {
    this.setFormsGroupUI(form, errorsGroup);
  } else {
    this.setFormsGroupNoUI(form, errorsGroup);
  } 
}

setFormsGroupNoUI(form: FormsData, errorsGroup: any) {
  if (form.inputType === 'radio' || form.inputType === 'checkbox') {
    this.formsGroupUI += this.temp.radio(form.propertyName, form.label, form.value, errorsGroup);
  } else   if (form.inputType === 'textarea') {
    this.formsGroupUI += this.temp.textarea(form.propertyName, form.label, errorsGroup, form.placeholder, '');
  } else   if (form.inputType === 'phone') {
    const phone = 'appPhoneFormat maxlength="' + form.maxLength + '" ';
    this.formsGroupUI += this.temp.formGroup(form.propertyName, form.label, errorsGroup, form.placeholder, phone);
  } else   if (form.inputType === 'file') {
    this.formsGroupUI += this.temp.file(form.propertyName, form.label, errorsGroup);
  } else   if (form.inputType === 'select') {
    this.formsGroupUI += this.temp.select(form.propertyName, form.label, errorsGroup);
  } else {
    this.formsGroupUI += this.temp.formGroup(form.propertyName, form.label, errorsGroup, form.placeholder, '');
  }
  
}

setFormsGroupUI(form: FormsData, errorsGroup) {
  let errorClass: string = '';
  if (errorsGroup) {
    if (form.inputType === 'radio' || form.inputType === 'checkbox' || form.inputType === 'select') {
      errorClass = this.temp.radioErrorClass(form.propertyName);
    } else {
      errorClass = this.temp.errorClass(form.propertyName);
    }
    
  }

  if (form.inputType === 'radio' || form.inputType === 'checkbox') {
    this.formsGroupUI += this.temp.radio(form.propertyName, form.label, form.value, errorsGroup, errorClass);
  } else   if (form.inputType === 'textarea') {
    this.formsGroupUI += this.temp.textarea(form.propertyName, form.label, errorsGroup, errorClass, form.placeholder, '');
  } else   if (form.inputType === 'phone') {
    const phone = 'appPhoneFormat maxlength="' + form.maxLength + '" ';
    this.formsGroupUI += this.temp.formGroup(form.propertyName, form.label, errorsGroup, errorClass, form.placeholder, 'form-control-sm' , phone);
  } else   if (form.inputType === 'file') {
    this.formsGroupUI += this.temp.file(form.propertyName, form.label, errorsGroup, errorClass);
  } else   if (form.inputType === 'select') {
    this.formsGroupUI += this.temp.select(form.propertyName, form.label, errorsGroup, errorClass);
  } else {
    this.formsGroupUI += this.temp.formGroup(form.propertyName, form.label, errorsGroup, errorClass, form.placeholder, 'form-control-sm', '');
  }
  
}

setErrors(form: FormsData){
  let errors = '' ;
  if (form.required) {
    errors += this.temp.errorRequired(form.propertyName, form.label);
  }
  if (form.maxLength) {
    errors += this.temp.errorMaxLength(form.propertyName, form.maxLength);
  }
  if (form.minLength) {
    errors += this.temp.errorMinLength(form.propertyName, form.minLength);
  }
  if (form.inputType === 'email') {
    errors += this.temp.errorEmail(form.propertyName);
  }
  if (form.pattern) {
    errors += this.temp.errorPattern(form.propertyName, form.label);
  }
  errors = errors.slice(0, -1);

  if (form.inputType === 'radio' || form.inputType === 'checkbox' || form.inputType === 'select') {
    return this.temp.radioErrorsGroup(form.propertyName, form.label);
  } else {
    return this.temp.errorsGroup(form.propertyName, errors);
  } 
  
}

}
