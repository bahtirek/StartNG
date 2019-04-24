import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
  })
export class Template{
    
ts (name, componentName, css) {
    return `
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-${name}',
  templateUrl: './${name}.component.html',
  styleUrls: ['./${name}.component.${css}']
})
export class ${componentName}Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

`;
  }

  html (name, links, htmlChildren, routerOutlet) {
    return `
${name}
${links}
${htmlChildren}
${routerOutlet}`;

}

  module (imports, declarations, componentName, ngModuleImports, exports) {
    return `
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

${imports}

@NgModule({
  imports: [
    CommonModule,
    ${componentName}RoutingModule,
    ${ngModuleImports}
  ],
  exports: [
    
  ],
    declarations: [${declarations}]
})
export class ${componentName}Module { }

`;

}




routing (imports, routes, componentName) {
  return `
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

${imports}

const routes: Routes = [
${routes}
];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class ${componentName}RoutingModule { }`;

}

  appComponentTs (name, upName, projectName, css) {
    return `
import { Component } from '@angular/core';

@Component({
  selector: '${name}-root',
  templateUrl: './${name}.component.html',
  styleUrls: ['./${name}.component.${css}']
})
export class ${upName}Component {
  title = '${projectName}';
}

`;

}

    appComponentHtml (li, children) {
return `
<div style="text-align:center">
  <h1>
    Welcome to {{ title }}!
  </h1>
</div>
<h2 style="text-align:center">Thanks for using Ng-EZ</h2>
<h2>Your links </h2>
<ul>
  ${li}
</ul>

<h2>Your components</h2>
${children}
<router-outlet></router-outlet>
`;

}

    appComponentModule(imports, declarations, providers, ngModuleImports){
      return  `
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

${imports}

@NgModule({
  declarations: [
    AppComponent,
    ${declarations}
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ${ngModuleImports}
  ],
  providers: [${providers}],
  bootstrap: [AppComponent]
})
export class AppModule { }

`;

}

    appRouting (imports, routes) {
      return `
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

${imports}

const routes: Routes = [
  ${routes}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

`;

}


routeWithChildren(name, componentName, canActivate, children) {
  return `
{
path: '${name}',
component: ${componentName}Component,
${canActivate}
children: [
  ${children}
]
},\n
`;
}


lazyRoute(name, componentName, canActivate) {
  return `
{
path: '${name}',
loadChildren: './${name}/${name}.module#${componentName}Module',
${canActivate}
},\n
`;
}

lazyRouteWithPath(path, name, componentName, canActivate) {
  return `
{
path: '${name}',
loadChildren: './${path}${name}/${name}.module#${componentName}Module',
${canActivate}
},\n
`;
}


lazyRouteWithChildren(componentName, canActivate, children) {
  return `
{
path: '',
component: ${componentName}Component,
${canActivate}
children: [
  ${children}
]
},\n
`;
}

    import (componentName, name) {
      return 'import { ' + componentName + 'Component } from \'./' + name + '/' + name + '.component\';\n';
    }

    importOfComponents (componentName, name, path) {
      return 'import { ' + componentName + 'Component } from \'./' + path + name + '/' + name + '.component\';\n';
    }

    importOfLazyComponent(componentName, name, path) {
      return 'import { ' + componentName + 'Component } from \'./' + name + '.component\';\n';
    }

    importOfRoutingModule (componentName, name) {
      return 'import { ' + componentName + 'RoutingModule } from \'./' + name + '-routing.module\';\n';
    }

    importOfModule (componentName, name, path) {
      return 'import { ' + componentName + 'Module } from \'./' + path + name + '/' + name + '.module\';\n';
    }

    importForApp() {
      return 'import { AppComponent } from \'./app.component\';\n';
    }

    regularRoute (name, componentName, canActivate) {
      return '{\n path: \'' + name + '\',\n\t component: ' + componentName + 'Component' + '\n\t ' + canActivate + '},\n\t';
    }

    regularRouteCanActivate (name, componentName, canActivate) {
      return '{\n path: \'' + name + '\',\n\t component: ' + componentName + 'Component' + '\n\t ' + canActivate + '},\n\t';
    }

    defaultLazyRoute (upName) {
      return '{\n\t path: \'\',\n\t component: ' + upName + 'Component \n},\n';
    }

    defaultLazyRouteCanActivate (upName, canActivate) {
      return '{\n\tpath: \'\',\n\tcomponent: ' + upName + 'Component, \n\t' + canActivate + '\n},\n';
    }

    links(path, name) {
      return '<li> <a routerLink="' + path + '" routerLinkActive="active">' + name + '</a></li>\n';
    }

