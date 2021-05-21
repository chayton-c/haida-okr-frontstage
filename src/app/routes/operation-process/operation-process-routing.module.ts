import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationProcessDatePlanListComponent } from './date-plan-list/date-plan-list.component';
import { OperationProcessLocaleControlListComponent } from './locale-control-list/locale-control-list.component';
import { OperationProcessWarningInformationListComponent } from './warning-information-list/warning-information-list.component';
import { OperationProcessListComponent } from './list/list.component';

const routes: Routes = [
  { path: 'date-plan-list', component: OperationProcessDatePlanListComponent },
  { path: 'locale-control-list', component: OperationProcessLocaleControlListComponent },
  { path: 'warning-information-list', component: OperationProcessWarningInformationListComponent },
  { path: 'list', component: OperationProcessListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationProcessRoutingModule {}
