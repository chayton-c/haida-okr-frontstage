import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeasurementTemplateListComponent } from './list/list.component';
import { MeasurementTemplateDetailComponent } from './detail/detail.component';
import { MeasurementTemplateLineListComponent } from './line-list/line-list.component';

const routes: Routes = [

  { path: 'list', component: MeasurementTemplateListComponent },
  { path: 'detail', component: MeasurementTemplateDetailComponent },
  { path: 'line-list', component: MeasurementTemplateLineListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeasurementTemplateRoutingModule { }
