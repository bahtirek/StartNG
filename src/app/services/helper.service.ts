import { Child } from './../data/child.interface';
import { Injectable, Component } from '@angular/core';
import { Comp } from '../data/comp.interface';
import { RouteImport } from '../data/route.interface';
import { Project } from '../data/project.interface';
import { ProjectServices } from './project.service';
import { ProjectsServices } from './projects.service';

@Injectable()

export class HelperService {

  project: Project;
  components: Comp[];

constructor(private projectsService: ProjectsServices) { 
  this.projectsService.projectObservable.subscribe(
    result => {
      this.project = result;
      this.components = result.components;
    }
  )
}


  isComponentExist(name, type, children){
    //console.log(name, type, children)
    const index: number = children.findIndex((child) => {
      return child.name === name;
    });
    //console.log(index)
    if (index === -1) {
      if (type === 'component') {
        const index: number = this.components.findIndex((component) => {
          return (component.name === name && component.component);
        });
        //console.log(index)
        return index;
      } else if (type === 'module') {
        const index: number = this.components.findIndex((component) => {
          return (component.name === name && component.module);
        });
        //console.log(index)
        return index;
      } else {
        return index;
      }
    } else {
      //console.log(index)
      return index;
    }
    
  }


  getIndex(arr, what, name) {
    const position = arr.findIndex((item) => {
      return item[what] === name;
    });
    return position;
  }

  getComponentIndex(componentName, components) {
    const index: number = components.findIndex((component) => {
      return component.name === componentName;
    });
    return index;
  }

  getMainIndex(id, array?) {
    if (!array) {
      array = this.project.components
    }
    const index: number = array.findIndex((component) => {
      return component.id === id;
    });
    return index;
  }

  getComponent(id) {
    const index: number = this.project.components.findIndex((component) => {
      return component.id === id;
    });
    return this.project.components[index];
  }


  async asyncGetComponentIndex(componentName, components) {
    const index: number = components.findIndex((component) => {
      return component.name === componentName;
    });
    return index;
  }


  setComponentName2(name: string) {
    name = name.charAt(0).toUpperCase() + name.slice(1);
    const index = name.indexOf('-');
    if (index !== -1) {
      name = name.slice(0, index) + name.charAt(index + 1).toUpperCase() + name.slice(index + 2);
      this.setComponentName(name);
    } else {
      return(name + 'Component');
    }
  }


   setComponentName(name: string) {
    name = name.charAt(0).toUpperCase() + name.slice(1);
    const index = name.indexOf('-');
    //console.log(name)
    if (index !== -1) {
      name = name.slice(0, index) + name.charAt(index + 1).toUpperCase() + name.slice(index + 2);
      this.setComponentName(name);
    } else {
      //console.log(name)
      return(name + 'Component');
    }
  }

  fixComponentName(name) {
    name = name.trim();
    name = name.replace(/\s+/g, '-');
    return name;
  }

  getChildren(id, components) {
    //console.log(components)
    const promise = new Promise(
      function (resolve, reject) {
        let children: any[] = [];
        for (let i = 0; i < components.length; i++) {
          const component = components[i];
          if (component !== undefined) {
            if ( component.pathArray.indexOf(id) !== -1 ) {
              children.push({id: component.id, index: i});
            }
          }
          if (i === components.length - 1) {
            resolve(children);
          }
        }
    });
    return promise;
  }

  getInRouteChildren(name: string, components: Comp[]) {
    const self = this;
    const promise = new Promise(
      function (resolve, reject) {
        let childrenInRoute: string[] = [];
        let childrenInRoute2: RouteImport[] = [];
        let lazy = false;
        let belongs = false;
        let proba = '';
        for (let i = 0; i < components.length; i++) {
          const child: Comp = components[i];
          if ( child.parentModule === name  && child.inRouter === true) {
            childrenInRoute.push(child.name);
            let parent = child.parent;
            if(child.module !== true) {
              if(child.lazyLoading === true) {
                lazy = true;
              }
              if (child.path.substring(child.path.length - name.length - 1, child.path.length - 1) === name) {
                belongs = true;
              }
              const parentIndex = self.getComponentIndex(child.parent, components);
              if (components[parentIndex].inRouter === false) {
                parent = self.getInRouterParent(name, components);
              }
              childrenInRoute2.push({name: child.name, index: i, lazy: lazy, parent: parent, path: child.path, belongs: belongs});
            }
            belongs = false;
          }
          if (i === components.length - 1) {
            resolve(childrenInRoute2);
          }
        }
    });
    return promise;
  }

  getInRouterParent(name, components: Comp[]){
    const parentIndex = this.getComponentIndex(name, components);
    if (components[parentIndex].inRouter === true) {
      return components[parentIndex].name;
    } else {
      this.getInRouterParent(name, components);
    }
  }

  getComponentParent(pathArray){
    let index: number;
    for (let i = pathArray.length - 1; i >= 0 ; i--) {
      const parentId = pathArray[i];
      if (parentId === 0) return 0;
      index = this.getMainIndex(parentId);
      if (this.project.components[index].component) {
        return index;
      } else if (this.project.components[index].lazyLoading) {
        index = this.getMainIndex(this.project.components[index].defaultComponentId);
        return index;
      }
    }
    
  }

  getInRouteParent(pathArray){
    if (pathArray.length === 0) return {index:0, name: 'app'};
    for (let i = pathArray.length - 1; i >= 0 ; i--) {
      const parentId = pathArray[i];
      //console.log(parentId)
      if (parentId === 0) return {index:0, name: 'app', id: 0, upName: 'App'};
      const index = this.getMainIndex(parentId);
      const parent = this.project.components[index];
      if (parent.lazyLoading || parent.routingModule) return { index:index, name: parent.name, id: parentId, upName: parent.upName };
      if (parent.inRouter) return { index: index, name: parent.name, id: parentId, upName: parent.upName};
    }

  }

  
  getRelativePath(path: string, parentModulePath: string): any {
    let altPath = './';
    let pathArray: string[];
    if(parentModulePath === '') {
      pathArray = path.split('/');
    } else {
      path = path.slice(parentModulePath.length);
      pathArray = path.split('/');
    }
    for (let i = 0; i < pathArray.length-1; i++) {
      altPath += '../';   
    if(i === pathArray.length -2){
      return altPath;
    }
  }
  }

}
