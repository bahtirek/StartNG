import { Project } from '../data/project.interface';
import { Injectable, Component } from '@angular/core';
import { ProjectServices } from './project.service';
import { Template } from './template.service';
import { HelperService } from './helper.service';
import { Comp } from '../data/comp.interface';
import { ProjectsServices } from './projects.service';

@Injectable({
  providedIn: 'root'
})
export class LazyService {
  
  project: Project;

constructor(private projectsService: ProjectsServices, public temp: Template, public help: HelperService) { 
  this.projectsService.projectObservable.subscribe(
    result => {
      this.project = result;
    }
  )
}

  setLazy(component: Comp, canActivate, canLoad){
    //console.log(JSON.parse(JSON.stringify(this.project.routes)))
    //console.log(component)
    let path = '';
    let upName = component.upName
    component.imports += this.temp.importOfRoutingModule(component.upName, component.name); 

    // link
    const link = this.temp.links(component.name, component.name);
    if (this.project.components[component.parentIndex].component) {// if parent is component
      this.project.components[component.parentIndex].links += link;
    } else {
      const index = this.help.getComponentParent(component.pathArray);
      this.project.components[index].links += link;
    }

    //imports
    if (!component.component ) {
      if (component.defaultComponentId === undefined || component.defaultComponentId ===0) {
        const isExist = this.help.isComponentExist(component.name, 'component', component.children);
        //console.log(isExist)
        if (isExist === -1) {
          component.component = true;
        }
      }
    }
    if (component.component) {
      //console.log(component)
      component.imports += this.temp.importOfLazyComponent(component.upName, component.name, '');
      component.importsForRoutingFile += this.temp.importOfLazyComponent(component.upName, component.name, component.altPath);
      component.declarations += component.upName + 'Component' + ', '; 
    } else if (component.defaultComponent) {
      //console.log(component)
      const defaultComponent = this.help.getComponent(component.defaultComponentId);
      const pathLength = defaultComponent.pathArray.length - component.pathArray.length;
      if (pathLength > 1) {
        const pathArray = defaultComponent.pathArray.splice(0, pathLength);
        for (const pathItem of pathArray) {
          path += pathItem + '/';
        }
      }
      component.imports += this.temp.importOfComponents(defaultComponent.upName, defaultComponent.name, path);
      component.importsForRoutingFile += this.temp.importOfComponents(defaultComponent.upName, defaultComponent.name, path);
      component.declarations += defaultComponent.upName + 'Component' + ', ';
      upName = defaultComponent.upName;
    }


    //routes sam sebya v parent routing
    //console.log(JSON.parse(JSON.stringify(this.project.routes)))
    this.pushToRoutes(component, canActivate, canLoad, upName);
    //console.log(JSON.parse(JSON.stringify(this.project.routes)))
  }

  pushToRoutes(component: Comp, canActivate: any, canLoad, upName): any {
    //console.log(JSON.parse(JSON.stringify(this.project.routes)))
    //console.log(component.name)

    const route = this.temp.lazyRouteWithPath(component.altPath, component.name, component.upName, canLoad);
    //let routeIndex = this.help.getMainIndex(component.parentModuleId, this.project.routes);
    //let routeIndex = this.help.getMainIndex(component.parentId, this.project.routes);
    let parent = this.help.getInRouteParent(component.pathArray); // first Inroute parent
    let routeIndex = this.help.getMainIndex(parent.id, this.project.routes);
    //console.log(parent)
    let child = { 
      name: component.name,
      parent: parent.name,
      path: component.altPath,
      route: route,
      canActivate: canActivate,
      upName: component.upName
    }
    //console.log(routeIndex)
    let grandParent = this.help.getInRouteParent(this.project.components[parent.index].pathArray);
    if (routeIndex === -1) {
      
      //console.log(JSON.parse(JSON.stringify(this.project.routes)))
      //console.log(JSON.parse(JSON.stringify(component)))
      this.project.routes.push({name: component.parent, id: component.parentId, parent: grandParent.name, parentId: grandParent.id, index: parent.index, upName: parent.upName, children: [child]});
    
    } else {
      //console.log(JSON.parse(JSON.stringify(this.project.routes)))
      this.project.routes[routeIndex].children.push(child);
    }

    routeIndex = this.help.getMainIndex(component.id, this.project.routes);
    if (routeIndex === -1) {
      //console.log(JSON.parse(JSON.stringify(this.project.routes)))
      this.project.routes.push({name: component.name, id: component.id, parent: parent.name, parentId: parent.id, index: component.index, upName: upName, children: []});
    } else {
      //console.log(JSON.parse(JSON.stringify(this.project.routes)))
      this.project.routes[routeIndex].upName = upName;
    }
  }

}
