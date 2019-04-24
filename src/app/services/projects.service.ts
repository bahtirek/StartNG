import { Router } from '@angular/router';

import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Project } from '../data/project.interface';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Collection } from '../data/collection.interface';
import { AuthService } from './auth.service';




@Injectable()

export class ProjectsServices {
  

    projects: Project[];
    collection: Observable<Collection[]>;
    user: any;
    private projectSource = new Subject<Project>();
    projectObservable = this.projectSource.asObservable();
    projectsCollection: any;
    currentProject: Project;
    private projectCollection: AngularFirestoreCollection<Collection>;
    //private currentProjectCollection: AngularFirestoreCollection<Project>;
  



    constructor(private afs: AngularFirestore, private router: Router, private auth: AuthService) {
        this.auth.isLoggedObservable.subscribe(
            result => {
                if (result) {
                    this.user = JSON.parse(localStorage.getItem('ngstarter'));
                    //console.log(this.user)
            
                    if (this.user) {
                        //this.auth
                        this.getCollection(this.user.user.uid)
                    }
                }
            }
        )
        
    }



    getCollection(uid){
        //console.log(this.user)
        this.projectCollection = this.afs.collection<Collection>('usercoll', ref => ref.where('uid', '==', uid));
        this.collection = this.projectCollection.valueChanges();
        this.afs.collection<Collection>('usercoll', ref => ref.where('uid', '==', uid)).valueChanges()
        .subscribe(
            result => {
                this.projectsCollection = result;
            }
        );
    }

    private projectDoc: AngularFirestoreDocument<Project>;
    project: Observable<any>;

    getProject(pid) {
        this.getProjectDoc(pid)
            .then(
              () =>  {this.project.subscribe(
                    result => {
                        if (result) {
                            this.currentProject = result;
                            this.saveToLoc(this.currentProject);
                            this.router.navigate(['project/', this.currentProject.name, '0']);
                        }
                        
                    }
                );}
            );
        
    }

    async getProjectDoc(pid) {
        this.projectDoc = this.afs.doc<Project>('projects/' + pid);
        this.project = this.projectDoc.valueChanges();
    }


    
    addProject(name) {
        const index = this.projectsCollection.findIndex((item) => {
            return item.name === name;
          });
        if (index === -1) {
            const id = this.afs.createId();
            const projectToSave: Project  = { pid: id, name: name, uid: this.user.user.uid, components: [], login: true, scss: false, email: this.user.user.email, ids: 4};
            const collectionToSave: Collection = {pid: id, name: name, uid: this.user.user.uid }
            this.projectCollection.doc(id).set(collectionToSave);
            this.afs.collection('projects').doc(id).set(projectToSave);
            return true;
        } else {
            return false;
        }
    }

    renameProject(name, pid) {
        const index = this.projectsCollection.findIndex((item) => {
            return item.name === name;
          });
        if (index === -1) {
            this.afs.collection('projects').doc(pid).update({"name": name});
            this.afs.collection('usercoll').doc(pid).update({"name": name});
            return true;
        } else {
            return false;
        }
    }


    
    deleteProject(project){
        this.projectCollection.doc(project.pid).delete();
        this.projectCollection.doc(project.pid).delete();
        this.afs.collection('projects', ref => ref.where('uid', '==', this.user.user.uid)).doc(project.pid).delete();
    }


    saveToLoc(project: Project) {
        localStorage.setItem('ngstarter-project', JSON.stringify(project));
        this.projectSource.next(project);
    }


    getProjectFromLoc(): any {
        this.currentProject = JSON.parse(localStorage.getItem('ngstarter-project'));
        this.projectSource.next(this.currentProject);
        return this.currentProject;
      }

    async saveProject(){
        if (this.projectDoc === undefined) {
            this.getProjectDoc(this.currentProject.pid).then(
                () => {
                    this.projectDoc.update({components: this.currentProject.components, ids: this.currentProject.ids, phone: this.currentProject.phone, phoneFormat: this.currentProject.phoneFormat})
                }
            )
        } else {
            this.projectDoc.update({components: this.currentProject.components, ids: this.currentProject.ids, phone: this.currentProject.phone, phoneFormat: this.currentProject.phoneFormat})
        }
    }

/*     async saveProjectScssUI(){
        if (this.projectDoc === undefined) {
            this.getProjectDoc(this.currentProject.pid).then(
                () => {
                    this.projectDoc.update({scss: this.currentProject.scss, formsUI: this.currentProject.formsUI})
                }
            )
        } else {
            this.projectDoc.update({scss: this.currentProject.scss, formsUI: this.currentProject.formsUI})
        }
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

