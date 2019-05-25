import { TreeViewComponent } from './../../tree-view/tree-view.component';
import { Comp } from './../../data/comp.interface';
import { Project } from './../../data/project.interface';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ProjectsServices } from 'src/app/services/projects.service';

@Component({
  selector: 'app-project-map',
  templateUrl: './project-map.component.html',
  styleUrls: ['./project-map.component.css']
})
export class ProjectMapComponent implements OnInit {

  project: Project;
  app: Comp;


  constructor(private projectsService: ProjectsServices, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.project = this.projectsService.currentProject;
    this.projectsService.projectObservable.subscribe(result => this.project = result);
    this.app = this.project.components[0];
    //console.log(this.project);
  }



  childrenQuantity(name) {
    const index = this.project.components.findIndex(component => {
      return component.name = name;
    });

    return this.project.components[index].children.length;
  }

/*   scssUI(){
    this.projectsService.saveToLoc(this.project);
    this.projectsService.saveProjectScssUI();
  } */


}
