import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { CenterScreenRoutingModule } from './center-screen-routing.module';
import { CenterScreenScreenComponent } from './screen/screen.component';
import { RoutesModule } from '../routes.module';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { ConstructionCoordinatePlanModule } from '../construction-coordinate-plan/construction-coordinate-plan.module';
import { TodayListComponent } from '../../shared/components/construction-daily-plan/today-list/today-component-list';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { CenterScreenSetScreenComponent } from './set-screen/set-screen.component';
import { CookieService } from 'ngx-cookie-service';
import { CenterScreenSetPositionComponent } from './set-position/set-position.component';
import { OpcModule } from '../opc/opc.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

const COMPONENTS: Type<void>[] = [CenterScreenScreenComponent, CenterScreenSetScreenComponent, CenterScreenSetPositionComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [
    SharedModule,
    CenterScreenRoutingModule,
    NzTreeSelectModule,
    ConstructionCoordinatePlanModule,
    NzSpaceModule,
    OpcModule,
    DragDropModule,
  ],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT, TodayListComponent],
  providers: [CookieService],
})
export class CenterScreenModule {}
