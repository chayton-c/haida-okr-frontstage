import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConstructionControlPlanListComponent } from './list/list.component';
import { ConstructionControlPlanCreateComponent } from './create/create.component';
import { ConstructionControlPlanDetailComponent } from './detail/detail.component';
import { ConstructionControlPlanPreviewComponent } from './preview/preview.component';
import { ConstructionControlPlanUploadComponent } from './upload/upload.component';
import { ConstructionControlPlanApproveComponent } from './approve/approve.component';

const routes: Routes = [

  { path: 'list', component: ConstructionControlPlanListComponent },
  { path: 'create', component: ConstructionControlPlanCreateComponent },
  { path: 'detail', component: ConstructionControlPlanDetailComponent },
  { path: 'preview', component: ConstructionControlPlanPreviewComponent },
  { path: 'upload', component: ConstructionControlPlanUploadComponent },
  { path: 'approve', component: ConstructionControlPlanApproveComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConstructionControlPlanRoutingModule { }
