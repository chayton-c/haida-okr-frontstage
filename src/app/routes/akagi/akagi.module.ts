import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { AkagiRoutingModule } from './akagi-routing.module';

const COMPONENTS: Type<void>[] = [];

@NgModule({
  imports: [
    SharedModule,
    AkagiRoutingModule
  ],
  declarations: COMPONENTS,
})
export class AkagiModule { }
