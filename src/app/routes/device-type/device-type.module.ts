import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { DeviceTypeRoutingModule } from './device-type-routing.module';
import { DeviceTypeDetailComponent } from './detail/detail.component';
import { DeviceTypeListComponent } from './list/list.component';

const COMPONENTS: Type<void>[] = [DeviceTypeDetailComponent, DeviceTypeListComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, DeviceTypeRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class DeviceTypeModule {}
