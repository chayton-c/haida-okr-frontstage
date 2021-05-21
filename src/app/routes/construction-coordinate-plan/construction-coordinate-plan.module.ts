import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { ConstructionCoordinatePlanRoutingModule } from './construction-coordinate-plan-routing.module';
import { ConstructionCoordinatePlanListComponent } from './list/list.component';
import { ConstructionCoordinatePlanDetailComponent } from './detail/detail.component';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { ConstructionControlPlanPreview } from '../../shared/components/construction-control-plan/preview/construction-control-plan-preview';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { KilometerPipe } from '../../shared/pipe/kilometer-pipe';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { ConstructionControlPlanView } from '../../shared/components/construction-control-plan/view/construction-control-plan-view';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { ConstructionControlPlanPreviewInfo } from "../../shared/components/construction-control-plan/preview-info/construction-control-plan-preview-info";
import {DistanceFromRailwayPipe} from "../../shared/pipe/construction-control-plan/distance-from-railway-pipe";

const COMPONENTS: Type<void>[] = [
  ConstructionCoordinatePlanListComponent,
];
const COMPONENTS_NOROUNT: Type<void>[] = [ConstructionCoordinatePlanDetailComponent];

@NgModule({
  imports: [SharedModule, ConstructionCoordinatePlanRoutingModule, NzTreeSelectModule, LeafletModule, NzSpaceModule, NzDescriptionsModule],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    ConstructionControlPlanPreview,
    KilometerPipe,
    ConstructionControlPlanView,
    ConstructionControlPlanView,
    ConstructionControlPlanPreviewInfo,
    DistanceFromRailwayPipe,
  ],
    exports: [KilometerPipe, ConstructionControlPlanPreview, ConstructionControlPlanPreviewInfo, DistanceFromRailwayPipe, ConstructionControlPlanView],
})
export class ConstructionCoordinatePlanModule {}
