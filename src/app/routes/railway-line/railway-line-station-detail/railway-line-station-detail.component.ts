import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {RailwayLine} from "../../../pojos/railway-line/railway-line";
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Station} from "../../../pojos/station/station";

@Component({
  selector: 'app-railway-line-railway-line-station-detail',
  templateUrl: './railway-line-station-detail.component.html',
})
export class RailwayLineRailwayLineStationDetailComponent implements OnInit {
  validateForm: FormGroup;
  railwayLine: RailwayLine = {
    id: '',
    name: '',
    code: ''
  };
  stations: Station[] = [];
  loading = false;

  executeRailwayLineInfo() {
    const params = {
      railwayLineId: this.railwayLine.id,
      stationId: this.railwayLine.stationId,
    };
    this.http.post('/api/backstage/station/linkageStationAndRailwayLine', null, params).subscribe((res) => {
      if (!res.success) return;

      this.msg.success(res.msg);
      this.router.navigate(['/railway-line/list']);
    });
  }

  loadDataFromServer(): void {
    this.http
      .post('/api/backstage/railwayLine/info', null, {
        id: this.railwayLine.id,
      })
      .subscribe((res) => {
        if (!res.success) return;
        this.loading = false;
        this.railwayLine = res.railwayLine;
        this.stations = res.stations;
      });
  }

  constructor(
    public http: _HttpClient,
    private activatedRoute: ActivatedRoute,
    private msg: NzMessageService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.validateForm = this.fb.group({
      stationId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // 获取roleId
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.railwayLineId) this.railwayLine.id = queryParams.railwayLineId;
    });
    // 加载菜单信息
    this.loadDataFromServer();
  }
}
