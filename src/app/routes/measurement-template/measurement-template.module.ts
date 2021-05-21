import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { MeasurementTemplateRoutingModule } from './measurement-template-routing.module';
import { MeasurementTemplateListComponent } from './list/list.component';
import { MeasurementTemplateDetailComponent } from './detail/detail.component';
import {Step1Component} from "./detail/step1.component";
import {Step2Component} from "./detail/step2.component";
import { MeasurementTemplateLineListComponent } from './line-list/line-list.component';

const COMPONENTS: Type<void>[] = [
  MeasurementTemplateListComponent,
  MeasurementTemplateDetailComponent,
  MeasurementTemplateLineListComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [
    SharedModule,
    MeasurementTemplateRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    Step1Component,
    Step2Component,
  ],
})
export class MeasurementTemplateModule { }
