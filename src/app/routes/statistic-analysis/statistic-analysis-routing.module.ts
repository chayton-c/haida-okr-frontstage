import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatisticAnalysisMainComponent } from './main/main.component';

const routes: Routes = [{ path: 'main', component: StatisticAnalysisMainComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticAnalysisRoutingModule {}
