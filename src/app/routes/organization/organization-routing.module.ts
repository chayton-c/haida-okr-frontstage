import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationListComponent } from './list/list.component';
import { OrganizationDetailComponent } from './detail/detail.component';

const routes: Routes = [

  { path: 'list', component: OrganizationListComponent },
  { path: 'detail', component: OrganizationDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }
