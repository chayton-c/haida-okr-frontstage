import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { LineLocationDataRoutingModule } from './line-location-data-routing.module';
import { LineLocationDataListComponent } from './list/list.component';
import { OpcModule } from '../opc/opc.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

const COMPONENTS: Type<void>[] = [LineLocationDataListComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, LineLocationDataRoutingModule, OpcModule, LeafletModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class LineLocationDataModule {}
