import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { OpcTypeRoutingModule } from './opc-type-routing.module';
import { OpcTypeListComponent } from './list/list.component';

const COMPONENTS: Type<void>[] = [
  OpcTypeListComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [
    SharedModule,
    OpcTypeRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class OpcTypeModule { }
