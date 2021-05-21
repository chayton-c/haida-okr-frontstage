import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './list/list.component';
import { UserDetailComponent } from './detail/detail.component';

const routes: Routes = [

  { path: 'list', component: UserListComponent },
  { path: 'detail', component: UserDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
