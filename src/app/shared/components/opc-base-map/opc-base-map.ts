import { AfterViewInit, Component, Input } from '@angular/core';
import * as L from 'leaflet';
import { Layer } from 'leaflet';
import 'src/assets/leaflet-ruler/leaflet-ruler.js';
import { RailwayLineSection } from '../../../pojos/railway-line/railway-line-section';
import { StringUtils } from '../../utils/string-utils';
import { _HttpClient } from '@delon/theme';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'opc-base-map',
  templateUrl: './opc-base-map.html',
  styleUrls: ['./opc-base-map.css'],
})
export class OpcBaseMap implements AfterViewInit {
  @Input() opcIds: string[] = [];

  kilometerMarkPointLayersGroup: Map<string, any> = new Map();
  opcLineStringLayersGroup: Map<string, any> = new Map();
  opcMarkPointLayersGroup: Map<string, any> = new Map();

  //TODO: 获取需要移除的图层并remove

  // @ts-ignore
  private map: L.Map;

  zoom = 16; // 初始（默认）地图展示图层级别

  // 铁路线
  rawRailwayLineSections: RailwayLineSection[] = []; // 完整铁路线路
  railwayLineLayer: Layer | undefined;
  kilometerMarkPointLayers: Layer[] = []; // 公里标图层

  // 光电缆
  opcLineStringLayers: Layer[] = []; // 光电缆线图层
  opcMarkPointLayers: Layer[] = []; // 光电缆Mark图层

  /********************************************************* 加载数据 *************************************************
   * 加载location数据
   */

  // 完整铁路线路
  loadRawRailwayLineLocations() {
    this.http
      .post('/api/backstage/location/getAllRailwayLineStringLocations', null, { opcIds: this.opcIds.toString() })
      .subscribe((res: any) => {
        if (!res.success) return;

        // for (let i = 0; i < res[id].features.length; i++) {
        //   if(!res[id].features[i].properties) continue;
        //   let properties = res[id].features[i].properties;
        //   color = properties.color;
        // }
        this.railwayLineLayer = L.geoJSON(res.railwayLocations, {
          style: {
            color: 'blue',
            weight: 3,
            opacity: 0.8,
          },
        }).addTo(this.map);
      });
  }

  // 铁路公里标
  loadkilometerMarkPointLocations(): void {
    //  公里标的基础数据是铁路线location数据，需要处理成一套新的用于公里标的数据，一公里一个公里标icon
  }

