import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { Router } from '@angular/router';
import { NzTreeNodeOptions } from 'ng-zorro-antd/core/tree';
import { OpcStatistics } from 'src/app/pojos/opc/opc-statistics';

@Component({
  selector: 'app-opc-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class OpcUploadComponent implements OnInit {
  listOfData = [{ id: 1 }]; // 啥也不传的话，列表会显示emptyData
  lineSelectTreeNodes: Array<NzTreeNodeOptions> = [];
  organizationValues: string[] = [];
  lineStationValues: string[] = [];
  stationId?: string;
  @ViewChild('constructionControlPlanPreview') constructionControlPlanPreview: any;

  opcStatistics: OpcStatistics = {
    opcMileage: 0,
    railwayLineMileage: 0,
  };

  constructor(public http: _HttpClient, private msg: NzMessageService, public injector: Injector, public router: Router) {}

  updateOrganizationValues($event: any): void {}
  updatelineStationValues($event: any): void {
    console.log($event);
    if (($event as string[]).length > 1) {
      this.stationId = $event[1];
      setTimeout(() => {
        this.constructionControlPlanPreview.ngOnInit();
      }, 500);
    }
  }

  // 加载数据
  opcMileage: string = '-';
  railwayLineMileage: string = '-';
  loadData() {
    this.http.post('/api/backstage/opc/getRailwayLineOrOpcStatistics').subscribe((res) => {
      if (!res.success) return;
      this.opcStatistics = res.opcStatistics;
      this.opcMileage = (Number(this.opcStatistics.opcMileage.toFixed(2)) > 0
        ? (this.opcStatistics.opcMileage / 1000).toFixed(2)
        : '-'
      ).toString();
      this.railwayLineMileage = (Number(this.opcStatistics.railwayLineMileage.toFixed(2)) > 0
        ? this.opcStatistics.railwayLineMileage.toFixed(2)
        : '-'
      ).toString();
    });
  }
  ngOnInit(): void {
    this.loadData();
  }
}
