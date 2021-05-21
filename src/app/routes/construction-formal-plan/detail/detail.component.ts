import { Component } from '@angular/core';
import {
  icon,
  Map as LeafLetMap,
  LatLng,
  latLng,
  MapOptions,
  Marker,
  TileLayer,
  tileLayer,
  Polyline,
  circle,
  polygon,
  marker,
  polyline,
  Icon,
  Path,
  Layer,
  ControlOptions,
} from 'leaflet';

/**
 * api:https://leafletjs.com/reference-1.7.1.html
 */
@Component({
  selector: 'app-construction-formal-plan-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class ConstructionFormalPlanDetailComponent {
  map?: LeafLetMap;
  mapOptions?: MapOptions;
  zoom = 18;
  center: LatLng = latLng(51.51, 0);
  baseLayers: Layer[] = [
    circle([51.51, 0], { radius: 1 }),
    polyline([
      [51.51, 0],
      [51.61, 0],
      [51.71, 0],
    ]),
    polygon([
      [46.8, -121.85],
      [46.92, -121.92],
      [46.87, -121.8],
    ]),
    marker([46.879966, -121.726909]),
  ];
  overlays: Layer[] = [];

  constructor() {}

  ngOnInit() {
    this.initializeMapOptions();
  }

  onMapReady(map: LeafLetMap) {
    this.map = map;
    this.drawMarker(51.51, 0, ['akagi', 'kaga']);
    this.drawCircle(51.51, 0, 3, 'red');
  }

  initializeMapOptions(): void {
    this.mapOptions = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 23,
        }),
      ],
    };
  }

  /**
   * 添加标识
   * @param lng 经度
   * @param lat 纬度
   * @param title 提示信息，是个string数组，数组中每个string占一行
   * @param customIcon 自定义标识
   */
  drawMarker(lng: number, lat: number, title: string[], customIcon?: Icon) {
    const marker = new Marker([lng, lat]);
    if (customIcon) marker.setIcon(customIcon);

    marker.bindPopup(title.join('<br/>'));

    this.overlays.push(marker);
  }

  /**
   * 画圆到overlays图层上(如果想放到baseLayers图层上，需要改最后一行)
   * @param lng 圆心经度
   * @param lat 圆心纬度
   * @param radius 半径
   * @param color 圆颜色(填充色默认为底色，可以修改fillColor改变填充色)
   */
  drawCircle(lng: number, lat: number, radius: number, color: string): void {
    if (radius <= 0) return;

    // 创建圆
    const circleItem = circle([lng, lat], {
      color: color,
      fillColor: '#DDDDDD',
      fillOpacity: 0.5,
      radius: radius,
    });
    this.overlays.push(circleItem);
  }

  /**
   * 画线
   * @param points
   */
  drawPolyLine(points: LatLng[]): void {
    let polylineItem = polyline(points);
    this.overlays.push(polylineItem);
  }

  /**
   * 画多边形
   * @param points
   */
  drawPolygons(points: LatLng[]): void {
    let polylineItem = polygon(points);
    this.overlays.push(polylineItem);
  }
}