  // 光电缆线数据
  loadOpcLineStringLocations(): void {
    if (StringUtils.arrayEmpty(this.opcIds)) {
      return;
    }

    this.http
      .post('/api/backstage/location/getOpcLineStringLocationsByOpcIds', null, { opcIds: this.opcIds.toString() })
      .subscribe((res: any) => {
        let geoLayer: any;
        for (const id of this.opcIds) {
          let propertiesColor = '';
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < res[id].features.length; i++) {
            if (!res[id].features[i].properties) {
              continue;
            }
            const properties = res[id].features[i].properties;
            propertiesColor = properties.color;
          }
          geoLayer = L.geoJSON(res[id], {
            style: {
              color: propertiesColor,
              weight: 3,
              opacity: 0.8,
            },
          }).addTo(this.map);
          this.opcLineStringLayers.push(geoLayer);
        }
        this.map.fitBounds(geoLayer.getBounds());
      });
  }

  // 光电缆mark数据
  loadOpcMarkPointLocations(): void {
    if (StringUtils.arrayEmpty(this.opcIds)) {
      return;
    }

    this.http
      .post('/api/backstage/location/getOpcMarkPointLocationsByOpcIds', null, { opcIds: this.opcIds.toString() })
      .subscribe((res: any) => {
        let geoLayer: any;
        // let opcMarkTypeName: any;
        for (const id of this.opcIds) {
          // const featureArray = res[id].features;
          // for (const item of featureArray) {
          //   // console.log('featureArray[j].properties.opcMarkTypeName');
          //   // console.log(item.properties.opcMarkTypeName);
          //   // console.log('featureArray[j]');
          //   // console.log(item.geometry.coordinates);
          //   // L.marker(featureArray[j].geometry.coordinates).bindPopup(featureArray[j].properties.opcMarkTypeName).openPopup();
          //   opcMarkTypeName = item.properties.opcMarkTypeName;
          // }

          geoLayer = L.geoJSON(res[id], {
            // tslint:disable-next-line:typedef
            pointToLayer(feature, latlng) {
              let mark;
              if (feature.properties.remark === null) {
                mark = '';
              } else {
                mark = feature.properties.remark;
              }

              const poptxt =
                '<div style="width:100%;height:100%">' +
                '<table border="1" cellspacing="0" cellpadding="0">' +
                '<thead>' +
                '<tr>' +
                '<th>标识名称</th>' +
                '<th>备注信息</th>' +
                '</tr>' +
                '</thead>' +
                '<tr>' +
                '<td>' +
                feature.properties.opcMarkTypeName +
                '</td>' +
                '<td>' +
                mark +
                '</td>' +
                '</tr>' +
                '</table>' +
                '</div>';

              return L.marker(latlng, { title: feature.properties.opcMarkTypeName }).bindPopup(poptxt).openPopup();
            },
          }).addTo(this.map);

          this.opcMarkPointLayers.push(geoLayer);
        }
        this.map.fitBounds(geoLayer.getBounds());
      });
  }

  /********************************************************* 初始化地图 ************************************************
   * 初始化地图
   * @private
   */
  initMap(): void {
    // 天地图墨卡托
    // 底图
    const image = L.tileLayer(
      'https://t{s}.tianditu.gov.cn/img_w/wmts?tk=9545b898d3ae5b08ab7b250bd87102df&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}',
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        maxNativeZoom: 50,
        maxZoom: 50,
      },
    );
    // 注记
    const cia = L.tileLayer(
      'https://t{s}.tianditu.gov.cn/cia_w/wmts?tk=9545b898d3ae5b08ab7b250bd87102df&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}',
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        zIndex: 3,
        maxNativeZoom: 50,
        maxZoom: 50,
      },
    );
    // 天地图图组
    const tiandiSatMap = L.layerGroup([image, cia]);

    // const openstreet = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    const vec = L.tileLayer(
      'https://t{s}.tianditu.gov.cn/vec_w/wmts?tk=9545b898d3ae5b08ab7b250bd87102df&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}',
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        maxNativeZoom: 50,
        maxZoom: 50,
      },
    );

    const cva = L.tileLayer(
      'https://t{s}.tianditu.gov.cn/cva_w/wmts?tk=9545b898d3ae5b08ab7b250bd87102df&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}',
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        zIndex: 3,
        maxNativeZoom: 50,
        maxZoom: 50,
      },
    );

    const tiandiMap = L.layerGroup([vec, cva]);

    const openstreet = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'OpenstreetMap',
      maxNativeZoom: 50,
      maxZoom: 50,
    });

    // 卫星离线
    this.map = L.map('map', {
      center: [45.779577, 126.707084],
      zoom: 6,
      minZoom: 0,
      attributionControl: true,
      layers: [tiandiMap],
      maxZoom: 50,
      preferCanvas: true,
    });

    // 增加地图图层控制控件
    const baseLayers = {
      卫星: tiandiSatMap,
      地图: tiandiMap,
      OSM: openstreet,
      // "离线": offline,
    };
    const layerControl = L.control.layers(baseLayers, undefined);
    layerControl.addTo(this.map);

    // 增加缩放控件
    L.control.scale().addTo(this.map);

    // 测量控件
    const ruleroptions = {
      position: 'topright', // Leaflet control position option
      circleMarker: {
        // Leaflet circle marker options for points used in this plugin
        color: 'red',
        radius: 2,
      },
      lineStyle: {
        // Leaflet polyline options for lines used in this plugin
        color: '#32CD32',
        dashArray: '1,6',
      },
      lengthUnit: {
        // You can use custom length units. Default unit is kilometers.
        display: 'm', // This is the display value will be shown on the screen. Example: 'meters'
        decimal: 2, // Distance result will be fixed to this value.
        factor: 1000, // This value will be used to convert from kilometers. Example: 1000 (from kilometers to meters)
        label: '距离:',
      },
      angleUnit: {
        display: '&deg;', // This is the display value will be shown on the screen. Example: 'Gradian'
        decimal: 2, // Bearing result will be fixed to this value.
        factor: null, // This option is required to customize angle unit. Specify solid angle value for angle unit. Example: 400 (for gradian).
        label: '方位:',
      },
    };
    // 增加距离测量
    L.control.ruler(ruleroptions).addTo(this.map);
    //
    //
    //
    // const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   maxZoom: 18,
    //   minZoom: 3,
    //   // attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // });
    //
    // tiles.addTo(this.map);
  }

  /********************************************************* 页面初始化 ************************************************
   * 页面初始化
   * @param http
   */
  // 构造器
  constructor(public http: _HttpClient) {}

  ngOnInit() {
    this.opcLineStringLayers.forEach((x) => this.map.removeLayer(x));
    this.opcLineStringLayers = [];
    this.opcMarkPointLayers.forEach((x) => this.map.removeLayer(x));
    this.opcMarkPointLayers = [];
    // 加载光缆信息
    this.loadOpcLineStringLocations();
    // 加载光缆Mark信息
    this.loadOpcMarkPointLocations();
  }

  // 初始化函数
  ngAfterViewInit(): void {
    this.initMap();
    // this.makeCapitalMarkers(this.map);
  }
}
