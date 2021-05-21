import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CenterScreenScreenComponent } from './screen/screen.component';
import { CenterScreenSetScreenComponent } from './set-screen/set-screen.component';
import { CenterScreenSetPositionComponent } from './set-position/set-position.component';

const routes: Routes = [
  { path: 'screen', component: CenterScreenScreenComponent },
  { path: 'set-screen', component: CenterScreenSetScreenComponent },
  { path: 'set-position', component: CenterScreenSetPositionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CenterScreenRoutingModule {}
