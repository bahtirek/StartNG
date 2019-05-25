import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Project } from '../../data/project.interface';
import { ProjectsServices } from '../../services/projects.service';

@Component({
  selector: 'app-newproject',
  templateUrl: './newproject.component.html',
  styleUrls: ['./newproject.component.css']
})
export class NewprojectComponent implements OnInit {

  newProjectName = '';
  projects: Project[] = [];
  projectExistModal = false;
  projectIndex: number;
  placeHolder = 'Project name';
  projectName: any;
  editSave: string = 'Add new project';
  pid: any;

  constructor(private router: Router, private route: ActivatedRoute, private projectsServices: ProjectsServices) { }

  ngOnInit() {
    if (this.route.snapshot.params['project']) {
      const index = parseInt(this.route.snapshot.params['project']);
      if (this.projectsServices.projectsCollection !== undefined) {
        this.placeHolder = this.projectsServices.projectsCollection[index].name;
        this.editSave = 'Edit project name';
        this.pid = this.projectsServices.projectsCollection[index].pid;
      } else {
        this.router.navigate(['project/projects']);
      }
      
    }
  }

  ngOnDestroy(): void {
    this.pid = undefined;
  }

  createProject() {
    if (this.newProjectName !== '') {
      this.newProjectName = this.newProjectName.trim();
      if (this.pid) {
        if (!this.projectsServices.renameProject(this.newProjectName, this.pid)) {
          this.projectExistModal = true;
        } else {
          this.router.navigate(['project/projects']);
        }
      } else {
        if (!this.projectsServices.addProject(this.newProjectName)) {
          this.projectExistModal = true;
        } else {
          this.router.navigate(['project/projects']);
        }
      }
    } else {
      return false;
    }
  }

  

  cancel(){
    this.router.navigate(['project/projects']);
  }




}
