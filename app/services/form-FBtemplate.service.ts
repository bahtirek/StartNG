import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormFBtemplateService {

constructor() { }

ts (name, componentName, properties, formControls, formGroup, css) {
  return `
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
selector: 'app-${name}',
templateUrl: './${name}.component.html',
styleUrls: ['./${name}.component.${css}']
})
export class ${componentName}Component implements OnInit {

myForm: FormGroup;


constructor(private fb: FormBuilder) { }

ngOnInit() {
  this.myForm = this.fb.group({
    ${formControls}
  });
}

${properties}

onSubmit(){
  if(this.myForm.valid){
    console.log(this.myForm)
  } 
}

onReset(){
  this.myForm.reset();
}

}

`;
}

//properties sozdayom plyusuya property

property(propertyName){
  return `
  get ${propertyName}() {
    return this.myForm.get('${propertyName}');
  }
  `
}

createFormControl(propertyName, validators){
  return `${propertyName}: ['', [${validators}]],\n`
}

validator(type){
return `Validators.${type}, `
}

createFormGroup(propertyName) {
  return `${propertyName}: this.${propertyName},\n`
}

}
