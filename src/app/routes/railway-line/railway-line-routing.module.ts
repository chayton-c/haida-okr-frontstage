import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RailwayLineListComponent } from './list/list.component';
import { RailwayLineDetailComponent } from './detail/detail.component';
import { RailwayLineRailwayLineStationDetailComponent } from './railway-line-station-detail/railway-line-station-detail.component';

const routes: Routes = [
  { path: 'list', component: RailwayLineListComponent },
  { path: 'detail', component: RailwayLineDetailComponent },
  { path: 'railway-line-station-detail', component: RailwayLineRailwayLineStationDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RailwayLineRoutingModule {}
