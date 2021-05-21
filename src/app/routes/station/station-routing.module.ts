import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StationDetailComponent } from './detail/detail.component';
import { StationListComponent } from './list/list.component';

const routes: Routes = [{ path: 'detail', component: StationDetailComponent },
  { path: 'list', component: StationListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StationRoutingModule {}
