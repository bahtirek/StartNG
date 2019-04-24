import { Project } from './data/project.interface';
import { AuthService } from './services/auth.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isUserLogged = false;
  project: Project;

  ngOnInit(): void {
    //this.isUserLogged = this.authService.isLoggedIn();
  }

  constructor(private authService: AuthService) {
    authService.isLoggedObservable.subscribe(
      log => {
        this.isUserLogged = log;
      }
    );
  
   }


}
