import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { OpcMarkTypeRoutingModule } from './opc-mark-type-routing.module';
import { OpcMarkTypeListComponent } from './list/list.component';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';

const COMPONENTS: Type<void>[] = [OpcMarkTypeListComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, OpcMarkTypeRoutingModule, NzTreeSelectModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class OpcMarkTypeModule {}
