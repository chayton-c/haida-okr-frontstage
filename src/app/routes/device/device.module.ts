import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { DeviceRoutingModule } from './device-routing.module';
import { DeviceDetailComponent } from './detail/detail.component';
import { DeviceListComponent } from './list/list.component';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';

const COMPONENTS: Type<void>[] = [DeviceDetailComponent, DeviceListComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, DeviceRoutingModule, NzTreeSelectModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class DeviceModule {}
