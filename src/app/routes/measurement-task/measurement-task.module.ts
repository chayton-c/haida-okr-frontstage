import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { MeasurementTaskRoutingModule } from './measurement-task-routing.module';
import { MeasurementTaskListComponent } from './list/list.component';

const COMPONENTS: Type<void>[] = [
  MeasurementTaskListComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [
    SharedModule,
    MeasurementTaskRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class MeasurementTaskModule { }
