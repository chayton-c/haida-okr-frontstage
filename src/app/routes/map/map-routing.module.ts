import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapMapComponent } from './map/map.component';

const routes: Routes = [

  { path: 'map', component: MapMapComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapRoutingModule { }
