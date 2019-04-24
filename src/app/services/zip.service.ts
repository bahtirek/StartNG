import { HelperService } from './helper.service';
import { Project } from './../data/project.interface';
import { Comp } from './../data/comp.interface';
import { Injectable, Component } from '@angular/core';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver/src/FileSaver';
import { Template } from './template.service';
import { SetModuleService } from './setModule.service';
import { RouteToStringService } from './routeToString.service';
import { FilesService } from './files.service';
import { ProjectsServices } from './projects.service';


@Injectable({
  providedIn: 'root'
})
export class ZipService {
  title = 'ziptes';
  appFolder;
  customerFolder;
  orderFolder;
  zip: JSZip = new JSZip();
  canActivate = 'canActivate: [AuthGuard], \n';
  project: Project;
  componentName: string;
  routesArray = [];
  upName: any;
  inRouterParentIndex: number;


  constructor(private help: HelperService, private template: Template, private projectsService: ProjectsServices, public setModule: SetModuleService, public routeService: RouteToStringService, public filesService: FilesService) {
    this.projectsService.projectObservable.subscribe(
      result => {
        this.project = result;
        this.project.routes = [];
      }
    )
  }



  getReady() {
    //this.project = this.projectSevice.currentProject;
    this.project.routes = [];
    let promisesModule = [];
    let promisesFiles = [];
    const self = this;
    console.log(JSON.stringify(this.project))
    for (const component of this.project.components) {
      promisesModule.push(this.setModule.setupModules(component));
    }
    Promise.all(promisesModule).then(
      async () => {
        await this.routeService.routeToString(this.project.routes[0]);
        for (const comp of this.project.components) {
          promisesFiles.push(this.setFiles(comp));
          this.setFiles(comp);
        }
        Promise.all(promisesFiles).then(
          () => {
            if(this.project.login === true) {
              const folder = this.zip.folder('app/auth');
              folder.file('auth.guard.ts', this.template.authGuard());
              folder.file('auth.service.ts', this.template.authService());
            }
            if(this.project.phoneFormat) {
              const folder = this.zip.folder('app/directives');
              folder.file('phone-format.directive.ts', this.template.phoneDirective(this.project.phone.formatOne, this.project.phone.formatTwo, this.project.phoneFormat.length))
            }
            this.zip.generateAsync({type:"blob"}).then((content) => {
              const projectName = self.project.name + '.zip';
              saveAs(content, projectName);
              this.zip.files = {};
              self.reset();
            });
          }
        );
      }
    );
  }

  reset(){
    for (const component of this.project.components) {
      component.routes = '';
      component.htmlChildren = '';
      component.links = '';
      component.imports = '';
      component.importsForRoutingFile = '';
      component.declarations = '';
      component.ngModuleImports = '';
      component.authGuardImport = false;
      component.folderPath = '';
      component.exports = '';
      component.ts = '';
      component.html = '';
    }
  }






  async setFiles(component: Comp) {
    let css = 'css';
    if (this.project.scss) {
      css = 'scss';
    }
    let path = this.help.getRelativePath(component.path, '');
    let imports = component.imports;
    const exports = component.exports;
    let routingModuleImports = component.importsForRoutingFile;
    const declarations = component.declarations;
    const name = component.name;
    this.setComponentName(component.name);
    let ngModuleImports = component.ngModuleImports !== undefined ? component.ngModuleImports : '';
    if (component.reactiveFormsModule) {
      imports += 'import { ReactiveFormsModule } from \'@angular/forms\';';
      ngModuleImports += 'ReactiveFormsModule,';
    }
    if (component.authGuardImport !== undefined && component.authGuardImport === true ){
      if (component.name === 'app') {
        routingModuleImports += this.template.authGuardImport('./');
      } else {
        routingModuleImports += this.template.authGuardImport(path);
      }
    }
    if (component.name === 'app') {
      const folder = this.zip.folder('app');
      const routing = this.template.appRouting(routingModuleImports, component.routes);
      const ts = this.template.appComponentTs('app', 'App', this.project.name, css);
      const html = this.template.appComponentHtml(component.links, component.htmlChildren);
      const module = this.template.appComponentModule(imports, declarations, '', ngModuleImports);
      folder.file('app-routing.module.ts', routing);
      folder.file('app.component.ts', ts);
      folder.file('app.component.html', html);
      folder.file('app.module.ts', module);
      folder.file('app.component.' + css, '');
    } else if (!component.folder) {
      const folder = this.zip.folder(component.path + name);
      if (component.module) {
        const moduleFileName = name + '.module.ts';
        const module = this.template.module(imports, declarations, this.componentName, ngModuleImports, exports);
        if (component.routingModule || component.lazyLoading) {
          const routingFileName = name + '-routing.module.ts';
          const routing = this.template.routing(routingModuleImports, component.routes, this.componentName);
          folder.file(routingFileName, routing);
        }
        folder.file(moduleFileName, module);
      }
      if (component.component) {
        //console.log(component.name)
        const tsFileName = name + '.component.ts';
        const htmlFileName = name + '.component.html';
        const cssFileName = name + '.component.' + css;
        let routerOutlet = '';
        if (component.router === true) routerOutlet = '<router-outlet></router-outlet>';
        let ts = this.template.ts(name, this.componentName, css);
        let componentWorks = '<p>' + component.name + ' works</p>';
        if (component.forms && component.forms.length > 0) {
          ts = component.ts;
          componentWorks = component.html;
        }
        
        let html = this.template.html(componentWorks, component.links, component.htmlChildren, routerOutlet);
        if(name === 'login'){
          ts = this.template.loginTs(path, css);
          html = this.template.loginHtml();
        }
        folder.file(tsFileName, ts);
        folder.file(htmlFileName, html);
        folder.file(cssFileName, '');
      }
    }
  }



  async setComponentName(name: string) {
    name = name.charAt(0).toUpperCase() + name.slice(1);
    const index = name.indexOf('-');
    if (index !== -1) {
      name = name.slice(0, index) + name.charAt(index + 1).toUpperCase() + name.slice(index + 2);
      this.setComponentName(name);
    } else {
      this.componentName = name;
    }
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

}

