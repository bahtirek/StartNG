import { EditNameComponent } from './../edit-name/edit-name.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewprojectRoutingModule } from './newproject-routing.module';
import { NewprojectComponent } from './newproject.component';
import { ClarityModule } from '@clr/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NewprojectRoutingModule,
    ClarityModule
  ],
  declarations: [NewprojectComponent]
})
export class NewprojectModule { }
