import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { OperationProcessRoutingModule } from './operation-process-routing.module';
import { OperationProcessDatePlanListComponent } from './date-plan-list/date-plan-list.component';
import { OperationProcessLocaleControlListComponent } from './locale-control-list/locale-control-list.component';
import { OperationProcessWarningInformationListComponent } from './warning-information-list/warning-information-list.component';
import { OperationProcessListComponent } from './list/list.component';
import {ConstructionCoordinatePlanModule} from "../construction-coordinate-plan/construction-coordinate-plan.module";
import {ConstructionDailyPlanDetail} from "../../shared/components/construction-daily-plan/detail/construction-daily-plan-detail";
import {NzDescriptionsModule} from "ng-zorro-antd/descriptions";

const COMPONENTS: Type<void>[] = [
  OperationProcessDatePlanListComponent,
  OperationProcessLocaleControlListComponent,
  OperationProcessWarningInformationListComponent,
  OperationProcessListComponent,
];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
    imports: [SharedModule, OperationProcessRoutingModule, ConstructionCoordinatePlanModule, NzDescriptionsModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT, ConstructionDailyPlanDetail],
})
export class OperationProcessModule {}
