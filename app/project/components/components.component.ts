import { Project } from './../../data/project.interface';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectServices } from '../../services/project.service';
import { ProjectsServices } from '../../services/projects.service';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.css']
})
export class ComponentsComponent implements OnInit {
  projectName;
  project: Project;
  constructor(private route: ActivatedRoute, private projectsServices: ProjectsServices) { }

  ngOnInit() {
    this.projectName = this.route.snapshot.params['project'];
    this.projectsServices.getProjectFromLoc();
  }
}
