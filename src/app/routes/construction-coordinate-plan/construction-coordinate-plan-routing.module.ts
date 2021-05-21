import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConstructionCoordinatePlanListComponent } from './list/list.component';

const routes: Routes = [
  { path: 'list', component: ConstructionCoordinatePlanListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConstructionCoordinatePlanRoutingModule {}
