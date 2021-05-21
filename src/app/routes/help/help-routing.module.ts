import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpProjectSignificanceComponent } from './project-significance/project-significance.component';
import { HelpAboutUsComponent } from './about-us/about-us.component';

const routes: Routes = [
  { path: 'project-significance', component: HelpProjectSignificanceComponent },
  { path: 'about-us', component: HelpAboutUsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpRoutingModule {}
