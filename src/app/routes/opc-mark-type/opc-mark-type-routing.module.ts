import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpcMarkTypeListComponent } from './list/list.component';

const routes: Routes = [

  { path: 'list', component: OpcMarkTypeListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpcMarkTypeRoutingModule { }
