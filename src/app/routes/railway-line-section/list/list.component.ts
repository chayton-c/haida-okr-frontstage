import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { _HttpClient } from '@delon/theme';
import { Layer } from 'leaflet';
import { Station } from '../../../pojos/station/station';
import { StringUtils } from '../../../shared/utils/string-utils';
import { RailwayLine } from '../../../pojos/railway-line/railway-line';

@Component({
  selector: 'railway-line-section-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class RailwayLineSectionListComponent implements AfterViewInit {
  // @ts-ignore
  private map: L.Map;

  formParams: {
    wasAllLine: string;
    railwayLineId?: string;
    stationIds: string[];
  } = {
    wasAllLine: '',
    stationIds: [],
  };

  // 线路
  railwayLineLayers: Layer[] = [];
  railwayLineLayer: Layer | undefined;

  constructor(public http: _HttpClient) {}

  stationDisabled: boolean = true;
  railwayLineDisabled: boolean = true;
  switchMap() {
    if (this.formParams.wasAllLine == '0') {
      this.railwayLineDisabled = false;
    } else {
      this.formParams.stationIds = [];
      this.formParams.railwayLineId = '';
      this.railwayLineDisabled = true;
      this.stationDisabled = true;
      this.loadRawRailwayLineLocations();
    }
  }

  // 完整铁路线路
  loadRawRailwayLineLocations() {
    this.railwayLineLayers.forEach((x) => this.map.removeLayer(x));
    // this.railwayLineLayers = [];

    const params = {
      wasAllLine: this.formParams.wasAllLine,
      stationIds: this.formParams.stationIds.toString(),
    };
    this.http.post('/api/backstage/location/getAllRailwayLineStringLocations', null, params).subscribe((res: any) => {
      if (!res.success) return;

      if (this.formParams.wasAllLine == '0') {
        let grayGeoLayer: any;
        let whiteGeoLayer: any;
        for (let i = 0; i < this.formParams.stationIds.length; i++) {
          let id = this.formParams.stationIds[i];
          for (let i = 0; i < res[id].features.length; i++) {
            // if (!res[id].features[i].properties) continue;
            // let properties = res[id].features[i].properties;
            // color = properties.color;
          }
          grayGeoLayer = L.geoJSON(res[id], {
            style: {
              weight: 5,
              color: 'gray',
              fillColor: 'white',
              dashArray: '13, 13',
              dashOffset: '13',
            },
          }).addTo(this.map);
          this.railwayLineLayers.push(grayGeoLayer);

          whiteGeoLayer = L.geoJSON(res[id], {
            style: {
              weight: 5,
              color: 'white',
              fillColor: 'white',
              dashArray: '13, 13',
              dashOffset: '0',
            },
          }).addTo(this.map);
          this.railwayLineLayers.push(whiteGeoLayer);
        }
        this.map.fitBounds(grayGeoLayer.getBounds());
      } else {
        let grayGeoLayer: any;
        let whiteGeoLayer: any;
        grayGeoLayer = L.geoJSON(res.railwayLocations, {
          style: {
            weight: 5,
            color: 'gray',
            fillColor: 'white',
            dashArray: '13, 13',
            dashOffset: '13',
          },
        }).addTo(this.map);
        this.railwayLineLayers.push(grayGeoLayer);

        whiteGeoLayer = L.geoJSON(res.railwayLocations, {
          style: {
            weight: 5,
            color: 'white',
            fillColor: 'white',
            dashArray: '13, 13',
            dashOffset: '0',
          },
        }).addTo(this.map);
        this.railwayLineLayers.push(whiteGeoLayer);
        this.map.fitBounds(grayGeoLayer.getBounds());
      }
    });
  }

  /**
   * 加载线路数据
   */
  railwayLines: RailwayLine[] = [];
  loadAllRailwayLine() {
    this.http.post('/api/backstage/railwayLine/getAllRailwayLine').subscribe((res: any) => {
      if (!res.success) return;
      this.railwayLines = res.railwayLines;
    });
  }

  /**
   * 通过线路ID加载车站数据
   */
  stations: Station[] = [];
  loadAllStationByRailwayLineId() {
    this.stationDisabled = false;
    this.http
      .post('/api/backstage/station/getAllStationByRailwayLineId', null, { railwayLineId: this.formParams.railwayLineId })
      .subscribe((res: any) => {
        if (!res.success) return;
        this.stations = res.stations;
      });
  }

  private initMap(): void {
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
    this.map = L.map('line-map', {
      center: [45.779577, 126.707084],
      zoom: 6,
      minZoom: 0,
      attributionControl: true,
      layers: [tiandiMap],
      maxZoom: 50,
      // preferCanvas: true
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
  }

  ngOnInit(): void {
    this.loadAllRailwayLine();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
