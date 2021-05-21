import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestTestDragComponent } from './test-drag/test-drag.component';
import { TestTestWebsocketComponent } from './test-websocket/test-websocket.component';

const routes: Routes = [
  { path: 'test-drag', component: TestTestDragComponent },
  { path: 'test-websocket', component: TestTestWebsocketComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestRoutingModule {}
