import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleListComponent } from './list/list.component';
import { RoleDetailComponent } from './detail/detail.component';

const routes: Routes = [

  { path: 'list', component: RoleListComponent },
  { path: 'detail', component: RoleDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