    relativeLinks(path, name) {
      return '<li> <a routerLink="' + path + name + '" routerLinkActive="active">' + name + '</a></li>\n';
    }

    authGuardImport(path){
        return 'import { AuthGuard } from \'' + path + 'auth/auth.guard\';\n';
    }

    phoneDirectiveImport(path){
        return 'import { PhoneFormatDirective } from \'' + path + 'directives/phone-format.directive\';\n';
    }

    authGuard(){
      return `
      import { Injectable }       from '@angular/core';
      import {
        CanActivate, Router,
        ActivatedRouteSnapshot,
        RouterStateSnapshot,
        CanActivateChild,
        NavigationExtras,
        CanLoad, Route
      }                           from '@angular/router';
      import { AuthService }      from './auth.service';
      
      @Injectable({
        providedIn: 'root',
      })
      export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
        constructor(private authService: AuthService, private router: Router) {}
      
        canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
          let url: string = state.url;
      
          return this.checkLogin(url);
        }
      
        canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
          return this.canActivate(route, state);
        }
      
        canLoad(route: Route): boolean {
          let url = \`/\${route.path}\`;
      
          return this.checkLogin(url);
        }
      
        checkLogin(url: string): boolean {
          if (this.authService.isLoggedIn) { return true; }
      
          // Store the attempted URL for redirecting
          this.authService.redirectUrl = url;
      
          // Create a dummy session id
          let sessionId = 123456789;
      
          // Set our navigation extras object
          // that contains our global query params and fragment
          let navigationExtras: NavigationExtras = {
            queryParams: { 'session_id': sessionId },
            fragment: 'anchor'
          };
      
          // Navigate to the login page with extras
          this.router.navigate(['/login'], navigationExtras);
          return false;
        }
      }`
    }

    authService(){
      return `
      import { Injectable } from '@angular/core';

      import { Observable, of } from 'rxjs';
      import { tap, delay } from 'rxjs/operators';
      
      @Injectable({
        providedIn: 'root',
      })
      export class AuthService {
        isLoggedIn = false;
      
        // store the URL so we can redirect after logging in
        redirectUrl: string;
      
        login(): Observable<boolean> {
          return of(true).pipe(
            delay(1000),
            tap(val => this.isLoggedIn = true)
          );
        }
      
        logout(): void {
          this.isLoggedIn = false;
        }
      }
  `}

  loginTs(path, css){
    return `
import { Component }        from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { AuthService }      from '${path}auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.${css}']
})
export class LoginComponent {
  message: string;

  constructor(public authService: AuthService, public router: Router) {
    this.setMessage();
  }

  setMessage() {
    this.message = 'Logged ' + (this.authService.isLoggedIn ? 'in' : 'out');
  }

  login() {
    this.message = 'Trying to log in ...';

    this.authService.login().subscribe(() => {
      this.setMessage();
      if (this.authService.isLoggedIn) {
        // Get the redirect URL from our auth service
        // If no redirect has been set, use the default
        let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/';

        // Set our navigation extras object
        // that passes on our global query params and fragment
        let navigationExtras: NavigationExtras = {
          queryParamsHandling: 'preserve',
          preserveFragment: true
        };

        // Redirect the user
        this.router.navigate([redirect], navigationExtras);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.setMessage();
  }
}
`
  }

  loginHtml(){
      return `
<h2>LOGIN</h2>
<p>{{message}}</p>
<p>
  <button (click)="login()"  *ngIf="!authService.isLoggedIn">Login</button>
  <button (click)="logout()" *ngIf="authService.isLoggedIn">Logout</button>
</p>`
  }



/// phone directive

phoneDirective(formatOne, formatTwo, length){
  return `
  import { Directive, HostListener} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPhoneFormat]'
})
export class PhoneFormatDirective {

  constructor (private ngControl: NgControl) {
  }

  @HostListener('keypress', ['$event'])
    keyEvent(event: KeyboardEvent) {
    console.log(event.charCode);
    if (!(event.charCode > 47 && event.charCode < 58 || event.charCode == 42)) {
      return false;
    }
  }
  
  @HostListener('change')
    ngOnChanges(){
      this.formatPhoneNumber();
    }

  @HostListener('keyup')
  keyUp() {
    this.formatPhoneNumber();
  }

  formatPhoneNumber(): any {
    let inputString = this.ngControl.control.value.replace(/\D/g, '');
    let phoneNumber = inputString.replace(/${formatOne}/, "${formatTwo}");
    if (phoneNumber.length > ${length}) {
      phoneNumber = phoneNumber.slice(0, ${length});
    }
    this.ngControl.control.setValue(phoneNumber)
  }
}
  `
}
}
