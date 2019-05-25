import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  errorMessage: string;
  successMessage: string;
  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  
  constructor(private router: Router, public authService: AuthService) { 
    this.authService.errorObservable
      .subscribe((result) => {
        this.errorMessage = result;
      })
    this.authService.isLoggedObservable
      .subscribe((result) => {
        if (result) {
          this.authService.goHomePage();
        }
      })
  }

  

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    })
  }

  createFormControls(){
    this.email = new FormControl('', [Validators.required]),
    this.password = new FormControl('', [Validators.required])
  }


  onSubmit(){
    //console.log(this.loginForm)
    if(this.loginForm.valid){
      this.authService.emailLogin(this.loginForm.value.email, this.loginForm.value.password);
    }
    
  }

  goHomePage() {
    this.router.navigate(['home']);
  }

  onLogin() {
    this.authService.emailLogin(this.loginForm.value.email, this.loginForm.value.password);
  }

  googleLogin(){
    this.authService.googleLogin();
  }
}
