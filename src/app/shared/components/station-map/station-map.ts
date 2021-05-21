import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Time } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTreeNodeOptions } from 'ng-zorro-antd/core/tree';
import { OnReuseInit, ReuseHookOnReuseInitType} from "@delon/abc/reuse-tab";
import { Device } from '../../../pojos/device/device';
import { Opc } from '../../../pojos/opc/opc';
import { OpcMark } from '../../../pojos/opc/opc-mark';
import { ContainsLocationData, Location } from '../../../pojos/location/location';
import { OpcType } from '../../../pojos/opc/opc-type';
import { OpcMarkType } from '../../../pojos/opc/opc-mark-type';

declare var BMapGL: any;
declare var BMapGLLib: any;

interface FormParams {
  opcId: string;
  opcMarkTypeId: string;
  opcMarkName: string;
}

@Component({
  selector: 'station-map',
  templateUrl: './station-map.html',
})
export class StationMap implements OnInit {
  @Input() leftStationId: string = '';
  left1 = '55.5%';
  top1 = '64%';

  clickHarbinDongQiPao(): void {
    this.router.navigate(['/construction-control-plan/preview'], {
      queryParams: { constructionControlPlanId: 'f576c979-c8d0-4b01-a0fc-63d719617656' },
    });
  }

  clickXinXiangFang(): void {
    this.router.navigate(['/construction-control-plan/preview'], {
      queryParams: { constructionControlPlanId: '27f3cc4d-b092-426c-b999-c3b0e175a48d' },
    });
  }

  clickACheng(): void {
    this.router.navigate(['/construction-control-plan/preview'], {
      queryParams: { constructionControlPlanId: '73b7fe90-0033-48c0-b26c-46de48e076c9' },
    });
  }

  constructor(public http: _HttpClient, public injector: Injector, public router: Router, public msg: NzMessageService) {}

  ngOnInit(): void {}
}
