import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpcTypeListComponent } from './list/list.component';

const routes: Routes = [

  { path: 'list', component: OpcTypeListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpcTypeRoutingModule { }
