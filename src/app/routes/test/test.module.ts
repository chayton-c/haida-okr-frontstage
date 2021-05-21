import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { TestRoutingModule } from './test-routing.module';
import { TestTestDragComponent } from './test-drag/test-drag.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TestTestWebsocketComponent } from './test-websocket/test-websocket.component';
import { OpcModule } from '../opc/opc.module';

const COMPONENTS: Type<void>[] = [TestTestDragComponent, TestTestWebsocketComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, TestRoutingModule, DragDropModule, OpcModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class TestModule {}
