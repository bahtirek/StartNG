import { ClrInputContainer } from '@clr/angular';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { passwordValidator } from '../validators/password-validator';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  registrationForm: FormGroup;
  email: FormControl;
  password: FormControl;
  confirmPassword: FormControl; 
  signupSuccess: boolean = false;
  

  constructor(public af: AngularFireAuth, private router: Router, public authService: AuthService) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  createForm() {
    this.registrationForm = new FormGroup({
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    }, 
      passwordValidator
    );
  }

  createFormControls(){
    this.email = new FormControl('', [Validators.required, Validators.pattern(/[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i)]),
    this.password = new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/)]),
    this.confirmPassword = new FormControl('', [Validators.required])
  }


  onSubmit(){
    if(this.registrationForm.valid){
      this.doRegister(this.registrationForm.value.email, this.registrationForm.value.password);
    }
    
  }


  doRegister(email, password){
    this.af.auth.createUserWithEmailAndPassword(email, password)
    .then((result)=>{
      this.signupSuccess = true;
    })
    .catch((error) => {
      const errorCode = error.code;
      this.errorMessage = error.message;
      
      if (errorCode == 'auth/weak-password') {
        this.errorMessage = 'The password is too weak.';
      } 
    });
  }

  goLoginPage() {
    this.signupSuccess = false;
    this.router.navigate(['login']);
  }
  goHomePage() {
    this.signupSuccess = false;
    this.router.navigate(['home']);
  }

}
