import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './project.component';
import { ComponentComponent } from './component/component.component';
import { ProjectsComponent } from './projects/projects.component';
import { ComponentsComponent } from './components/components.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectComponent,
    children: [
      {
      path: '',
      redirectTo: 'projects',
      pathMatch: 'full'
      },
      {
      path: 'projects',
      component: ProjectsComponent
      },
      {
        path: 'component',
        component: ComponentComponent
      },
      {
        path: 'components',
        component: ComponentsComponent
      },
      {
        path: 'newproject',
        loadChildren: './newproject/newproject.module#NewprojectModule'
      },
      {
        path: 'forms',
        loadChildren: './forms/form.module#FormModule'
      },
      /* {
        path: 'forms:id',
        loadChildren: './forms/forms.module#FormsModule'
      }, */
      {
        path: ':project/:component',
        component: ComponentsComponent
      },
      
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
