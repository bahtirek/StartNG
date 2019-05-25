import { ChildRoute } from './../data/childRoute.interface';
import { Project } from '../data/project.interface';
import { Injectable } from '@angular/core';
import { Template } from './template.service';
import { HelperService } from './helper.service';
import { Comp } from '../data/comp.interface';
import { ProjectsServices } from './projects.service';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {
  

  project: Project;

constructor(private projectsService: ProjectsServices, public temp: Template, public help: HelperService) { 
  this.projectsService.projectObservable.subscribe(
    result => {
      this.project = result;
    }
  )
}

  setComponent(component: Comp, canActivate): any {
    let importIndex = component.parentIndex;
    if(component.parentIndex !== component.moduleIndex) importIndex = component.moduleIndex;
    

    // import { current name } from 'somepath' -- for current.module.ts

    this.project.components[importIndex].imports += this.temp.importOfComponents(component.upName, component.name, component.altPath);
    this.project.components[importIndex].declarations += component.upName + 'Component' + ', '; // parent module
    
    if(component.inRouter && !component.lazyLoading && !component.isDefaultComponent) {
      this.project.components[importIndex].importsForRoutingFile += this.temp.importOfComponents(component.upName, component.name, component.altPath);
      this.addLink(component); 
      this.pushToRoutes(component, canActivate);
    } else {
      if (!component.lazyLoading || !component.isDefaultComponent) {
        this.addComponent(component);
      } 
    }
  }

  async pushToRoutes(component: Comp, canActivate){
    //console.log(JSON.parse(JSON.stringify(this.project.routes)))
    //console.log(component.name)
    const route = this.temp.regularRouteCanActivate(component.name, component.upName, canActivate);
    const parent = this.help.getInRouteParent(component.pathArray); // first Inroute parent
    const grandParent = this.help.getInRouteParent(this.project.components[parent.index].pathArray);  // first Inroute grandparent
    const index = this.help.getMainIndex(parent.id, this.project.routes);
    //console.log(route)
    const child: ChildRoute = {
      name: component.name,
      parent: parent.name,
      path: component.altPath,
      route: route,
      canActivate: canActivate,
      upName: component.upName
    }
    
    if (index === -1) { // if inRouteParnt not in routes then push parent also
      this.project.routes.push({name: parent.name, id: parent.id, parent: grandParent.name, parentId: grandParent.id, index: parent.index, upName: parent.upName, children: [child]});
    } else {
      this.project.routes[index].children.push(child);
    }
    //console.log(JSON.parse(JSON.stringify(this.project.routes)))
  }

  addLink(component: Comp): any {
    let link = '';
    link = this.temp.links(component.name, component.name);
    if (this.project.components[component.parentIndex].component) {// if parent is component
      this.project.components[component.parentIndex].links += link;
    } else {
      const index = this.help.getComponentParent(component.pathArray);
      this.project.components[index].links += link;
    }
  }

  addComponent(component: Comp): any {
    const html = '<app-' + component.name + '></app-' + component.name + '>\n';
    if (this.project.components[component.parentIndex].component) {
      this.project.components[component.parentIndex].htmlChildren += html;
    } else {
      const index = this.help.getComponentParent(component.pathArray);
      this.project.components[index].htmlChildren += html;
    }
  }



}
