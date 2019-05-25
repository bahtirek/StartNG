import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormTemplateService {

constructor() { }



ts (name, componentName, properties, formControls, formGroup, css) {
  return `
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
selector: 'app-${name}',
templateUrl: './${name}.component.html',
styleUrls: ['./${name}.component.${css}']
})
export class ${componentName}Component implements OnInit {

myForm: FormGroup;
${properties}

constructor() { }

ngOnInit() {
  this.createFormControls();
  this.createForm();
}

createFormControls(){
  ${formControls}
}

createForm() {
  this.myForm = new FormGroup({
    ${formGroup}
  });
}

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
  return `${propertyName}: FormControl;\n`
}

//formControls sozdayom pluyusuya formcontroly

createFormControl(propertyName, validators){
  return `this.${propertyName} = new FormControl('', [${validators}]),\n`
}

//validators sozdayom plyusuya validatory


validator(type){
return `Validators.${type}, `
}
//dlya email validator peredayom pattern(/[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i)

//fromgroup sozdayom plyusuya formgropu

createFormGroup(propertyName) {
  return `${propertyName}: this.${propertyName},\n`
}


}
