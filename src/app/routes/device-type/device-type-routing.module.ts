import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceTypeDetailComponent } from './detail/detail.component';
import { DeviceTypeListComponent } from './list/list.component';

const routes: Routes = [
  { path: 'detail', component: DeviceTypeDetailComponent },
  { path: 'list', component: DeviceTypeListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceTypeRoutingModule {}
