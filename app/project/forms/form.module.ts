import { FormsRoutingModule } from './forms-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsComponent } from './forms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { FormatDirective } from '../../directives/format.directive';
import { PhoneFormatDirective } from '../../directives/phoneFormat.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormsRoutingModule,
    ClarityModule
  ],
  declarations: [FormsComponent, FormatDirective, PhoneFormatDirective]
})
export class FormModule { }
