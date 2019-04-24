import { EditComponentName } from './../../data/editComponentName';
import { HelperService } from './../../services/helper.service';
import { Component, OnInit } from '@angular/core';
import { Project } from '../../data/project.interface';
import { Comp } from '../../data/comp.interface';
import { ActivatedRoute, Params } from '@angular/router';
import auth from '../../data/auth';
import { HeaderService } from '../../services/header.service';
import { ProjectsServices } from '../../services/projects.service';
import { componentFactoryName } from '@angular/compiler';

@Component({
  selector: 'app-component',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.css']
})
export class ComponentComponent implements OnInit {

  project: Project;
  component: Comp;
  newChildName = '';
  showDeleteComponentModal = {show: false, id: 0, name: '', index: 0};
  componentExistModal = false;
  //editName = false;
  editingNameChildIndex: any;
  editingNameProjectIndex: any;
  parentComponent: Comp;
  routerModal = false;
  componentName: any;
  //inRouter: any; // this component linked to roter-outlet
  childInRouter = false;
  authByParent: boolean;
  isModule = 'component';
  components: Comp[];
  auth = auth;
  componentType = 'folder';
  upName: string;
  componentId: number;
  editComponentName: EditComponentName = {show: false, name: ''};
  componentNameNumberModal: boolean;
  altParent: Comp;
  
  

  constructor(private projectsService: ProjectsServices, private route: ActivatedRoute, private help: HelperService, public header: HeaderService) {
  }

  ngOnInit() {
    this.project = this.projectsService.currentProject;
    this.components = this.project.components;
    this.componentId = parseInt(this.route.snapshot.params['component']); // first init before oservable subscribe
    this.componentSetup();
    this.component = this.project.components[this.componentId];
    //console.log(JSON.stringify(this.project))
    //console.log(this.project)
    //console.log(this.route.snapshot)
    this.route.params
      .subscribe(
        (params: Params) => {
          this.componentId = parseInt(params['component']);
          //console.log(this.componentId)
          const index = this.help.getMainIndex(this.componentId);
          this.component = this.project.components[index];
          const parentIndex = this.help.getMainIndex(this.component.parentId);
          this.parentComponent = this.project.components[parentIndex];
          if (this.component.altParent) {
            const altIndex = this.help.getComponentIndex(this.component.altParent, this.components);
            this.altParent = this.components[altIndex];
          }
        }
      );
    this.header.setIsComponent(true);
    this.header.componentChanged = false;
  }

  ngOnDestroy(): void {
    this.header.setIsComponent(false);
  }

  updateProject() {
    this.projectsService.saveToLoc(this.project);
    this.header.componentChanged = true;
  }



  componentSetup() {
    if (this.project.components.length === 0) { // if project new first component will be the App.component
      this.component = {
        id: 0,
        name: 'app',
        upName: 'App',
        siblingInteraction: [],
        folder: false,
        component: false,
        module: true,
        routingModule:false,
        lazyLoading: false,
        authentication: false,
        path: '',
        router: false,
        parentModule: 'app',
        parentModuleId: 0,
        children: [{name: "auth", inRouter: false, authentication: false, id: 1}],
        parent: '',
        parentId: 0,
        parentAuth: false,
        childAuthentication: false,
        routes: '',
        declarations: '',
        imports: '',
        importsForRoutingFile: '',
        ngModuleImports: '',
        links: '',
        htmlChildren: '',
        inRouter: false,
        exports: '',
        pathArray: [],
      };
      this.project.components.push(this.component);
      this.project.components.push(this.auth.auth);
      this.project.components.push(this.auth.login);
      this.project.components.push(this.auth.signup);
      this.updateProject(); // update project for project-map view
    } else {
      // setting current component from all components by name from link snapshot
      this.component = this.project.components[this.help.getComponentIndex(this.componentName, this.project.components)];
    }
  }



///                      SET type 

