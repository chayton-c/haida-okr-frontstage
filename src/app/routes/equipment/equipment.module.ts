import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { EquipmentRoutingModule } from './equipment-routing.module';
import { EquipmentListComponent } from './list/list.component';
import { EquipmentInfoComponent } from './info/info.component';
import {ConstructionCoordinatePlanModule} from "../construction-coordinate-plan/construction-coordinate-plan.module";
import { EquipmentConstructionDailyPlanListComponent } from './construction-daily-plan-list/construction-daily-plan-list.component';
import { EquipmentConstructionControlPlanListComponent } from './construction-control-plan-list/construction-control-plan-list.component';

const COMPONENTS: Type<void>[] = [
  EquipmentListComponent,
  EquipmentInfoComponent,
  EquipmentConstructionDailyPlanListComponent,
  EquipmentConstructionControlPlanListComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [
    SharedModule,
    EquipmentRoutingModule,
    ConstructionCoordinatePlanModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class EquipmentModule { }
