import { TreeViewComponent } from './../tree-view/tree-view.component';
import { ProjectMapComponent } from './project-map/project-map.component';
import { ClarityModule} from '@clr/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';
import { ComponentComponent } from './component/component.component';
import { FormsModule } from '@angular/forms';
import { ProjectsComponent } from './projects/projects.component';
import { ComponentsComponent } from './components/components.component';
import { EditNameComponent } from './edit-name/edit-name.component';
@NgModule({
  imports: [
    CommonModule,
    ProjectRoutingModule,
    FormsModule,
    ClarityModule
  ],
  declarations: [ComponentsComponent, ProjectComponent, ComponentComponent, ProjectMapComponent, ProjectsComponent, 
    EditNameComponent, TreeViewComponent]
})
export class ProjectModule { }