  typeCheckbox(val, type){
    // console.log(val, type)
    // console.log(this.component)
    if (!val) {
      this.switchType(val, type)
    } else {
      const index = this.help.isComponentExist(this.component.name, type, this.component.children);
      if (index === -1) {
        this.switchType(val, type);
      } else {
        if (this.component.module && (type === 'routing' || type === 'lazy')){
          this.switchType(val, type);
        }
        if (this.component.component && (type === 'routing' || type === 'lazy' || type === 'module')) {
          this.switchType(val, type);
        }
        if (type === 'component' && this.component.lazyLoading && val) {
          this.switchType(val, type);
        }
        //this.setFolderType(val);
      }
    }
  }

  switchType(val, type){
    switch(type) {
      case 'folder': this.setFolderType(val);
        break;
      case 'component': this.setComponentType(val);
        break;
      case 'module': this.setModuleType(val);
        break;
      case 'lazy': this.setLazyModuleType(val);
        break;
      case 'routing': this.setRoutingModuleType(val);
    }
  }

  setModuleType(val: boolean) {
    if (val === true) {
      this.setModule();
    } else {
      this.unsetModule();
    }
  }

  setRoutingModuleType(val: boolean){
    this.component.module = val;
    this.setModuleType(val);
    //console.log(val)
  }

  setLazyModuleType(val: boolean){
    this.setRoutingModuleType(val);
    console.log(this.parentComponent)
    console.log(this.component)

    // if parent is parent
    
    let index = this.help.getIndex(this.parentComponent.children, 'id', this.component.id); //get index in parent's children folder
    if (index === -1) {
      index = this.help.getIndex(this.altParent.children, 'id', this.component.id);
      this.altParent.children[index].lazy = true;
    } else {
      this.parentComponent.children[index].lazy = true;
    }
    
    if (val) {
      this.component.beforeLazy = this.component.inRouter;
      this.inRouterCheckbox(val);
    } else {
      this.onDefaultComponent('');
      this.inRouterCheckbox(this.component.beforeLazy);
    }
  }

  setComponentType(val: boolean){
    if (val === false) {
      this.inRouterCheckbox(false);
    }
    if (this.component.lazyLoading) {
      if (val) {
        this.onDefaultComponent(this.component.name);
      } else {
        this.onDefaultComponent('');
      }
      this.inRouterCheckbox(val);
    }
    this.updateProject();
    //console.log(val)
  }

  setFolderType(val: boolean){
    if (val) {
      this.component.component = false;
      this.component.module = false;
      this.component.routingModule = false;
      this.component.lazyLoading = false;
      this.unsetModule();
    }
    this.updateParents(val)
  }

