import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeasurementTaskListComponent } from './list/list.component';

const routes: Routes = [

  { path: 'list', component: MeasurementTaskListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeasurementTaskRoutingModule { }
