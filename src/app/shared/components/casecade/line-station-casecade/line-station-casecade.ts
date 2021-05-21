import {ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { NzTreeNodeOptions } from 'ng-zorro-antd/core/tree';
import {
  ConstructionControlPlan,
  ConstructionControlPlanConstant,
} from '../../../../pojos/construction-control-plan/construction-control-plan';
import { Station } from '../../../../pojos/station/station';
import { User } from '../../../../pojos/user/user';
import { Organization } from '../../../../pojos/organization/organization';
import { HttpUtils } from '../../../utils/http-utils';
import { RailwayLine } from '../../../../pojos/railway-line/railway-line';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import {ConstructionDailyPlan, ConstructionDailyPlanConstant} from '../../../../pojos/construction-control-plan/construction-daily-plan';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import {UtilComponent} from "../../../../routes/delon/util/util.component";
import {NzCascaderOption} from "ng-zorro-antd/cascader/typings";
import {StringUtils} from "../../../utils/string-utils";

@Component({
  selector: 'line-station-casecade',
  templateUrl: './line-station-casecade.html',
})
export class LineStationCasecade {
  @Input() public values: string[] = [];
  @Output() public valuesChange = new EventEmitter();
  @Input() public defaultValue: boolean = false;

  lineStationCasecaderOption: Array<NzCascaderOption> = [];

  constructor(
    public http: _HttpClient,
    private activatedRoute: ActivatedRoute,
    private msg: NzMessageService,
    private router: Router,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}

  onChanges($event: any) {
    this.valuesChange.emit($event);
  }

  ngOnInit(): void {
    this.initPage();
  }

  initPage(): void {
    this.http.post('/api/backstage/line/initSelectTrees').subscribe((res) => {
      this.lineStationCasecaderOption = res.lineSelectTreeNodes;
      this.lineStationCasecaderOption.forEach(node => {
        node.expanded = true;
        node.children?.forEach(child => child.isLeaf = true);
      });

      if (StringUtils.arrayNotEmpty(this.values)) return;
      if (!this.defaultValue) return;
      if (StringUtils.arrayNotEmpty(this.lineStationCasecaderOption) && StringUtils.arrayNotEmpty(this.lineStationCasecaderOption[0].children)) {
        this.values = [this.lineStationCasecaderOption[0].value, this.lineStationCasecaderOption[0].children![0].value];
        this.onChanges(this.values);
      }
    });
  }
}
