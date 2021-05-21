import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpcListComponent } from './list/list.component';
import { OpcUploadComponent } from './upload/upload.component';
import { OpcDetailComponent } from './detail/detail.component';
import { OpcOpcStationComponent } from './opc-station/opc-station.component';

const routes: Routes = [

  { path: 'list', component: OpcListComponent },
  { path: 'upload', component: OpcUploadComponent },
  { path: 'detail', component: OpcDetailComponent },
  { path: 'opc-station', component: OpcOpcStationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpcRoutingModule { }
