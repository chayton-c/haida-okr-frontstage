import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { RelevancePlanRoutingModule } from './relevance-plan-routing.module';
import { RelevancePlanUploadListComponent } from './upload-list/upload-list.component';
import { RelevancePlanRelevanceListComponent } from './relevance-list/relevance-list.component';
import {ConstructionCoordinatePlanModule} from "../construction-coordinate-plan/construction-coordinate-plan.module";
import {ConstructionControlPlanRelevanceDetail} from "../../shared/components/construction-control-plan/relevance/construction-control-plan-relevance-detail";
import {NzDescriptionsModule} from "ng-zorro-antd/descriptions";
import { RelevancePlanRelevanceDetailComponent } from './relevance-detail/relevance-detail.component';

const COMPONENTS: Type<void>[] = [RelevancePlanUploadListComponent, RelevancePlanRelevanceListComponent,
  RelevancePlanRelevanceDetailComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
    imports: [SharedModule, RelevancePlanRoutingModule, ConstructionCoordinatePlanModule, NzDescriptionsModule],
    declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT, ConstructionControlPlanRelevanceDetail],
})
export class RelevancePlanModule {}