  updateParents(isFolder: boolean): any {
    if (this.component.children.length > 0) {
      this.help.getChildren(this.component.id, this.components).then(
        (val: any[]) => {
          for (let i = 0; i < val.length; i++) {
            const childId = val[i].id;
            const childIndex = val[i].index;
            //if folder == true change all components when parent == this component.name to this component's parent
            if (isFolder) {
              if (this.project.components[childIndex].parent === this.component.name) {
                this.project.components[childIndex].parent = this.component.parent;
              }
            } else {
              if (this.project.components[childIndex].parent === this.component.parent) {
                this.project.components[childIndex].parent = this.component.name;
              }
            }
            if (i === val.length - 1) {
              this.updateProject();
            }
          }
        }
      );
      for (const child of this.component.children) {
        const index = this.help.getMainIndex(child.id);
        if (isFolder) {
          this.project.components[index].parentFolder = this.component.name;
          this.project.components[index].parentFolderId = this.component.id;
        } else {
          this.project.components[index].parentFolder = '';
          this.project.components[index].parentFolderId = 0;
        }
      }
    } else {
      this.updateProject();
    }
  }







///                     END OF SET type

// ***********************************************************************************

///                      SET MODULE


setModule(): any {
  this.parentComponent.router = true;
  if (this.component.children.length > 0) {
    this.help.getChildren(this.component.id, this.project.components).then(
      (val: any[]) => {
        for (let i = 0; i < val.length; i++) {
          const childIndex = val[i].index;
          if (this.project.components[childIndex].parentModuleId === this.component.parentModuleId) {
            this.project.components[childIndex].parentModuleId = this.component.id;
            this.project.components[childIndex].parentModule = this.component.name;
          }
          if (i === val.length - 1) {
            this.updateProject();
          }
        }
      }
    );
  } else {
    this.updateProject();
  }
}

unsetModule(): any {
  if (!this.component.folder) {
    this.component.component = true;
  }
  let index = this.help.getIndex(this.parentComponent.children, 'id', this.component.id);
  if (index === -1) {
    index = this.help.getIndex(this.altParent.children, 'id', this.component.id);
    this.altParent.children[index].lazy = false;
  } else {
    this.parentComponent.children[index].lazy = false;
  }
  
  if (this.component.children.length > 0) {
    this.help.getChildren(this.component.id, this.project.components).then(
      (val: any[]) => {
        for (let i = 0; i < val.length; i++) {
          const childIndex = val[i].index;
          if (this.project.components[childIndex].parentModuleId === this.component.id) {
            this.project.components[childIndex].parentModuleId = this.component.parentModuleId;
            this.project.components[childIndex].parentModule = this.component.parentModule;
          }
          if (i === val.length - 1) {
            this.updateProject();
          }
        }
      }
    );
  } else {
    this.updateProject();
  }
}

///                     END OF SET MODULE

// ***********************************************************************************

///                     SET  AUTHENTICATION


/*   authCheckbox(auth) {
    if (auth === true) {
      this.setAuth();
    } else {
      this.unsetAuth();
    }
  } */

  setAuth(): any {
    this.parentComponent.router = true;
    // update parent component's children array
    const index = this.help.getIndex(this.parentComponent.children, 'name', this.component.name);
    this.parentComponent.children[index].authentication = true;
    this.parentComponent.children[index].inRouter = true;
    this.component.inRouter = true;
    // update all children's authentication
    if (this.component.children.length > 0) {
      this.updateChildrenAuth(true);
    } else {
      this.updateProject();
    }
  }


  unsetAuth(): any {
    // update parent component children array
    const index = this.help.getIndex(this.parentComponent.children, 'name', this.component.name);
    this.parentComponent.children[index].authentication = false;
    // update all children's authentication
    if (this.component.children.length > 0) {
      this.updateChildrenAuth(this.parentComponent.parentAuth);
    } else {
      this.updateProject();
    }
  }


  childAuthCheckbox(auth) {
    if (auth === true) {
      if (this.component.children.length > 0) {
        this.updateChildrenAuth(true);
      } else {
        this.updateProject();
      }
    } else {
      this.updateChildrenAuth(false);
    }
  }

  updateChildrenAuth(auth) {
    this.help.getChildren(this.component.id, this.project.components).then(
      (child: any[]) => {
        for (let i = 0; i < child.length; i++) {
          const index = child[i].index;
          this.project.components[index].parentAuth = auth;
          if (i === child.length - 1) {
            this.updateProject();
          }
        }
      }
    );
  }


  ///                END OF SET  AUTHENTICATION


  // ***********************************************************************************


  ///                SET ROUTER

  inRouterCheckbox(router) {
    if (router === true) {
      let index = this.help.getIndex(this.parentComponent.children, 'id', this.component.id);
      if (index === -1) {
        index = this.help.getIndex(this.altParent.children, 'id', this.component.id);
        this.altParent.children[index].inRouter = router;
      } else {
        this.parentComponent.children[index].inRouter = router;
      }
      this.parentComponent.router = true;
      this.component.inRouter = true;
      this.updateProject();
    } else {
      let index = this.help.getIndex(this.parentComponent.children, 'id', this.component.id);
      if (index === -1) {
        index = this.help.getIndex(this.altParent.children, 'id', this.component.id);
        this.altParent.children[index].inRouter = router;
      } else {
        this.parentComponent.children[index].inRouter = router;
      }
      this.component.inRouter = false;
      let count = 0;
      // if component has in route children then router true
      for (let i = 0; i < this.component.children.length; i++) {
        const child = this.component.children[i];
        if (child.inRouter === true) {
          count++;
        }
        if (i === this.component.children.length - 1) {
          if (count === 0) {
            this.parentComponent.router = false;
          }
        }
      }

    }
  }


