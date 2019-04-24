import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Params, Router, NavigationExtras } from '@angular/router';
import { HeaderService } from '../services/header.service';
import { ZipService } from '../services/zip.service';
import { ProjectsServices } from '../services/projects.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isComponent: boolean;

  @Input() isUserLogged: boolean;

  saveComponentModal: boolean = false;

  projectSavedModal = false;
  projectNotSavedModal: boolean;
  goTo: string;

  constructor(public router: Router, public auth: AuthService, public header: HeaderService, public zip: ZipService, private projectsService: ProjectsServices) { 
   
  }

  ngOnInit() {
    this.header.isComponentObservable.subscribe((result) => {
      this.isComponent = result;
    });
    
  }

  saveProject(){
    this.saveComponentModal = false;
    this.header.componentChanged = false;
    this.projectsService.saveProject()
    .then(() => {
      this.projectSavedModal = true;
    });
  }

  logout(){
    this.auth.logout();
  }

  download() {
    this.zip.getReady();
  }



  onComponentLeave(goTo: string){
    this.goTo = goTo;
    if (this.isComponent && this.header.componentChanged) {
      this.saveComponentModal = true;
    } else{
      this.router.navigate([goTo]);
      this.goTo = void 0;
    }
  }

  onGoTo(){
    //console.log(this.goTo)
    this.header.componentChanged = false;
    if (this.goTo) {
      this.router.navigate([this.goTo]);
      this.goTo = void 0;
    }
    
    this.saveComponentModal = false;
    this.projectSavedModal = false;
  }

  cancel(){
    this.saveComponentModal = false;
    this.header.componentChanged = false;
  }
}
