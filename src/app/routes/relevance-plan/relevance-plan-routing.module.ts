import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RelevancePlanUploadListComponent } from './upload-list/upload-list.component';
import { RelevancePlanRelevanceListComponent } from './relevance-list/relevance-list.component';
import { RelevancePlanRelevanceDetailComponent } from './relevance-detail/relevance-detail.component';

const routes: Routes = [
  { path: 'upload-list', component: RelevancePlanUploadListComponent },
  { path: 'relevance-list', component: RelevancePlanRelevanceListComponent },
  { path: 'relevance-detail', component: RelevancePlanRelevanceDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelevancePlanRoutingModule {}
