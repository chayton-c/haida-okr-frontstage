import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { RoleRoutingModule } from './role-routing.module';
import { RoleListComponent } from './list/list.component';
import { RoleDetailComponent } from './detail/detail.component';
import {Step1Component} from "./detail/step1.component";
import {Step2Component} from "./detail/step2.component";

const COMPONENTS: Type<void>[] = [
  RoleListComponent,
  RoleDetailComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [
    SharedModule,
    RoleRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    Step1Component,
    Step2Component
  ],
})
export class RoleModule { }
