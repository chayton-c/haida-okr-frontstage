import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { ConstructionFormalPlanRoutingModule } from './construction-formal-plan-routing.module';
import { ConstructionFormalPlanListComponent } from './list/list.component';
import { ConstructionFormalPlanSignInComponent } from './sign-in/sign-in.component';
import { ConstructionFormalPlanDetailComponent } from './detail/detail.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

const COMPONENTS: Type<void>[] = [
  ConstructionFormalPlanListComponent,
  ConstructionFormalPlanSignInComponent,
  ConstructionFormalPlanDetailComponent,
];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, ConstructionFormalPlanRoutingModule, LeafletModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class ConstructionFormalPlanModule {}
