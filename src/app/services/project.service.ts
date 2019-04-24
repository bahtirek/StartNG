
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../data/project.interface';


@Injectable()

export class ProjectServices {
    projects: Project[];
    currentProject: Project;
    currentProjectIndex: number;

    constructor() {
    }

    private projectSource = new Subject<any>();
    projectObservable = this.projectSource.asObservable();

    updateProject(project) {
        this.projects = JSON.parse(localStorage.getItem('projects'));
        this.projectSource.next(project);
        this.projects[this.currentProjectIndex] = this.currentProject;
        const projects = JSON.stringify(this.projects);
        localStorage.setItem('projects', projects);
        //console.log(project);
    }

    getProject(projectName) {
        this.projects = JSON.parse(localStorage.getItem('projects'));
        this.currentProjectIndex = this.projects.findIndex((project) => {
            return project.name === projectName;
        });
        this.currentProject = this.projects[this.currentProjectIndex];
        this.updateProject(this.currentProject);
    }

/*     getComponent(name) {
        const index = this.currentProject.components.findIndex((component) => {
            return component.name === name;
        });
        return this.currentProject.components[index];
    } */

    reset(){
        for (const component of this.currentProject.components) {
          component.routes = '';
          component.htmlChildren = '';
          component.links = '';
          component.imports = '';
          component.importsForRoutingFile = '';
          component.declarations = '';
          component.ngModuleImports = '';
          component.authGuardImport = false;
          component.folderPath = '';
        }
      }

    
}
