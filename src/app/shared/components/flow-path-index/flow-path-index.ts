import { Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

declare var BMapGL: any;
declare var BMapGLLib: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'flow-path-index',
  templateUrl: './flow-path-index.html',
  styleUrls: ['./azure-rp-page.css', './jquery-ui-themes.css', './data-styles.css', './index-styles.css'],
})
// tslint:disable-next-line:component-class-suffix
export class FlowPathIndex implements OnInit {
  @Input() leftStationId = '';

  ngOnInit(): void {}

  clickACheng(): void {
    this.router.navigate(['/opc/opc-station'], {
      queryParams: { hideTrees: true, checkedStationId: '093bba30-0461-4890-8253-acabe351cf68' },
    });
  }

  constructor(public http: _HttpClient, public injector: Injector, public router: Router, public msg: NzMessageService) {}
}
