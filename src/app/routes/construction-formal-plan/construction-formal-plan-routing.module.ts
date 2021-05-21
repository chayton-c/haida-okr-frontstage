import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConstructionFormalPlanListComponent } from './list/list.component';
import { ConstructionFormalPlanSignInComponent } from './sign-in/sign-in.component';
import { ConstructionFormalPlanDetailComponent } from './detail/detail.component';

const routes: Routes = [
  { path: 'list', component: ConstructionFormalPlanListComponent },
  { path: 'sign-in', component: ConstructionFormalPlanSignInComponent },
  { path: 'detail', component: ConstructionFormalPlanDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConstructionFormalPlanRoutingModule {}
