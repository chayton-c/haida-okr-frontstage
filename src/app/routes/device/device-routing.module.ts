import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceDetailComponent } from './detail/detail.component';
import { DeviceListComponent } from './list/list.component';

const routes: Routes = [
  { path: 'detail', component: DeviceDetailComponent },
  { path: 'list', component: DeviceListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceRoutingModule {}
