import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    if (this.authService.isLoggedIn()) {
        return true;
      }
    this.router.navigate(['/home']);
  }

  canActivateChild() {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/home']);
  }
}
