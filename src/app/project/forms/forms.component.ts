import { HeaderService } from '../../services/header.service';
import { Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import { ActivatedRoute, Params} from '@angular/router';
import { HelperService } from '../../services/helper.service';
import { Comp } from '../../data/comp.interface';
import { FormsData } from '../../data/forms.interface';
import { ProjectsServices } from '../../services/projects.service';
import { Project } from '../../data/project.interface';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {

  componentId: number;
  component: Comp;
  formsData: FormsData[] = [];
  project: Project;
  editing: boolean = false;
  projectName: any;
  formFields: FormsData = {label: '', propertyName: '', placeholder: '', inputType: 'text', required: false, minLength: '', maxLength: '', value: ''};

  propertyNameExist: boolean = false;
  editingIndex = 0;
  saveProject: boolean = false;
  minMax: boolean = true;
  value: boolean = false;
  phoneFormatString = '';
  phoneFormatStringElse: string;


  constructor(private header: HeaderService,private location: Location, private projectsService: ProjectsServices, private route: ActivatedRoute, private help: HelperService) { }


  ngOnInit() {
    this.project = this.projectsService.getProjectFromLoc();
    this.route.params
    .subscribe(
      (params: Params) => {
        this.componentId = parseInt(params['id']);
        this.projectName = params['project'];
        const index = this.help.getMainIndex(this.componentId);
        this.component = this.project.components[index];
        if (this.component.forms) {
          this.formsData = this.component.forms
        } else {
          this.component.forms = [];
        }
      }
    );
    this.header.setIsComponent(true);
    if (this.project.phoneFormat) {
      this.phoneFormatStringElse = this.project.phoneFormat;
      this.phoneFormatString = this.project.phoneFormat;
    }
  }

  
  ngOnDestroy(): void {
    if (this.saveProject) {
      this.projectsService.saveProject();
    }
  }

  saveField(){
    if (this.editing) {
      this.updateField();
      this.editingIndex = 0;
    } else {
      this.addField();
    }
  }

  addField(){
    const index = this.help.getIndex(this.component.forms, 'propertyName', this.formFields.propertyName);
    if (index === -1 || this.formFields.inputType === 'radio') {
      if(this.formFields.inputType === 'phone') {
        this.phoneFormat();
        this.component.phoneFormat = true;
      }
      this.formFields.propertyName = this.formFields.propertyName.replace(/\s/g,'');
      this.component.forms.push(this.formFields);
      this.reset();
      this.projectsService.saveToLoc(this.project);
      this.projectsService.saveProject();
      this.saveProject = true;
      this.minMax = true;
      this.value = false;
      this.phoneFormatStringElse = this.phoneFormatString;
    } else {
      this.propertyNameExist = true;
    }
  }

  updateField(){
    this.formFields.propertyName = this.formFields.propertyName.replace(/\s/g,'');
    if (this.formFields.propertyName !== this.component.forms[this.editingIndex].propertyName) {
      const index = this.help.getIndex(this.component.forms, 'propertyName', this.formFields.propertyName);
      if (index !== -1 || !(this.formFields.inputType === 'radio')) {
        this.propertyNameExist = true;
        return false;
      }
    }
    if(this.formFields.inputType === 'phone') {
      this.phoneFormat();
      this.component.phoneFormat = true;
    }
    this.component.forms[this.editingIndex] = this.formFields;
    this.projectsService.saveToLoc(this.project);
    this.editing = false;
    this.editingIndex = undefined;
    this.reset();
    this.saveProject = true;
    this.minMax = true;
    this.value = false;
    this.phoneFormatStringElse = this.phoneFormatString;
  }

  editField(index, inputType){
    this.editing = true;
    this.editingIndex = index;
    const fields = this.component.forms[this.editingIndex];
    this.onInputTypeChange(inputType);
    this.saveProject = true;
    this.formFields = {label: fields.label, propertyName: fields.propertyName, placeholder: fields.placeholder, inputType: fields.inputType, required: fields.required, minLength: fields.maxLength, maxLength: fields.minLength, value: fields.value};
  }

  remove(index){
    this.component.forms.splice(index, 1);
    this.projectsService.saveToLoc(this.project);
    this.saveProject = true;
  }
  
  cancel() {
    if (this.editing) { //if editing dont go back
      this.editing = false;
      this.editingIndex = 0;
      this.reset();
    } else {
      this.location.back();
    }
  }

  reset(){
    if (this.editing) {
      const fields = this.component.forms[this.editingIndex];
      this.formFields = {label: fields.label, propertyName: fields.propertyName, placeholder: fields.placeholder, inputType: fields.inputType, required: fields.required, minLength: fields.maxLength, maxLength: fields.minLength, value: fields.value};
    } else {
      this.formFields = {label: '', propertyName: '', placeholder: '', inputType: 'text', required: false, minLength: '', maxLength: '', value: ''};
    }
  }

  onInputTypeChange (inputType) {
    switch (inputType) {
      case 'checkbox': this.minMax = false; break;
      case 'radio': this.minMax = false; this.value = true; break;
      case 'date': this.minMax = false; break;
      case 'color': this.minMax = false; break;
      case 'select': this.minMax = false; break;
      case 'file': this.minMax = false; break;
      case 'phone': this.minMax = false; this.value = false; break;
      default: this.minMax = true; this.value = false; break;
    }
  }

  placeholderOnFocus(label){
    this.formFields.placeholder = label;
  }

  valueOnFocus(label){
    this.formFields.value = label;
  }

  phoneFormat(){
    //console.log(formatString)
    let pattern = ''
    let formatOne = '';
    let formatTwo = '';
    let digitCount = 0;
    let charCount = 1;
    let slash = '';
    for (var i = 0; i < this.phoneFormatString.length; i++) {
      let char = this.phoneFormatString.charAt(i);
      if (char === '*') {
        digitCount++;
      } else {
        if (char === '(' || char === ')') slash = '\\';
        if (digitCount > 0) {
          formatOne += '(\\d{' + digitCount + '})';
          formatTwo += '$' + charCount + char ;
          pattern +=  '\\d{' + digitCount + '}' + slash +char;
          slash = '';
          charCount++;
          digitCount = 0;
        } else {
          formatTwo += char;
          pattern += slash + char;
          slash = '';
        }
      }
      if (i === this.phoneFormatString.length-1){
        if (digitCount > 0) {
          formatOne += '(\\d{' + digitCount + '})';
          pattern +=  '\\d{' + digitCount + '}';
          digitCount = 0;
          formatTwo += '$' + charCount;
        }
        this.project.phoneFormat = this.phoneFormatString;
        this.project.phone = {formatOne:formatOne, formatTwo: formatTwo, length: this.phoneFormatString.length};
        this.formFields.pattern = '/' + pattern + '/';
        this.formFields.maxLength = this.project.phoneFormat.length.toString();
      }
    }
  }

  editPhoneFormat(){
    this.phoneFormatString = '';
    this.phoneFormatStringElse = '';
  }
}
