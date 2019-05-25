import { HelperService } from './services/helper.service';
import { AuthService } from './services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { ClarityModule} from '@clr/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './services/auth-guard.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectServices } from './services/project.service';
import { HttpClientModule } from '@angular/common/http';
import { ProjectsServices } from './services/projects.service';
import { ZipService } from './services/zip.service';
import { HeaderModule } from './header/header.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule} from '@angular/fire/auth';
import { AngularFirestoreModule} from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { LoginComponent } from './login/login.component';
//import { SignupComponent } from './signup/signup.component';

export const config = {
  apiKey: "AIzaSyBxPUM8zzUO85W4xqSXBBVo05sQgN5P970",
  authDomain: "ng-starter-62e2b.firebaseapp.com",
  databaseURL: "https://ng-starter-62e2b.firebaseio.com",
  projectId: "ng-starter-62e2b",
  storageBucket: "ng-starter-62e2b.appspot.com",
  messagingSenderId: "698763537068"
}


@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      LoginComponent
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      ClarityModule,
      FormsModule,
      HttpClientModule,
      AppRoutingModule,
      HeaderModule,
      RouterModule,
      AngularFireModule.initializeApp(config),
      AngularFireAuthModule,
      ReactiveFormsModule,
      AngularFirestoreModule
   ],
   providers: [
      AuthGuard,
      AuthService,
      ProjectServices,
      ProjectsServices,
      ZipService,
      HelperService, 
      {provide: LocationStrategy, useClass: HashLocationStrategy}
   ],
   bootstrap: [
      AppComponent
   ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
