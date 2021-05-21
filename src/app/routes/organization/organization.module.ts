import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { OrganizationRoutingModule } from './organization-routing.module';
import { OrganizationListComponent } from './list/list.component';
import { OrganizationDetailComponent } from './detail/detail.component';

const COMPONENTS: Type<void>[] = [
  OrganizationListComponent,
  OrganizationDetailComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [
    SharedModule,
    OrganizationRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class OrganizationModule { }
