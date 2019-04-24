import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormBootstrapUIService {

constructor() { }

form(formGroups){
  return `
  <div class="d-flex justify-content-md-start">
<form [formGroup]="myForm" (ngSubmit)="onSubmit()" novalidate>
  ${formGroups}
  <div class="mt-4">
    <button type="submit" class="btn btn-outline-primary btn-sm mr-4" [disabled]="myForm.invalid">Submit</button>
    <button type="button" class="btn btn-outline-danger btn-sm mr-5"  (click)="onReset()">Reset</button>
  </div>
</form>
</div>
  `
}

/* FORM GROUP */
formGroup(formControlName, label, errorsGroup, errorClass, placeholder, formSize, phone){
  return `
  <div class="form-group" >
  <label for="${formControlName}">${label}</label>
  <input type="${formControlName}" id="${formControlName}" class="form-control ${formSize}" placeholder="${placeholder}" ${phone}
    ${errorClass}
    formControlName="${formControlName}">
    ${errorsGroup}
</div>`
}


textarea(formControlName, label, errorsGroup, errorClass, placeholder){
  return `
  <div class="form-group">
  <label for="${formControlName}">${label}</label>
  <textarea class="form-control" rows="5" id="${formControlName}" placeholder="${placeholder}"
  ${errorClass}
  formControlName="${formControlName}"></textarea>
  ${errorsGroup}
</div>`
}


select(formControlName, label, errorsGroup, errorClass){
  return `
  <div class="form-group">
  <label for="${formControlName}">${label}</label>
  <select class="form-control" id="${formControlName}" 
  ${errorClass}
  formControlName="${formControlName}">
  <option>...</option>
  </select>
  ${errorsGroup}
</div>`
}


file(formControlName, label, errorsGroup, errorClass){
  return `
  <div class="form-group" >
  <label for="${formControlName}">${label}</label>
  <input type="${formControlName}" id="${formControlName}" class="form-control-file"
    ${errorClass}
    formControlName="${formControlName}">
    ${errorsGroup}
</div>`
}


radio(formControlName, label, value, errorsGroup, errorClass){
  return `<div class="form-check">
  <input type="${formControlName}" id="${value}" value="${value}" class="form-check-input"
    ${errorClass}
    formControlName="${formControlName}">
    <label class="form-check-label" for="${value}">
    ${label}
  </label>
  ${errorsGroup}
</div>`
}





/* END OF FORM GROUP */



errorsGroup(formControlName, errors){
 return `<div class="invalid-feedback" *ngIf="${formControlName}.errors && (${formControlName}.dirty || ${formControlName}.touched )">
    ${errors}
  </div>`
}

//errors sozdayom plyusuya error i \n

errorRequired(formControlName, label){
  return `<p *ngIf="${formControlName}.errors.required">${label} is required</p>\n`
}

errorEmail(formControlName){
  return `<p *ngIf="${formControlName}.errors.email">Wrong email format</p>\n`
}

errorPattern(formControlName, label){
  return `<p *ngIf="${formControlName}.errors.pattern">Wrong ${label} format</p>\n`
}

errorMaxLength(formControlName, maxLength){
  return `<p *ngIf="${formControlName}.errors.maxlength">Maxlength is ${maxLength} characters</p>\n`
}

errorMinLength(formControlName, minLength){
  return `<p *ngIf="${formControlName}.errors.minlength">Minlength is ${minLength} characters</p>\n`
}

errorClass(formControlName){
  return `[ngClass]="{'is-invalid': ${formControlName}.invalid && ${formControlName}.dirty, 'is-valid': ${formControlName}.valid && ${formControlName}.dirty}"`
}

radioErrorClass(formControlName){
  return `[ngClass]="{'is-invalid': ${formControlName}.invalid, 'is-valid': ${formControlName}.valid}"`
}

radioErrorsGroup(formControlName, label){
  return `<div class="invalid-feedback" *ngIf="${formControlName}.errors">
     <p *ngIf="${formControlName}.errors.required">${label} is required</p>
   </div>`
 }



}
