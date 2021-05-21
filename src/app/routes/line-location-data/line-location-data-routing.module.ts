import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LineLocationDataListComponent } from './list/list.component';

const routes: Routes = [

  { path: 'list', component: LineLocationDataListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LineLocationDataRoutingModule { }
