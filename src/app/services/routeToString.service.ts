import { RouteForModule } from './../data/routeForModule.interface';
import { Injectable } from '@angular/core';
import { Project } from '../data/project.interface';
import { HelperService } from './helper.service';
import { Template } from './template.service';
import { ProjectsServices } from './projects.service';

@Injectable({
  providedIn: 'root'
})
export class RouteToStringService {

  project: Project;
  routes: RouteForModule[];

  constructor(private projectsSevice: ProjectsServices, public temp: Template, public help: HelperService) { 
    this.projectsSevice.projectObservable.subscribe(
      result => {
        this.project = result;
        this.routes = this.project.routes;
      }
    )
  }



  routeToString(module: RouteForModule) {
    if (this.project.routes.length === 0) return true;
    if (this.project.routes.length === 1) this.setRoute(module);
    const isParent = this.project.routes.findIndex((component) => {
      //console.log(component)
      return component.parentId === module.id
    }); //check if this module is parent of any other from routes array
    //console.log(isParent)
    if (isParent !== -1 && this.project.routes.length > 1 && module.index !== 0) {
      //console.log(JSON.parse(JSON.stringify(module)))
      this.project.routes.push(this.project.routes.shift());
      this.routeToString(this.project.routes[0]);
    } else if (isParent === -1 && this.project.routes.length > 1 && module.index !== 0) {
      //console.log(JSON.parse(JSON.stringify(module)))
      this.setRoute(module);
    } else if (this.project.routes.length > 1 && module.index === 0) {
      //console.log(JSON.parse(JSON.stringify(module)))
      this.project.routes.push(this.project.routes.shift());
      this.routeToString(this.project.routes[0]);
    } else if (this.project.routes.length === 1 && module.index === 0) {
      //console.log(JSON.parse(JSON.stringify(module)))
      this.setRoute(module);
    }
  }



setRoute(module){
  let route = '';
  let canActivate = '';
  let count = 0;
  const indexInRoutes = this.help.getMainIndex(module.id, this.project.routes);
  const parentIndex = this.help.getMainIndex(module.parentId, this.project.routes);
  if (this.project.components[module.index].authentication) canActivate = 'canActivate: [AuthGuard],';
  if (this.project.components[module.index].childAuthentication) canActivate += ' canActivateChild: [AuthGuard],';
  if (module.children.length === 0 ) {// remove module if empty
    if (this.project.components[module.index].lazyLoading) {
      //console.log(module)
      route = this.temp.defaultLazyRouteCanActivate(module.upName, canActivate);
      this.project.components[module.index].routes += route; 
      
    }
    //console.log(module)
    this.project.routes.splice(indexInRoutes, 1);
    this.routeToString(this.project.routes[0]);
  }
  //console.log(JSON.parse(JSON.stringify(this.project.routes)))
  for (const component of module.children) {
    route += component.route;
    count++;
    if (count === module.children.length){
      //console.log(component.name)
      //console.log(this.project.components[module.index])
      if (this.project.components[module.index].lazyLoading) {
        //console.log(route)
        route = this.temp.lazyRouteWithChildren(module.upName, canActivate, route);
        this.project.components[module.index].routes = route;
        // update parent's route
        //console.log(module.upName, canActivate, route)
        this.project.routes.splice(indexInRoutes, 1);
        this.routeToString(this.project.routes[0]);
      } else if (this.project.components[module.index].routingModule){
        //console.log(JSON.parse(JSON.stringify(this.project.routes[1])))
        this.project.components[module.index].routes = route;
        //const parentIndex = this.help.getMainIndex(module.parentId, this.project.routes);    //dobavil dva slesha on4-18           // remove
        //const index = this.help.getMainIndex(module.id, this.project.routes[parentIndex].children); //on4-18 // from parents
        //this.project.routes[parentIndex].children.splice(index, 1); 
        //console.log(JSON.parse(JSON.stringify(this.project.routes[1])))                                       // route
        this.project.routes.splice(indexInRoutes, 1);
        this.routeToString(this.project.routes[0]);

      } else if (module.name === 'app') {
        //console.log(JSON.parse(JSON.stringify(module)))
        this.project.components[module.index].routes = route;
        this.project.routes.splice(indexInRoutes, 1);
        return true;
      } else {
        //console.log(module.name)
        const indexInChildren = this.help.getComponentIndex(module.name, this.project.routes[parentIndex].children);
        route = this.temp.routeWithChildren(module.name, module.upName, canActivate, route);
        this.project.routes[parentIndex].children[indexInChildren].route = route;
        this.project.components[module.index].routes = route;
        this.project.routes.splice(indexInRoutes, 1);
        this.routeToString(this.project.routes[0]);
      }
    }
  }
}


}
