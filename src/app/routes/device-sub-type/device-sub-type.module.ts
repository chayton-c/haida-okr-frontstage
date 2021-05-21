import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { DeviceSubTypeRoutingModule } from './device-sub-type-routing.module';
import { DeviceSubTypeDetailComponent } from './detail/detail.component';

const COMPONENTS: Type<void>[] = [DeviceSubTypeDetailComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, DeviceSubTypeRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class DeviceSubTypeModule {}
