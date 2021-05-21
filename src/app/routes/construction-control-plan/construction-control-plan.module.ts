import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { ConstructionControlPlanRoutingModule } from './construction-control-plan-routing.module';
import { ConstructionControlPlanListComponent } from './list/list.component';
import { OpcModule } from '../opc/opc.module';
import { ConstructionControlPlanCreateComponent } from './create/create.component';
import { ConstructionControlPlanDetailComponent } from './detail/detail.component';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { ConstructionControlPlanPreviewComponent } from './preview/preview.component';
import { ConstructionControlPlanUploadComponent } from './upload/upload.component';
import { ConstructionControlPlanApproveComponent } from './approve/approve.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {ConstructionCoordinatePlanModule} from "../construction-coordinate-plan/construction-coordinate-plan.module";

const COMPONENTS: Type<void>[] = [
  ConstructionControlPlanListComponent,
  ConstructionControlPlanCreateComponent,
  ConstructionControlPlanDetailComponent,
  ConstructionControlPlanPreviewComponent,
  ConstructionControlPlanUploadComponent,
  ConstructionControlPlanApproveComponent,
];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
    imports: [SharedModule, ConstructionControlPlanRoutingModule, OpcModule, NzTreeSelectModule, LeafletModule, ConstructionCoordinatePlanModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class ConstructionControlPlanModule {}
