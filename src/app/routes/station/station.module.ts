import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { StationRoutingModule } from './station-routing.module';
import { StationDetailComponent } from './detail/detail.component';
import { StationListComponent } from './list/list.component';

const COMPONENTS: Type<void>[] = [StationDetailComponent,
  StationListComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, StationRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class StationModule {}
