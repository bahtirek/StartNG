import { FormsService } from './forms.service';
import { Child } from './../data/child.interface';
import { Project } from '../data/project.interface';
import { Injectable } from '@angular/core';
import { ProjectServices } from './project.service';
import { Template } from './template.service';
import { HelperService } from './helper.service';
import { Comp } from '../data/comp.interface';
import { LazyService } from './lazy.service';
import { ComponentService } from './component.service';
import { ModuleService } from './module.service';
import { ProjectsServices } from './projects.service';

@Injectable({
  providedIn: 'root'
})
export class SetModuleService {

  project: Project;
  componentName: string;

constructor(private forms: FormsService, private projectsService: ProjectsServices, public temp: Template, public help: HelperService, public lazyService: LazyService, public moduleService: ModuleService, public componentService: ComponentService) { 
  this.projectsService.projectObservable.subscribe(
    result => {
      this.project = result;
      //console.log(this.project)
    }
  )
}

async setupModules(component: Comp) {
  const index = this.help.getMainIndex(component.id);
  let canActivate = '';
  let canLoad = '';
  if (component.id === 0) {
    this.project.routes.push({name: 'app', id: 0, parent: '', index: 0, parentId: 0, upName: 'App', children: []});
  } else {
    
    // get parent's index
    const parentIndex = this.help.getMainIndex(component.parentId);
    
    // get parent module's index
    const moduleIndex = this.help.getMainIndex(component.parentModuleId);
    const isParentFolder = component.parentFolder === '' ? false : true;

    component.parentIndex = parentIndex;
    component.moduleIndex = moduleIndex;
    component.altPath = this.setPath(component, parentIndex, moduleIndex);
    component.isParentFolder = isParentFolder;
    component.index = index;
    if (isParentFolder) {
      // get difference between parent path and current component path
      component.folderPath = component.path.slice(this.project.components[parentIndex].path.length);
    }
    if(component.authentication || component.childAuthentication) {
      this.project.components[moduleIndex].authGuardImport = true;
      canActivate =  'canActivate: [AuthGuard],';
      if (component.module) {
        component.authGuardImport = true;
      } else {
        this.project.components[moduleIndex].authGuardImport = true;
      }
      if (component.lazyLoading)  canLoad = 'canLoad: [AuthGuard],';
    }

    if (component.lazyLoading) {
      this.lazyService.setLazy(component, canActivate, canLoad);
    } else if (component.module) {
      this.moduleService.setModule(component, canActivate);
    } else if (component.component && !component.isDefaultComponent && !component.lazyLoading) {
      //console.log(component.name)
      this.componentService.setComponent(component, canActivate);
    }
    if(component.forms && component.forms.length > 0) {
      this.forms.setForms(component, component.formBuilder, this.project.formsUI, this.project.scss);
      if (component.module) {
        component.reactiveFormsModule = true;
      } else {
        this.project.components[component.moduleIndex].reactiveFormsModule = true;
      }
    }

    if (component.phoneFormat) {
      let path = this.help.getRelativePath(this.project.components[component.moduleIndex].path, '');
      if (component.module) {
        path = this.help.getRelativePath(component.path, '');
        component.imports += this.temp.phoneDirectiveImport(path);
        component.ngModuleImports += 'DirectivesModule, ';
      } else {
        this.project.components[moduleIndex].imports += this.temp.phoneDirectiveImport(path);
        this.project.components[moduleIndex].ngModuleImports += 'DirectivesModule, ';
      }
    }
  }
}

setPath(component: Comp, parentIndex, moduleIndex) {
  let path = component.path.slice(this.project.components[parentIndex].path.length);
  if (moduleIndex === 0) {
    path = component.path.slice(4);
  }
  if (parentIndex === moduleIndex) {
    path = '';
  }
  return path;
 }

}

