import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { RailwayLineRoutingModule } from './railway-line-routing.module';
import { RailwayLineListComponent } from './list/list.component';
import { RailwayLineDetailComponent } from './detail/detail.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RailwayLineRailwayLineStationDetailComponent } from './railway-line-station-detail/railway-line-station-detail.component';

const COMPONENTS: Type<void>[] = [RailwayLineListComponent, RailwayLineDetailComponent, RailwayLineRailwayLineStationDetailComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, RailwayLineRoutingModule, DragDropModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class RailwayLineModule {}