    ///               END OF  SET ROUTER

    // ***********************************************************************************

    ///               SET DEFAULT COMPONENT


  onDefaultComponent(name){
    //console.log(name)
    const defIndex = this.help.getMainIndex(this.component.defaultComponentId);
    if (defIndex !== -1) {
      this.components[defIndex].isDefaultComponent = false;
      this.component.defaultComponentId = 0;
      this.component.defaultComponent = '';
    }
    if (name !== ''){
      const index = this.components.findIndex((comp) => {
        return (comp.name === name && comp.component)
      })
      this.components[index].isDefaultComponent = true;
      this.components[index].inRouter = true;
      this.components[index].router = true;
      this.component.defaultComponentId = this.components[index].id;
      this.component.defaultComponent = this.components[index].name;
    }
    this.updateProject();
    //console.log(this.components)    
  }




///            END OF   SET DEFAULT COMPONENT

// ***********************************************************************************


//// Create, Delete, Edit CHILD COMPONENTS


// Create child component

onAddComponent() {
  
  const name = this.help.fixComponentName(this.newChildName);
  
    if (name !== '') {
      //console.log(name.charAt(0))
      if (Number.isInteger(parseInt(name.charAt(0)))){
        this.componentNameNumberModal = true;
      } else {
        const isExist = this.help.isComponentExist(name, this.componentType, this.component.children);
        if (isExist === -1) {
          this.addComponent(name);
        } else {
          this.componentExistModal = true;
        }
      }
      
      
    }
  
}


async addComponent(name) {
  this.setUpName(name);
  this.project.ids++;
  const id = this.project.ids;
  let parentModule: any;
  let parentModuleId: any;
  
  const path = this.component.path + this.component.name + '/' ;
  const pathArray = this.component.pathArray.concat([this.component.id])
  const parentAuth = this.component.childAuthentication ? true : false;
  let component = false;
  let module = false;
  let folder = false;

  switch (this.componentType) {// componentType is ngModel 
    case 'component': component = true; break;
    case 'folder': folder = true; break;
    case 'module': module = true; break;
  }
  
  if ( this.component.lazyLoading === true || this.component.module === true) {
    parentModule = this.component.name;
    parentModuleId = this.component.id;
  } else {
    parentModule = this.component.parentModule;
    parentModuleId = this.component.parentModuleId;
  }
  let parentId: number;
  let parentName: string;
  let parentFolder: string;
  let parentFolderId: number;

  if (this.component.folder) {
    parentId = this.component.parentId;
    parentName = this.component.parent;
    parentFolder = this.component.name;
    parentFolderId = this.component.id;
  } else {
    parentId = this.component.id;
    parentName = this.component.name;
    parentFolder = '';
    parentFolderId = 0;
  }
  
  this.project.components.push({
    id: id,
    name: name,
    upName: this.upName,
    siblingInteraction: [],
    folder: folder,
    component: component,
    module: module,
    routingModule:false,
    lazyLoading: false,
    authentication: false,
    children: [],
    path: path,
    router: false,
    parent: parentName,
    altParent: this.component.name,
    parentModule: parentModule,
    parentModuleId: parentModuleId,
    parentId: parentId,
    parentAuth: parentAuth,
    childAuthentication: false,
    routes: '',
    declarations: '',
    imports: '',
    importsForRoutingFile: '',
    ngModuleImports: '',
    links: '',
    htmlChildren: '',
    inRouter: false,
    folderPath: '',
    pathArray: pathArray,
    parentFolder: parentFolder,
    parentFolderId: parentFolderId
  });

  // Adding new component to parent component's children array
  this.component.children.push({name: name, inRouter: false, authentication: false, id: id, active: false});
  this.newChildName = '';
  // update component in project's components
  this.updateProject();
}

setUpName(name: string) {
  name = name.charAt(0).toUpperCase() + name.slice(1);
  const index = name.indexOf('-');
  if (index !== -1) {
    name = name.slice(0, index) + name.charAt(index + 1).toUpperCase() + name.slice(index + 2);
    this.setUpName(name);
  } else {
    this.upName = name;
  }
}

// End of Create child component

// ***********************************************************************************

// Delete child component

cancelDeleteComponent(){
  this.showDeleteComponentModal = {show: false, index: 0, name: '', id: 0};
}

onDeleteComponentModal(index, name, id) {
  this.showDeleteComponentModal = {show: true, index: index, name: name, id: id};
}

onDeleteComponent() {
  
  const childIndex = this.showDeleteComponentModal.index;
  const name = this.showDeleteComponentModal.name;
  const id = this.showDeleteComponentModal.id;
  const index = this.help.getMainIndex(id);

  if (this.components[index].isDefaultComponent) {
    const moduleIndex = this.help.getMainIndex(this.components[index].parentModuleId);
    this.components[moduleIndex].defaultComponent = '';
    this.components[moduleIndex].defaultComponentId = 0;

  }
 
  if (id !== 0) {
    this.deleteChildren(id);
    this.component.children.splice(childIndex, 1);
    //console.log(this.components[index])
    this.components.splice(index, 1);
    this.updateProject();
    this.showDeleteComponentModal = {show: false, index: 0, name: '', id: 0};
  }
}

deleteChildren(id) {
  this.help.getChildren(id, this.components).then(
    (val: any[]) => {
      for (const child of val) {
        const index = this.help.getMainIndex(child.id);
        this.components.splice(index, 1);
      }
    }
  );
}


// End of Delete child component

// ***********************************************************************************

// Edit component name

onUpdateComponentName(){
  
  const name = this.help.fixComponentName(this.editComponentName.name);
  if (name !== '') {
    const isExist = this.help.isComponentExist(name, this.componentType, this.component.children);
    //console.log(isExist)
      if (isExist === -1) {
        this.setUpName(name);
        this.updateComponentName(name);
      } else {
        this.cancelEditComponentName();
        this.componentExistModal = true;
      }
    }
}

updateComponentName(name) {
  const oldName = this.editComponentName.oldName;
  this.component.name = name;
  this.component.upName = this.upName;
  //update children array
  const indexInParent = this.parentComponent.children.findIndex((child)=>{return child.id === this.component.id});
  this.parentComponent.children[indexInParent].name = name;
  
  // update all children path, parentmodule, parent name
  this.help.getChildren(this.component.id, this.components).then(
    (val: any[]) => {
      if(val.length === 0) this.updateProject(); 
      for (let i = 0; i < val.length; i++) {
        const childIndex = val[i].index;
        const child = this.project.components[childIndex];
        child.path = child.path.replace(oldName, name);
        child.pathArray[child.pathArray.indexOf(childIndex)] = childIndex;
        child.parent = name;
        if (child.altParentId === this.component.id) {
          child.altParent = name;
        }
        if (child.parentModuleId === this.component.id) {
          child.parentModule = name;
        }
        if (i === val.length - 1) {
          this.updateProject();
        }
      }
    }
  );

  this.cancelEditComponentName();
  
}

onEditComponentName(name) {
  this.editComponentName.name = name;
  this.editComponentName.oldName = name;
  this.editComponentName.show = true;
}

cancelEditComponentName() {
  this.editComponentName.name = '';
  this.editComponentName.oldName = '';
  this.editComponentName.show = false;
}

// End of Edit component name


//// End of Create, Delete, Edit CHILD COMPONENTS

// ***********************************************************************************


 ///  MODALS/////




}
