import { Child } from './../data/child.interface';
import { Project } from '../data/project.interface';
import { Injectable } from '@angular/core';
import { ProjectServices } from './project.service';
import { Template } from './template.service';
import { HelperService } from './helper.service';
import { Comp } from '../data/comp.interface';
import { ProjectsServices } from './projects.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  
  project: Project;

constructor(private projectsService: ProjectsServices, public temp: Template, public help: HelperService) { 
  this.projectsService.projectObservable.subscribe(
    result => {
      this.project = result;
    }
  )
}

setModule(component: Comp, canActivate): any {
  //console.log(JSON.parse(JSON.stringify(this.project.routes)))
  //console.log(component)
  this.project.components[component.moduleIndex].imports += this.temp.importOfModule(component.upName, component.name, component.altPath);

    // @NgModule({imports: [current+Module]}) for parent.module
  this.project.components[component.moduleIndex].ngModuleImports += component.upName + 'Module,\n';  // for parent.module NgModule->imports
  if (component.routingModule) {
    component.imports += this.temp.importOfRoutingModule(component.upName, component.name); 
    let routeIndex = this.help.getMainIndex(component.parentModuleId, this.project.routes);
    const parent = this.help.getInRouteParent(component.pathArray);
    const grandParent = this.help.getInRouteParent(this.project.components[parent.index].pathArray);
    if (routeIndex === -1) {
      this.project.routes.push({name: parent.name, id: parent.id, parent: grandParent.name, parentId: grandParent.id, index: parent.index, upName: parent.upName, children: []});
    }
  } else {// if not lazy or not routing and component then add tag to parentcomponent
    if (component.component) {
      const html = '<app-' + component.name + '></app-' + component.name + '>\n';
      if (this.project.components[component.parentIndex].component) {
        this.project.components[component.parentIndex].htmlChildren += html;
      } else {
        const index = this.help.getComponentParent(component.pathArray);
        this.project.components[index].htmlChildren += html;
      }
    }
  }



  if (component.component){
    component.imports += this.temp.importOfLazyComponent(component.upName, component.name, '');
    component.declarations += component.upName + 'Component' + ', '; 
  }
}
}
