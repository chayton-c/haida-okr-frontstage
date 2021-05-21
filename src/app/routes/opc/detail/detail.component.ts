import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {_HttpClient, TitleService} from '@delon/theme';
import {NzMessageService} from "ng-zorro-antd/message";
import {ActivatedRoute, Router} from "@angular/router";
import {RailwayLine} from "../../../pojos/railway-line/railway-line";
import {Station} from "../../../pojos/station/station";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {OpcMark} from "../../../pojos/opc/opc-mark";
import {OpcMarkType} from "../../../pojos/opc/opc-mark-type";


interface OpcMarkEditable extends OpcMark {
  edit?: boolean
  persistent?: boolean; // 持久状态(已插入到数据库的)
}

@Component({
  selector: 'app-opc-detail',
  templateUrl: './detail.component.html',
})
export class OpcDetailComponent implements OnInit {

  ngOnInit(): void {
    this.titleService.setTitle('光电缆详情');
    // this.loadDataFromServer();
  }

  constructor(
    private titleService: TitleService,
    public http: _HttpClient,
    private msg: NzMessageService,
    private activatedRoute: ActivatedRoute,
    public injector: Injector,
    public router: Router) {
  }


  // 加载线路，车站及光缆标
  loadDataFromServer(): void {
    const params = {
      pageSize: this.opcMarkPageSize,
      currentPage: this.opcMarkPageIndex,
      stationId: this.stationId,
      name: this.opcMarkSelectForm.name,
      opcMarkTypeId: this.opcMarkSelectForm.opcMarkTypeId,
    }

    this.http.post('/api/backstage/opcMark/initOpcDetailPage', null, params).subscribe((res) => {
      if (!res.success) return;

      this.stations = res.stations;
      this.railwayLines = res.railwayLines;
      this.opcMarkTypes = res.opcMarkTypes;
      this.opcMarks = res.opcMarks;
      this.stationId = res.stationId;

      this.opcMarks.forEach(value => {
        value.edit = false;
        value.persistent = true;
      });

      this.updateEditCache();
      this.opcMarkTotal = res.page.dataTotal;
      console.log(this.stationId);
      this.constructionControlPlanPreview.ngOnInit();
    });
  }

  // 左侧opcMark可编辑列表部分
  editCache: { [key: string]: { edit: boolean; data: OpcMarkEditable } } = {};
  opcMarks: OpcMarkEditable[] = [];
  opcMarkTypes: OpcMarkType[] = [];
  opcMarkLoading = false;
  opcMarkTotal = 1;
  opcMarkPageSize = 10;
  opcMarkPageIndex = 1;
  opcMarkSelectForm: {
    opcMarkTypeId?: string,
    name?: string
  } = {};

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  saveEdit(id: string): void {
    let opcMark = this.editCache[id].data;

    this.http.post('/api/backstage/opcMark/saveOrUpdate', null, {
      id: opcMark.id,
      name: opcMark.name,
      opcMarkTypeId: opcMark.opcMarkTypeId,
      kilometerMark: opcMark.kilometerMark,
    })
      .subscribe((res) => {
        if (!res.success) return;
        this.opcMarkLoading = false;
        this.editCache[id].edit = false;
        if (res.opcMarks) this.opcMarks = res.opcMarks;
        let editOpcMark = this.opcMarks.find(x => x.id = id);
        editOpcMark!.kilometerMark = opcMark.kilometerMark;
        editOpcMark!.name = opcMark.name;


        const index = this.opcMarks.findIndex(item => item.id === id);
        opcMark.persistent = true;
        this.opcMarks[index] = opcMark;

        this.updateEditCache();
      });
  }

  changeOpcMarkType(id: string, opcMarkEditable: OpcMarkEditable): void {
    let opcMark = this.opcMarks.filter(value => value.id == id);
    opcMarkEditable.typeName = opcMark[0].typeName;
  }

  updateEditCache(): void {
    this.opcMarks.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: {...item}
      };
    });
  }

  cancelEdit(id: string): void {
    const index = this.opcMarks.findIndex(item => item.id === id);
    let opcMark = this.opcMarks[index];

    let persistent = opcMark.persistent;
    if (persistent) {
      this.editCache[id] = {
        data: {...this.opcMarks[index]},
        edit: false,
      };
    } else {
      this.opcMarks = this.opcMarks.filter(value => value.persistent);
      this.updateEditCache();
    }
  }

  onQueryLocationParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex} = params;
    this.opcMarkPageSize = pageSize;
    this.opcMarkPageIndex = pageIndex;
    this.loadDataFromServer();
  }

  // 右侧地图参数部分
  @ViewChild('constructionControlPlanPreview') constructionControlPlanPreview: any;
  railwayLines: RailwayLine[] = [];
  stations: Station[] = [];
  lineStationCasecadeValue: string[] = [];
  railwayLineId: string | undefined = undefined;
  stationId: string | undefined = undefined;

  lineStationValueChange(lineStationCasecadeValue: string[]) {
    if ((lineStationCasecadeValue as string[]).length > 1) {
      this.railwayLineId = lineStationCasecadeValue[0];
      this.stationId = lineStationCasecadeValue[1];
      setTimeout(() => {
        this.constructionControlPlanPreview.ngOnInit();
      }, 500);
    }
  }

  selectFocusOpcMarkId(opcMarkId: string) {
    const params = {
      stationId: this.stationId,
      pageSize: this.opcMarkPageSize,
      currentPage: this.opcMarkPageIndex,
      opcMarkId: opcMarkId,
    }

    this.http.post('/api/backstage/opcMark/initOpcDetailPage', null, params).subscribe((res) => {
      if (!res.success) return;

      this.stations = res.stations;
      this.railwayLines = res.railwayLines;
      this.opcMarkTypes = res.opcMarkTypes;
      this.opcMarks = res.opcMarks;
      this.stationId = res.stationId;

      this.opcMarks.forEach(value => {
        value.edit = false;
        value.persistent = true;
      });

      this.updateEditCache();
      this.opcMarkTotal = res.page.dataTotal;
    });
  }
}
