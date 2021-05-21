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
declare var BMAP_EARTH_MAP: any;

interface FormParams {
  opcId: string;
  opcMarkTypeId: string;
  opcMarkName: string;
}

@Component({
  selector: 'opc-map',
  templateUrl: './opc-map.html',
})
export class OpcMap implements OnInit {
  @Input() leftStationId: string = '';
  @Input() rightStationId: string = '';
  @Input() opcId = '';
  @Input() showSearchForm = true;
  @Input() enableAddConstructionPoint = false;
  @Input() enableEditing = false;

  thisItem = this;
  map: any = undefined;
  hasData: boolean = true;
  opcs: Opc[] = [];
  selectOpcs: Opc[] = [];
  opcTypeMap: Map<string, OpcType> = new Map<string, OpcType>();
  opcMarkTypeMap: Map<string, OpcType> = new Map<string, OpcType>();
  opcMarks: OpcMark[] = [];
  myDis: any = null;
  formParams: FormParams = {
    opcId: '',
    opcMarkTypeId: '',
    opcMarkName: '',
  };
  polyLines: any[] = [];
  mapZoom: number = 15; // 百度地图层级
  loading = false;

  constructor(public http: _HttpClient, private msg: NzMessageService, private activatedRoute: ActivatedRoute, public router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.opcId) this.formParams.opcId = queryParams.opcId;
    });

    this.initOpc();
  }

  setView(location?: Location): void {
    if (!location) return;

    console.log(location.longitude);
    console.log(location.latitude);
    let startPoint = new BMapGL.Point(location.longitude, location.latitude);
    this.map.centerAndZoom(startPoint, 19);
    this.map.clearOverlays();
    this.polyLines.forEach((value) => this.map.addOverlay(value));
  }

  updatePage(): void {
    let opcId = this.formParams.opcId;
    if (!opcId) {
      this.msg.error('请选择需要修改的光电缆');
      return;
    }

    this.router.navigate(['/opc/detail'], {
      queryParams: {
        opcId: opcId,
      },
    });
  }

  initOpc(callBack?: (res: any) => void): void {
    const params = {
      leftStationId: this.leftStationId,
      rightStationId: this.rightStationId,
      opcId: this.formParams.opcId,
      opcMarkTypeId: this.formParams.opcMarkTypeId,
      opcMarkName: this.formParams.opcMarkName,
    };
    if (this.map) this.mapZoom = this.map.getZoom();

    this.http.post('/api/backstage/opc/initLocationsByStations', null, params).subscribe((res) => {
      if (!res.success) return;
      if (!res.opcs || res.opcs.length <= 0) {
        this.hasData = false;
        return;
      }

      if (this.map) this.map.destroy();
      this.polyLines = [];

      this.opcs = res.opcs;
      this.selectOpcs = res.selectOpcs;
      this.opcMarks = res.opcMarks;
      this.opcTypeMap = OpcType.createOpcTypeMap(res.opcTypes);
      this.opcMarkTypeMap = OpcMarkType.createOpcMarkTypeMap(res.opcMarkTypes);

      if (this.opcs && this.opcs.length > 0) {
        this.initMap(this.opcs[0].locations[0]);
        this.opcs.forEach((opc) => {
          let opcType = this.opcTypeMap.get(opc.opcTypeId);
          if (opcType) this.drawTrack(opc, opcType.color);
        });
      }
      if (this.opcMarks) {
        this.opcMarks.forEach((opcMark) => {
          if (!opcMark.locations) return;
          let location = opcMark.locations[0];
          if (!location) return;
          let opcMarkType = this.opcMarkTypeMap.get(opcMark.opcMarkTypeId);
          let opcMarkTypeName = opcMarkType ? opcMarkType.name : '';
          const info = '名称：' + opcMark.name + '<br/>类型：' + opcMarkTypeName;
          this.addMarker(this, location.longitude, location.latitude, info);
        });
      }
      this.rightClickInit();
      if (callBack) callBack(res);
    });
  }

  /**
   * 在地图上画圆
   * @param point 圆心
   * @param thisItem 就是ts里的this，回调函数里拿不到this要封成let传进去
   * @param distance 半径
   * @param color 颜色
   */
  drawCircle(point: any, thisItem: any, distance: number, color: string): void {
    let map = thisItem.map;

    // 创建圆
    const circle = new BMapGL.Circle(point, 5, {
      strokeColor: color,
      fillColor: color,
      fillOpacity: 0.5,
      strokeWeight: 1,
      strokeOpacity: 1,
      strokeStyle: 'dashed',
    });
    circle.disableMassClear();
    map.addOverlay(circle);

    // 圆心标注
    let myIcon = new BMapGL.Icon('assert/map/images/lanqi.png', new BMapGL.Size(1, 25), {
      // 指定定位位置
      offset: new BMapGL.Size(1, 25),
      // 当需要从一幅较大的图片中截取某部分作为标注图标时，需要指定大图的偏移位置
      imageOffset: new BMapGL.Size(0, -25), // 设置图片偏移
    });
    console.log(myIcon);
    thisItem.addMarker(thisItem, point.lng, point.lat, '测定点', myIcon);
  }

  findNearestPointInLine(point: any, thisItem: any, points: any[]): any {
    let map = thisItem.map;

    let nearestPoint: any;
    let nearestDistance = 10000000000;
    points.forEach((value: any) => {
      let distance = BMapGLLib.GeoUtils.getDistance(value, point);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestPoint = value;
      }
    });

    const nearestPointMarker = new BMapGL.Marker(nearestPoint);
    map.addOverlay(nearestPointMarker); // 将标注添加到地图中
    const nearestPointMarkerOptions = {
      width: 100, // 信息窗口宽度
      height: 50, // 信息窗口高度
      title: '最近点', // 信息窗口标题
    };
    const nearestPointWindow = new BMapGL.InfoWindow('', nearestPointMarkerOptions); // 创建信息窗口对象

    nearestPointMarker.addEventListener('click', function () {
      map.openInfoWindow(nearestPointWindow, nearestPoint); //开启信息窗口
    });

    return nearestPoint;
  }

  rightClickInit(): void {
    this.myDis = new BMapGL.DistanceTool(this.map);
    let distance = this.myDis;
    let menu = new BMapGL.ContextMenu();

    let drawCircle = this.drawCircle;
    let thisItem = this;
    let txtMenuItem = [
      {
        text: '测距',
        callback: function (e: any) {
          distance.open();
        },
      },
    ];

    if (this.enableAddConstructionPoint) {
      txtMenuItem.push({
        text: '添加施工点',
        callback: function (e: any) {
          drawCircle(e, thisItem, 10, '#DC143C');
          // 与第一条线最近距离的点
          let nearestPoint = thisItem.findNearestPointInLine(e, thisItem, thisItem.polyLines[1].getPath());
          drawCircle(nearestPoint, thisItem, 10, '#00FF00');

          // drawCircle(e, thisItem, 20, "#FFA500", true);
          // drawCircle(e, thisItem, 30, "#FFFF00", true);
          // drawCircle(e, thisItem, 40, "#00FF00", true);
        },
      });
    }

    for (let i = 0; i < txtMenuItem.length; i++) menu.addItem(new BMapGL.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 100));
    this.map.addContextMenu(menu);
  }

  // 加载地图
  initMap(location: Location): void {
    this.map = new BMapGL.Map('map', { minZoom: 5, maxZoom: 23 }); //创建地图实例
    this.map.setMapType(BMAP_EARTH_MAP);

    // 设置缩放级别
    // let defaultMapType = this.map.getMapType();
    // console.log(defaultMapType)
    // let defaultTileLayer = defaultMapType.getTileLayer();
    // // 23级1米，22级2米,215米，2010米(20级线上有瓦片)
    // let newMapType = new BMapGL.MapType("新地图", defaultTileLayer, {minZoom: 8, maxZoom: 23});
    // this.map.setMapType(newMapType);

    // 起始点及起始瓦片等级
    // this.startPoint = new BMapGL.Point(location.longitude, location.latitude);
    let startPoint = new BMapGL.Point(location.longitude, location.latitude);
    let zoomControl = new BMapGL.ZoomControl();
    this.map.addControl(zoomControl);
    this.map.centerAndZoom(startPoint, this.mapZoom);
    // 比例尺控件
    let scaleCtrl = new BMapGL.ScaleControl();
    this.map.addControl(scaleCtrl);
    // 开启鼠标滚轮缩放
    this.map.enableScrollWheelZoom(true);

    // this.polylineIntersectPolygon();
  }

  addMarker(thisItem: any, longitude: number, latitude: number, info: string, enableMassClear?: boolean, customIcon?: any): void {
    let map = thisItem.map;

    let markPoint = new BMapGL.Point(longitude, latitude);
    // 创建标注
    // const marker = customIcon ? new BMapGL.Marker(markPoint, {icon : customIcon}) : new BMapGL.Marker(markPoint);
    const marker = new BMapGL.Marker(markPoint);
    if (!enableMassClear) marker.disableMassClear();
    map.addOverlay(marker); // 将标注添加到地图中

    const opts = {
      width: 100, // 信息窗口宽度
      height: 50, // 信息窗口高度
      title: info, // 信息窗口标题
    };
    const infoWindow = new BMapGL.InfoWindow('', opts); // 创建信息窗口对象

    marker.addEventListener('click', function () {
      map.openInfoWindow(infoWindow, markPoint); //开启信息窗口
    });
    console.log(marker.getOffset());
  }

  // 画折线
  drawTrack(containsLocationData: ContainsLocationData, color: any): void {
    // // 创建点
    // var marker = new BMap.Marker(new BMap.Point(116.404, 39.915));
    // this.map.addOverlay(marker); // 增加点
    // 创建折线
    let points: any[] = [];
    containsLocationData.locations.forEach((x) => {
      points.push(new BMapGL.Point(x.longitude, x.latitude));
    });
    const polyline = new BMapGL.Polyline(points, {
      enableClicking: true,
      strokeColor: color,
      strokeWeight: 4,
      strokeOpacity: 0.5,
    });
    this.polyLines.push(polyline);

    this.map.addOverlay(polyline); // 增加折线
  }
  // 画折线
  // drawTrack(containsLocationData: ContainsLocationData, color: any): void {
  //   // // 创建点
  //   // var marker = new BMap.Marker(new BMap.Point(116.404, 39.915));
  //   // this.map.addOverlay(marker); // 增加点
  //   // 创建折线
  //
  //   for (let i = 0; i < containsLocationData.locations.length; i++ ) {
  //     if (i == containsLocationData.locations.length - 1)
  //       continue;
  //
  //     let points: any[] = [];
  //     let leftPoint = containsLocationData.locations[i];
  //     let rightPoint = containsLocationData.locations[i + 1];
  //     points.push(new BMapGL.Point(leftPoint.longitude, leftPoint.latitude))
  //     points.push(new BMapGL.Point(rightPoint.longitude, rightPoint.latitude))
  //     const polyline = new BMapGL.Polyline(points, {
  //       strokeColor: color,
  //       strokeWeight: 4,
  //       strokeOpacity: 0.5
  //     });
  //     this.polyLines.push(polyline);
  //
  //     this.map.addOverlay(polyline); // 增加折线
  //   }
  //
  // }
}
