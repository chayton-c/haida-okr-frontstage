import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { HelpRoutingModule } from './help-routing.module';
import { HelpProjectSignificanceComponent } from './project-significance/project-significance.component';
import { HelpAboutUsComponent } from './about-us/about-us.component';

const COMPONENTS: Type<void>[] = [HelpProjectSignificanceComponent, HelpAboutUsComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, HelpRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class HelpModule {}
