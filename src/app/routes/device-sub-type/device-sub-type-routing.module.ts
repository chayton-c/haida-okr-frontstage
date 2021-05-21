import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceSubTypeDetailComponent } from './detail/detail.component';

const routes: Routes = [{ path: 'detail', component: DeviceSubTypeDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceSubTypeRoutingModule {}
