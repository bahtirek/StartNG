import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormNoUIService {

constructor() { }


form(formGroups){
  return `
<form [formGroup]="myForm" (ngSubmit)="onSubmit()" novalidate>
  ${formGroups}
  <div class="mt-4">
    <button type="submit"  [disabled]="myForm.invalid">Submit</button>
    <button type="button"   (click)="onReset()">Reset</button>
  </div>
</form>
  `
}


/* FORM GROUP */


formGroup(formControlName, label, errorsGroup, placeHolder, phone){
  return `
<div class="form-group" >
  <label for="${formControlName}">${label}</label>
  <input type="${formControlName}" id="${formControlName}" formControlName="${formControlName}" placeholder="${placeHolder}" ${phone}>
  ${errorsGroup}
</div>`
}

textarea(formControlName, label, errorsGroup, placeholder){
  return `
<div class="form-group">
  <label for="${formControlName}">${label}</label>
  <textarea rows="5" id="${formControlName}" placeholder="${placeholder}" formControlName="${formControlName}"></textarea>
  ${errorsGroup}
</div>`
}



select(formControlName, label, errorsGroup){
  return `
<div class="form-group">
  <label for="${formControlName}">${label}</label>
  <select id="${formControlName}" formControlName="${formControlName}">
  <option>...</option>
  </select>
  ${errorsGroup}
</div>`
}

file(formControlName, label, errorsGroup){
  return `
<div class="form-group" >
  <label for="${formControlName}">${label}</label>
  <input type="${formControlName}" id="${formControlName}" formControlName="${formControlName}">
  ${errorsGroup}
</div>`
}

radio(formControlName, label, value, errorsGroup){
  return `
<div class="form-check">
  <input type="${formControlName}" id="${value}" value="${value}" formControlName="${formControlName}">
  <label for="${value}">${label}</label>
  ${errorsGroup}
</div>`
}


/* END OF FORM GROUP */

errorsGroup(formControlName, errors){
  return `<div *ngIf="${formControlName}.errors && (${formControlName}.dirty || ${formControlName}.touched )">
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

radioErrorsGroup(formControlName, label){
  return `<div class="invalid-feedback" *ngIf="${formControlName}.errors">
      <p *ngIf="${formControlName}.errors.required">${label} is required</p>
    </div>`
 }

}


