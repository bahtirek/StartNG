import { NewprojectComponent } from './newproject.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: NewprojectComponent
  },
  {
    path: ':project',
    component: NewprojectComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewprojectRoutingModule { }
