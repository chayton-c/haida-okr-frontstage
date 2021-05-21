import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { RailwayLineSectionLogComponent } from './log/log.component';
import { RailwayLineSectionRoutingModule } from './railway-line-section-routing.module';
import { RailwayLineSectionListComponent } from './list/list.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

const COMPONENTS: Type<void>[] = [RailwayLineSectionLogComponent, RailwayLineSectionListComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, RailwayLineSectionRoutingModule, LeafletModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class RailwayLineSectionModule {}
