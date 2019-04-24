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

export class FilesService {

  project: Project;

constructor(private projectsService: ProjectsServices, public temp: Template, public help: HelperService) { 
  this.projectsService.projectObservable.subscribe(
    result => {
      this.project = result;
    }
  )
}


  /* setFiles(component: Comp): any {
    const imports = component.imports;
    const exports = component.exports;
    let routingModuleImports = component.importsForRoutingFile;
    const declarations = component.declarations;
    const name = component.name;
    let ngModuleImports = component.ngModuleImports !== undefined ? component.ngModuleImports : '';
    
    if (component.name === 'app') {
      const folder = this.zip.folder('app');
      const routing = this.appRouting(routingModuleImports, component.routes);
      const ts = this.template.appComponentTs('app', 'App', this.project.name);
      const html = this.template.appComponentHtml(component.links, component.htmlChildren);
      const module = this.template.appComponentModule(imports, declarations, '', ngModuleImports);
      folder.file('app-routing.module.ts', routing);
      folder.file('app.component.ts', ts);
      folder.file('app.component.html', html);
      folder.file('app.module.ts', module);
      folder.file('app.component.css', '');
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
        const cssFileName = name + '.component.css';
        let routerOutlet = '';
        if (component.router === true) routerOutlet = '<router-outlet></router-outlet>';
        let ts = this.ts(name, this.componentName);
        let html = this.html(component.name, component.links, component.htmlChildren, routerOutlet);
        if(name === 'login'){
          const  path = this.getRelativePath(component.path, '');
          ts = this.template.loginTs(path);
          html = this.template.loginHtml();
        }
        folder.file(tsFileName, ts);
        folder.file(htmlFileName, html);
        folder.file(cssFileName, '');
      }
    }
  } */



}
