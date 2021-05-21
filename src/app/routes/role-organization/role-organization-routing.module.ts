import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleOrganizationDetailComponent } from './detail/detail.component';

const routes: Routes = [

  { path: 'detail', component: RoleOrganizationDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleOrganizationRoutingModule { }
