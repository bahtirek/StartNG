import { Collection } from './../../data/collection.interface';
import { Project } from './../../data/project.interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectsServices } from '../../services/projects.service';
import { EditNameComponent } from '../edit-name/edit-name.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  showDeleteProjectModal = false;
  indexDeleteProject: any;
  editName: boolean;
  currentNameToEdit: any;
  @ViewChild(EditNameComponent)
  nameComponent = EditNameComponent;
  collection: Collection[] = [];
  collectionSubscription: Subscription;
  user: any;
  userSubscription: Subscription;
  newName: any;
  size = 25;
  

  constructor(private projectsServices: ProjectsServices, private auth: AuthService, private router: Router) { }

  ngOnInit() {

    if (this.projectsServices.collection) {
      this.collectionSubscription = this.projectsServices.collection.subscribe(
        result => {
          this.collection = result;
          //console.log(result)
        }
      );
    }
    

    this.userSubscription = this.auth.userObservable.subscribe(
      result => {
        this.user = result;
        if (this.collectionSubscription === undefined) {
          this.collectionSubscription = this.projectsServices.collection.subscribe(
            result => {
              this.collection = result;
              //console.log(result)
            }
          );
        }
        
      }
    );

    
    
  }
  
  ngOnDestroy(): void {
    if ( this.userSubscription )
      this.userSubscription.unsubscribe();
    if (this.collectionSubscription)
      this.collectionSubscription.unsubscribe();
  }


  /* ********************************************************** */

 // DELETE PROJECT
  onDeleteProject() {
    this.projectsServices.deleteProject(this.collection[this.indexDeleteProject]);
    this.showDeleteProjectModal = false;
  }

  deleteProjectModal(index) {
    this.showDeleteProjectModal = true;
    this.indexDeleteProject = index;
  }
  // END OF DELETE PROJECT

  /* ********************************************************** */

  // EDIT PROJECT NAME

  onEditProjectName(index, name) {
    if ( this.currentNameToEdit !== undefined ) {
      this.collection[this.currentNameToEdit].editName = false;
    }
    this.newName = name.trim();
    this.currentNameToEdit = index;
    this.collection[index].editName = true;
  }


  // END OF EDIT PROJECT NAME

  /* ********************************************************** */
getProject(pid){
  this.projectsServices.getProject(pid, true);
}

}
