import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { MapRoutingModule } from './map-routing.module';
import { MapMapComponent } from './map/map.component';

const COMPONENTS: Type<void>[] = [
  MapMapComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [
    SharedModule,
    MapRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class MapModule { }
