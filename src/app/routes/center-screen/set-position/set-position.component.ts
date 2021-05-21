import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { CdkDragMove } from '@angular/cdk/drag-drop/drag-events';
import { HttpUtils } from '../../../shared/utils/http-utils';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { JsonArray } from '@angular/compiler-cli/ngcc/src/packages/entry_point';
import { isNull } from 'util';

@Component({
  selector: 'app-center-screen-set-position',
  templateUrl: './set-position.component.html',
})
export class CenterScreenSetPositionComponent implements OnInit {
  constructor(private http: _HttpClient, private msg: NzMessageService, private router: Router) {}

  railwayLineId: string = '';
  stationId: string = '';
  percentX: string = '';
  percentY: string = '';

  lineStationValueChange($event: any) {
    if (($event as string[]).length > 0) this.railwayLineId = $event[0];
    if (($event as string[]).length > 1) this.stationId = $event[1];

    console.log('车站ID');
    console.log((this.stationId = $event[1]));
  }

  /**
   * 重置图标位置
   */
  dragPosition = { x: 0, y: 0 };
  resetPosition() {
    this.dragPosition = { x: 0, y: 0 };
  }

  /**
   * 获取图标位置并计算出百分比数值
   * @param e
   */
  setPosition(e: CdkDragMove<any>) {
    console.log(e.event);

    if ('screenX' in e.event && 'screenY' in e.event) {
      // @ts-ignore
      console.log(e.event.screenX);
      console.log(e.event.clientX);
      // @ts-ignore
      console.log(e.event.screenY);

      // 计算点位百分比数值并取小数点后两位；
      // 这里X和Y所加减数值是测试结果，这样准；没研究是哪里出来的差值
      // @ts-ignore
      this.percentX = (e.event.layerX - 8) / 14.65;
      // @ts-ignore
      this.percentY = (e.event.layerY - 12) / 7.96;
    }
  }

  /**
   * 保存位置及车站信息
   */
  savePosition() {
    const params = {
      railwayLineId: this.railwayLineId,
      stationId: this.stationId,
      xPosition: this.percentX,
      yPosition: this.percentY,
    };
    if (!(!!params.railwayLineId && !!params.stationId)) {
      this.msg.warning('请选择线路或车站');
      return;
    }

    if (!(!!params.xPosition && !!params.yPosition)) {
      this.msg.warning('请将红色水滴图标拖拽至所选车站上');
      return;
    }

    this.http.post('/api/backstage/centerScreenElementPosition/save', null, params).subscribe((res) => {
      if (!res.success) return;
      this.msg.success(res.msg);
      this.router.navigate(['/center-screen/set-position']);
    });
  }

  getFreeDragPosition(event: Event) {
    console.log(this.dragPosition);
  }

  /**
   * 测试图标位置回显
   */
  changePosition() {
    // this.dragPosition = {x: (this.dragPosition.x / 1920) * 100 , y: (this.dragPosition.y / 1080) * 100 };
    this.dragPosition = { x: this.dragPosition.x + 112, y: this.dragPosition.y + 129 };
  }

  ngOnInit() {}
}
