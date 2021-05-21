import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquipmentListComponent } from './list/list.component';
import { EquipmentInfoComponent } from './info/info.component';
import { EquipmentConstructionDailyPlanListComponent } from './construction-daily-plan-list/construction-daily-plan-list.component';
import { EquipmentConstructionControlPlanListComponent } from './construction-control-plan-list/construction-control-plan-list.component';

const routes: Routes = [

  { path: 'list', component: EquipmentListComponent },
  { path: 'info', component: EquipmentInfoComponent },
  { path: 'construction-daily-plan-list', component: EquipmentConstructionDailyPlanListComponent },
  { path: 'construction-control-plan-list', component: EquipmentConstructionControlPlanListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipmentRoutingModule { }
