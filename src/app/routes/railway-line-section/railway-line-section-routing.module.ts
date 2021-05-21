import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RailwayLineSectionLogComponent } from './log/log.component';
import { RailwayLineSectionListComponent } from './list/list.component';

const routes: Routes = [
  { path: 'log', component: RailwayLineSectionLogComponent },
  { path: 'list', component: RailwayLineSectionListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RailwayLineSectionRoutingModule {}
