import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import { Subject, Observable, of, Subscription } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';
import { ProjectsServices } from './projects.service';

interface User {
  uid: string;
  email: string;
  name: string;
  verified: boolean;
  token: any;
}



@Injectable()
export class AuthService {

  user: any;


  private isLoggedObservableSource = new Subject<boolean>();
  isLoggedObservable = this.isLoggedObservableSource.asObservable();

  private errorObservableSource = new Subject<string>();
  errorObservable = this.errorObservableSource.asObservable();

  private userObservableSource = new Subject<any>();
  userObservable = this.userObservableSource.asObservable();
  userSubscription: Subscription;
  

  constructor(private router: Router, public af: AngularFireAuth) { 
    //// Get auth data, then get firestore user document || null
    //console.log('auth')
    this.userSubscription = this.af.user.subscribe((credentials) => {
      if (credentials) {
        this.user = credentials;
        this.setUser(credentials);
        if (credentials) {
          this.userObservableSource.next(credentials);
        }
        
      }
    })
    
  }

  logout() {
    this.userSubscription.unsubscribe();
    this.af.auth.signOut().then(
      () => {
        localStorage.removeItem('ngstarter');
      this.isLoggedObservableSource.next(false);
      this.router.navigate(['/home']);
      //window.location.reload();
      }
    )
    .catch((error) => {
      //console.log(error)
    });
  }

  isLoggedIn() {
    const date = + new Date();
    const userData = JSON.parse(localStorage.getItem('ngstarter'));
    if (userData) {
      this.userObservableSource.next(userData)
      this.user = userData;
      return true;
    }
  }

  googleLogin(){
    this.af.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then((result)=>{
        this.isLoggedObservableSource.next(true);
        this.setUser(result.user);
        //this.projects.getProjects(result.user.uid);
        this.goHomePage();
      })
  }

  emailLogin(email: string, password: string) {
    this.af.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        //console.log(result)
        this.errorObservableSource.next('');
        this.setUser(result.user);
        this.isLoggedObservableSource.next(true);
      })
      .catch((error) => {
        //console.log(error)
        if (error.code === 'auth/network-request-failed') {
          this.errorObservableSource.next('Network error');
        } else {
          this.errorObservableSource.next('Wrong email or password');
        }
        
      })
  }

  setUser(user): any {
    //console.log(user)
    const userData = JSON.stringify({user: user});
    localStorage.setItem('ngstarter', userData);
    this.isLoggedObservableSource.next(true);
  }

  goHomePage() {
    this.router.navigate(['/']);
  }

}
