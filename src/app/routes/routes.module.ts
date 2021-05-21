import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { CallbackComponent } from './callback/callback.component';
import { DashboardAnalysisComponent } from './dashboard/analysis/analysis.component';
import { DashboardMonitorComponent } from './dashboard/monitor/monitor.component';
// dashboard pages
import { DashboardV1Component } from './dashboard/v1/v1.component';
import { DashboardWorkplaceComponent } from './dashboard/workplace/workplace.component';
// single pages
import { UserLockComponent } from './passport/lock/lock.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { RouteRoutingModule } from './routes-routing.module';
import { StationMap } from '../shared/components/station-map/station-map';
import { FlowIndexThree } from '../shared/components/flow-index-three/flow-index-three';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { FlowIndexFour } from '../shared/components/flow-index-four/flow-index-four';
import { NgxEchartsModule } from 'ngx-echarts';
import { ConstructionCoordinatePlanModule } from './construction-coordinate-plan/construction-coordinate-plan.module';
import { FlowIndexFive } from '../shared/components/flow-index-five/flow-index-five';
import { OpcModule } from './opc/opc.module';
import { PlanLevelDateFilterPipe } from '../shared/pipe/construction-control-plan/plan-level-date-filter-pipe';
import { dailyPlanLevelDateFilterPipe } from '../shared/pipe/construction-control-plan/daily-plan-level-date-filter-pipe';
import { PlanFilterPipe } from '../shared/pipe/construction-control-plan/plan-filter-pipe';
import { WarningInfoFilterPipe } from '../shared/pipe/construction-control-plan/warning-info-filter-pipe';

const COMPONENTS = [
  DashboardV1Component,
  DashboardAnalysisComponent,
  DashboardMonitorComponent,
  DashboardWorkplaceComponent,
  // passport pages
  UserLoginComponent,
  UserRegisterComponent,
  UserRegisterResultComponent,
  // single pages
  UserLockComponent,
  CallbackComponent,
];

@NgModule({
  imports: [SharedModule, RouteRoutingModule, NzSpaceModule, NgxEchartsModule, ConstructionCoordinatePlanModule, OpcModule],
  declarations: [
    ...COMPONENTS,
    FlowIndexThree,
    FlowIndexFour,
    FlowIndexFive,
    PlanLevelDateFilterPipe,
    dailyPlanLevelDateFilterPipe,
    PlanFilterPipe,
    WarningInfoFilterPipe,
  ],
})
export class RoutesModule {}
