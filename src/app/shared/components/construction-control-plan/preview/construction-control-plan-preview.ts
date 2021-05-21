import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import {
  circle,
  control,
  Handler,
  icon,
  Icon,
  IconOptions,
  LatLng,
  latLng,
  Direction,
  Layer,
  layerGroup,
  LayerGroup,
  Map as LeafLetMap,
  MapOptions,
  Marker,
  MarkerOptions,
  Path,
  polygon,
  Polyline,
  polyline,
  PolylineOptions,
  Popup,
  tileLayer,
  Polygon,
} from 'leaflet';
import * as turf from '@turf/turf';
import { LineString, lineToPolygon, MultiLineString } from '@turf/turf';
import { _HttpClient, SettingsService } from '@delon/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder } from '@angular/forms';
import {
  ConstructionControlPlan,
  ConstructionControlPlanConstant,
} from '../../../../pojos/construction-control-plan/construction-control-plan';
import * as geojson from 'geojson';
import {
  ConstructionControlPlanPoint,
  ConstructionControlPlanPointConstant,
} from '../../../../pojos/construction-control-plan/construction-control-plan-point';
import { Opc } from '../../../../pojos/opc/opc';
import { OpcType } from '../../../../pojos/opc/opc-type';
import { OpcMark } from '../../../../pojos/opc/opc-mark';
import { ContainsLocationData, Location } from '../../../../pojos/location/location';
import { OpcMarkType } from '../../../../pojos/opc/opc-mark-type';
import { KilometerMark } from '../../../../pojos/railway-line/kilometer-mark';
import { RailwayLineSection } from '../../../../pojos/railway-line/railway-line-section';
import { ClipboardService } from 'ngx-clipboard';
import { StringUtils } from '../../../utils/string-utils';
import { KilometerPipe } from '../../../pipe/kilometer-pipe';
import { ConstructionDailyPlan } from '../../../../pojos/construction-control-plan/construction-daily-plan';
import { Equipment, EquipmentConstant } from 'src/app/pojos/equipment/equipment';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'construction-control-plan-preview',
  templateUrl: './construction-control-plan-preview.html',
})
export class ConstructionControlPlanPreview implements OnDestroy {
  @Input() constructionControlPlanId?: string;
  @Input() stationId?: string;
  @Output() public stationIdChange = new EventEmitter();
  // @Input() opcIds?: string;
  @Input() opcIds: string[] = [];
  @Input() constructionDailyPlanId?: string;

  @Input() public equipmentId: string = '';
  @Output() public equipmentIdChange = new EventEmitter();

  @Output() public focusOpcMarkIdChange = new EventEmitter();

  map!: LeafLetMap;
  mapOptions?: MapOptions;
  zoom = 16;
  center: LatLng = latLng(45.77990391156578, 126.725);
  baseLayers: Layer[] = [];
  overlays: Layer[] = [];
  overlappingLayers: Layer[] = [];
  equipmentsLayers: Layer[] = []; // 设备实时位置图层
  kilometerMarkerLayers: Layer[] = [];
  locationPointLayers: Layer[] = []; // 组成光缆线或铁路线的点的图层(用于在线路编辑页修改/删除点)
  auxiliaryLineLayers: Layer[] = []; // 辅助线图层
  showAuxiliaryLineLayers = false;

  constructionControlPlanPoints: ConstructionControlPlanPoint[] = [];
  constructionControlPlanPointConstant: ConstructionControlPlanPointConstant = new ConstructionControlPlanPointConstant();
  kilometerMarks: KilometerMark[] = [];
  hasData: boolean = true;
  planOpcs: Opc[] = []; // 方案或日计划截取后的光缆
  rawOpcs: Opc[] = []; // 完整光电缆
  equipments: Equipment[] = [];
  equipmentConstant = new EquipmentConstant();
  equipmentLocations: Location[] = [];
  opcTypeMap: Map<string, OpcType> = new Map<string, OpcType>();
  opcMarkTypeMap: Map<string, OpcType> = new Map<string, OpcType>();
  rawRailwayLineSections: RailwayLineSection[] = []; // 完整铁路线路
  controlPlanRailwayLineSections: RailwayLineSection[] = []; // 方案铁路线路
  dailyPlanRailwayLineSections: RailwayLineSection[] = []; // 日计划铁路线路
  opcMarks: OpcMark[] = [];
  loading = false;

  // 光缆到光缆周围1.5米色带的buffer
  side15Buffer?: turf.helpers.Feature<turf.helpers.Polygon | turf.helpers.MultiPolygon, turf.helpers.Properties>;
  // 光缆到光缆周围50米色带的buffer
  side50Buffer?: turf.helpers.Feature<turf.helpers.Polygon | turf.helpers.MultiPolygon, turf.helpers.Properties>;
  // 光缆到光缆周围100米色带的buffer
  side100Buffer?: turf.helpers.Feature<turf.helpers.Polygon | turf.helpers.MultiPolygon, turf.helpers.Properties>;
  // 光缆到光缆周围200米色带的buffer
  side200Buffer?: turf.helpers.Feature<turf.helpers.Polygon | turf.helpers.MultiPolygon, turf.helpers.Properties>;
  // 光缆到光缆周围1.5米色带的buffer
  wingBuffer15?: turf.helpers.Feature<turf.helpers.Polygon | turf.helpers.MultiPolygon, turf.helpers.Properties>;
  // 光缆周围1.5米到光缆周围5米色带的buffer
  wingBuffer50?: turf.helpers.Feature<turf.helpers.Polygon | turf.helpers.MultiPolygon, turf.helpers.Properties>;
  // 光缆周围5米到光缆周围10米色带的buffer
  wingBuffer100?: turf.helpers.Feature<turf.helpers.Polygon | turf.helpers.MultiPolygon, turf.helpers.Properties>;
  // 光缆周围10米到光缆周围20米色带的buffer
  wingBuffer200?: turf.helpers.Feature<turf.helpers.Polygon | turf.helpers.MultiPolygon, turf.helpers.Properties>;

  constructionControlPlan: ConstructionControlPlan = {
    approveStatus: 0,
    code: '',
    executeUserId: '',
    finishStatus: 0,
    id: '',
    influenceArea: '',
    name: '',
    signInStationId: '',
    signInUserId: '',
    warnStatus: 0,
    workInfo: '',
  };
  constructionDailyPlan?: ConstructionDailyPlan;
  constructionConstrolPlanConstant: ConstructionControlPlanConstant = new ConstructionControlPlanConstant();

  constructor(
    public http: _HttpClient,
    public router: Router,
    private confirmSrv: NzModalService,
    private _clipboardService: ClipboardService,
    private msg: NzMessageService,
    private settingsService: SettingsService, // private activatedRoute: ActivatedRoute, // private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initializeMapOptions();
    console.log(this.opcIds);
    if (this.constructionControlPlanId || this.constructionDailyPlanId || this.stationId || StringUtils.arrayNotEmpty(this.opcIds))
      this.initOpc(); // 加载光缆信息
  }

  // ngOnChanges() {
  //   if (this.equipmentId) return;
  //
  //   if (this.constructionControlPlanId || this.constructionDailyPlanId || this.stationId)
  //     this.initOpc(); // 加载光缆信息
  // }

  onMapReady(map: LeafLetMap) {
    this.map = map;

    // 比例尺
    control
      .scale({
        metric: true,
      })
      .addTo(this.map);

    // 调试代码：经纬度显示，最好别删
    // const Coordinates = L.Control.extend({
    //   onAdd: (map: any) => {
    //     const container = L.DomUtil.create("div");
    //     map.addEventListener("click", (e: any) => {
    //       container.innerHTML = `
    //       <h2>Latitude is
    //         ${e.latlng.lat.toFixed(
    //         4
    //       )} <br> and Longitude is  ${e.latlng.lng.toFixed(4)}
    //         </h2>
    //       `;
    //     });
    //     return container;
    //   }
    // });
    // this.map.addControl(new Coordinates({position: "bottomleft"}));

    let _this = this;
    // 自定义按钮：辅助线显示切换
    let toggleAuxiliaryLineControl = L.Control.extend({
      options: {
        position: 'topleft',
      },

      onAdd: function (map: any) {
        let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

        container.style.backgroundColor = 'white';
        container.style.backgroundImage = 'url(/assets/map/images/auxiliary_line.png)';
        container.style.backgroundSize = '34px 34px';
        container.style.width = '34px';
        container.style.height = '34px';

        container.onclick = function () {
          _this.showAuxiliaryLineLayers = !_this.showAuxiliaryLineLayers;
        };

        return container;
      },
    });

    this.map.addControl(new toggleAuxiliaryLineControl());

    // 自定义按钮：卫星地图/普通地图切换
    let toggleMapViewControl = L.Control.extend({
      options: {
        position: 'topleft',
      },

      onAdd: function (map: any) {
        let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

        container.style.backgroundColor = 'white';
        container.style.backgroundImage = 'url(/assets/map/images/satellite.png)';
        container.style.backgroundSize = '34px 34px';
        container.style.width = '34px';
        container.style.height = '34px';

        container.onclick = function () {
          _this.toggleMapView(container);
        };

        return container;
      },
    });
    this.map.addControl(new toggleMapViewControl());
  }

  initOpc(callBack?: (res: any) => void): void {
    this.baseLayers = [];
    this.overlays = [];
    this.overlappingLayers = [];
    this.kilometerMarkerLayers = [];
    this.locationPointLayers = [];
    this.auxiliaryLineLayers = [];
    this.equipmentsLayers = [];

    const params = {
      constructionControlPlanId: this.constructionControlPlanId,
      stationId: this.stationId,
      constructionDailyPlanId: this.constructionDailyPlanId,
      opcIds: this.opcIds.toString(),
    };

    this.http.post('/api/backstage/opcMap/initMapByConstructionControlPlanId', null, params).subscribe((res) => {
      if (!res.success) return;

      this.constructionControlPlan = res.constructionControlPlan;
      this.constructionDailyPlan = res.constructionDailyPlan;
      this.rawOpcs = res.rawOpcs;
      this.planOpcs = res.planOpcs;
      this.opcMarks = res.opcMarks;
      this.opcTypeMap = OpcType.createOpcTypeMap(res.opcTypes);
      this.opcMarkTypeMap = OpcMarkType.createOpcMarkTypeMap(res.opcMarkTypes);
      this.constructionControlPlanPoints = res.constructionControlPlanPoints;
      this.kilometerMarks = res.kilometerMarks;
      this.controlPlanRailwayLineSections = res.controlPlanRailwayLineSections;
      this.dailyPlanRailwayLineSections = res.dailyPlanRailwayLineSections;
      this.rawRailwayLineSections = res.rawRailwayLineSections;

      // 加载中心点
      this.zoom = 16;
      let centerLocation: Location | undefined;
      // 定位优先级：施工点>车站>后面懒得写自己看
      if (StringUtils.arrayNotEmpty(this.constructionControlPlanPoints)) {
        centerLocation = this.constructionControlPlanPoints[0].locations[0];
      } else if (StringUtils.arrayNotEmpty(this.dailyPlanRailwayLineSections)) {
        centerLocation = this.dailyPlanRailwayLineSections[0].locations[0];
      } else if (StringUtils.arrayNotEmpty(this.controlPlanRailwayLineSections)) {
        console.log(this.controlPlanRailwayLineSections);
        centerLocation = this.controlPlanRailwayLineSections[0].locations[0];
      } else if (StringUtils.arrayNotEmpty(this.rawRailwayLineSections)) {
        centerLocation = this.rawRailwayLineSections[0].locations[0];
      } else if (StringUtils.arrayNotEmpty(this.planOpcs)) {
        centerLocation = this.planOpcs[0].locations[0];
      } else if (StringUtils.arrayNotEmpty(this.rawOpcs)) {
        this.rawOpcs.forEach((opc) => (centerLocation = StringUtils.arrayNotEmpty(opc.locations) ? opc.locations[0] : centerLocation));
      }

      if (centerLocation) this.map.panTo(latLng(centerLocation.latitude, centerLocation.longitude));

      // 画完整电缆线
      let opcLines: Polyline<turf.helpers.LineString | turf.helpers.MultiLineString, any>[] = [];
      this.rawOpcs.forEach((rawOpc) => {
        let color = '#00BFFF';

        if (StringUtils.arrayEmpty(rawOpc.locations)) return;
        this.drawPolyLine(rawOpc, { color: color, weight: 2, opacity: 0.8 });
      });
      // 画电缆标识
      if (this.opcMarks) {
        this.opcMarks.forEach((opcMark) => {
          let location = opcMark.locations ? opcMark.locations[0] : undefined;

          let opcMarkType = this.opcMarkTypeMap.get(opcMark.opcMarkTypeId);
          let opcMarkTypeName = opcMarkType ? opcMarkType.name : '';

          let title = ['名称：' + opcMark.name, '类型：' + opcMarkTypeName];
          if (opcMark.kilometerMark) title.push('公里标:' + opcMark.kilometerMark + '');
          let customIcon = this.createIcon('/assets/tmp/img/opc-marker.png');
          if (location) {
            let marker = this.drawMarker(location.longitude, location.latitude, title, customIcon, undefined, this.kilometerMarkerLayers);
            marker.on('click', () => {
              this.focusOpcMarkIdChange.emit(opcMark.id);
            });
          }
        });
      }

      // 画施工点
      this.drawConstructionControlPoints();

      // setTimeout里的东西太慢了，延迟加载
      setTimeout(() => {
        if (StringUtils.arrayEmpty(this.planOpcs)) return;

        // 画被计划截取的电缆线
        this.planOpcs.forEach((opc) => {
          let color = '#00BFFF';

          if (StringUtils.arrayEmpty(opc.locations)) return;
          let polyline = this.drawPolyLine(opc, { color: color, weight: 2, opacity: 0.8 });

          // 调试代码
          // let i = 0;
          // opc.locations.forEach(location => {
          //   if (i++ % 100 != 0) return;
          //   this.drawMarker(location.longitude, location.latitude, ['233'], this.createIcon("/assets/tmp/img/opc-marker.png"));
          // })

          opcLines.push(polyline);

          if (this.constructionControlPlan) {
            let buffer15 = this.addBuffer(polyline.toGeoJSON(), 1.5, '#ff0000');
            this.wingBuffer15 = buffer15.outerBuffer;
            this.side15Buffer = buffer15.sideBuffer;

            let buffer50 = this.addBuffer(polyline.toGeoJSON(), 5, '#ff0000', 1.5);
            this.wingBuffer50 = buffer50.outerBuffer;
            this.side50Buffer = buffer50.sideBuffer;

            let buffer100 = this.addBuffer(polyline.toGeoJSON(), 10, '#ff972b', 5);
            this.wingBuffer100 = buffer100.outerBuffer;
            this.side100Buffer = buffer100.sideBuffer;

            let buffer200 = this.addBuffer(polyline.toGeoJSON(), 20.1, '#f1ff0e', 10);
            this.wingBuffer200 = buffer200.outerBuffer;
            this.side200Buffer = buffer200.sideBuffer;

            this.addBuffer(polyline.toGeoJSON(), 20.10001, '#00e6df', 20.1);
          }
        });
        // 画施工点影响范围与20米警戒线的交集
        this.drawConstructionControlPlanPointsInfluenceArea();
      }, 5000);

      // 完整铁路线

      if (this.rawRailwayLineSections) {
        this.rawRailwayLineSections.forEach((rawRailwayLineSection) => {
          this.drawRailwayLines(rawRailwayLineSection.locations);
        });
      }
      // 画被截取后的铁路线
      if (this.constructionControlPlan) this.drawCutRailwayLineSections(this.controlPlanRailwayLineSections, '方案', 8);
      if (this.constructionDailyPlan) this.drawCutRailwayLineSections(this.dailyPlanRailwayLineSections, '日计划', 2);

      // 添加公里标标识
      if (this.kilometerMarks) {
        this.kilometerMarks.forEach((kilometerMark) => {
          let location = kilometerMark.locations ? kilometerMark.locations[0] : undefined;

          const title = ['公里标：' + kilometerMark.kilometer + '米'];
          let customIcon = this.createIcon('/assets/tmp/img/opc-marker.png');
          if (location) this.drawMarker(location.longitude, location.latitude, title, customIcon);
        });
      }

      // 施工点实时位置
      if (this.drawCurrentEquipmentLocationInterval) clearInterval(this.drawCurrentEquipmentLocationInterval);
      if (this.constructionControlPlan) {
        this.drawCurrentEquipmentLocation();
        this.drawCurrentEquipmentLocationInterval = setInterval(() => this.drawCurrentEquipmentLocation(), 3000);
      }

      if (callBack) callBack(res);
    });
  }

  drawCurrentEquipmentLocationInterval: any;
  drawCurrentEquipmentLocationCount = 0;

  ngOnDestroy(): void {
    clearInterval(this.drawCurrentEquipmentLocationInterval);
  }

  /**
   * 通过计划获取任务
   */
  drawCurrentEquipmentLocation() {
    let id = this.constructionControlPlan?.id;
    if (this.constructionDailyPlan) id = this.constructionDailyPlan.constructionControlPlanId;
    if (!id) return;
    if (this.drawCurrentEquipmentLocationCount++ > 100000) {
      clearInterval(this.drawCurrentEquipmentLocationInterval);
      return;
    }

    const params = {
      constructionControlPlanId: id,
    };

    this.http.post('/api/backstage/equipment/getEquipmentLocationByConstructionControlPlanId', null, params).subscribe((res) => {
      if (!res.success) return;
      this.equipmentsLayers = [];
      this.equipments = res.equipments;

      if (StringUtils.arrayNotEmpty(this.equipments)) {
        this.equipments.forEach((equipment) => {
          let locations = equipment.locations;
          if (StringUtils.arrayEmpty(locations)) return;

          let lastLocation = locations[locations.length - 1];
          this.equipmentLocations = locations;
          let infos = [
            '设备名：' + equipment.name,
            '设备编号：' + equipment.imei,
            '距离光电缆：' + equipment.distanceToOpc?.toFixed(2) + '米',
          ];
          // this.drawPopup(location.longitude, location.latitude, infos, this.equipmentsLayers);

          // 根据设备类型和路径上传时间区分使用的图标
          let imgUrl = '';
          let lastLocationDate = new Date(lastLocation.addTime!);
          let timepass = new Date().getTime() - lastLocationDate.getTime();
          if (equipment.equipmentType == this.equipmentConstant.MACHINE) {
            imgUrl = timepass > 5 * 1000 * 60 ? '/assets/map/images/wajueji-offline.png' : '/assets/map/images/wajueji.png';
          }
          if (equipment.equipmentType == this.equipmentConstant.SUPERVISOR) {
            imgUrl = timepass > 5 * 1000 * 60 ? '/assets/map/images/renyuan-offline.png' : '/assets/map/images/renyuan.png';
          }

          this.drawMarker(
            lastLocation.longitude,
            lastLocation.latitude,
            infos,
            this.createIcon(imgUrl, [10, 30]),
            undefined,
            this.equipmentsLayers,
          );

          if (!this.constructionDailyPlan) {
            if (equipment.equipmentType == new EquipmentConstant().MACHINE)
              this.drawPolyLineByLocation(this.equipmentLocations, { color: 'green', weight: 3 }, this.equipmentsLayers);
            if (equipment.equipmentType == new EquipmentConstant().SUPERVISOR)
              this.drawPolyLineByLocation(this.equipmentLocations, { color: 'purple', weight: 3 }, this.equipmentsLayers);
          }
        });
      }
    });
  }

  initializeMapOptions(): void {
    this.tileLayers = [
      tileLayer(
        'https://t{s}.tianditu.gov.cn/vec_w/wmts?tk=9545b898d3ae5b08ab7b250bd87102df&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}',
        {
          subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
          maxNativeZoom: 30,
          maxZoom: 30,
        },
      ),
      tileLayer(
        'https://t{s}.tianditu.gov.cn/cva_w/wmts?tk=9545b898d3ae5b08ab7b250bd87102df&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}',
        {
          subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
          zIndex: 3,
          maxNativeZoom: 30,
          maxZoom: 30,
        },
      ),
    ];
    this.mapOptions = {
      layers: this.tileLayers,
    };
  }

  tileLayers: Layer[] = [];
  showSatelliteMapView = false;

  toggleMapView(container: HTMLElement) {
    this.showSatelliteMapView = !this.showSatelliteMapView;

    container.style.backgroundImage = this.showSatelliteMapView
      ? 'url(/assets/map/images/normal-map.png)'
      : 'url(/assets/map/images/satellite.png)';

    this.tileLayers = this.showSatelliteMapView
      ? [
          tileLayer(
            'https://t{s}.tianditu.gov.cn/img_w/wmts?tk=9545b898d3ae5b08ab7b250bd87102df&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}',
            {
              subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
              maxNativeZoom: 30,
              maxZoom: 30,
            },
          ),
          // 注记
          tileLayer(
            'https://t{s}.tianditu.gov.cn/cia_w/wmts?tk=9545b898d3ae5b08ab7b250bd87102df&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}',
            {
              subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
              zIndex: 3,
              maxNativeZoom: 30,
              maxZoom: 30,
            },
          ),
        ]
      : [
          // const openstreet = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          tileLayer(
            'https://t{s}.tianditu.gov.cn/vec_w/wmts?tk=9545b898d3ae5b08ab7b250bd87102df&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}',
            {
              subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
              maxNativeZoom: 30,
              maxZoom: 30,
            },
          ),
          tileLayer(
            'https://t{s}.tianditu.gov.cn/cva_w/wmts?tk=9545b898d3ae5b08ab7b250bd87102df&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}',
            {
              subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
              zIndex: 3,
              maxNativeZoom: 30,
              maxZoom: 30,
            },
          ),
        ];
    this.mapOptions = {
      layers: this.tileLayers,
    };
  }

  drawRailwayLines(locations: Location[]) {
    // this.drawPolyLineByLocation(locations, {color: 'black', weight: 5});
    let latLngs = locations.map((location) => [location.longitude, location.latitude]);

    let flightsWE = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            flight: 'To New Delhi',
          },
          geometry: {
            type: 'LineString',
            coordinates: latLngs,
          },
        },
      ],
    };

    if (!this.map) return;
    this.baseLayers.push(
      // @ts-ignore
      L.geoJSON(flightsWE, {
        weight: 5,
        color: 'gray',
        fillColor: 'white',
        dashArray: '13, 13',
        dashOffset: '13',
      }),
    );

    this.baseLayers.push(
      // @ts-ignore
      L.geoJSON(flightsWE, {
        weight: 5,
        color: 'white',
        fillColor: 'white',
        dashArray: '13, 13',
        dashOffset: '0',
      }),
    );
  }

  drawConstructionControlPoints(): void {
    if (StringUtils.arrayEmpty(this.constructionControlPlanPoints)) return;
    // 施工点
    this.constructionControlPlanPoints.forEach((value) => {
      let location = value.locations[0];
      let shortestDistance = value.shortestDistance;
      shortestDistance = shortestDistance - value.radius > 0 ? shortestDistance - value.radius : 0;
      let color = shortestDistance < 1.5 ? 'red' : '#008000';

      if (value.collectType == this.constructionControlPlanPointConstant.POINT) {
        let title = ['最近距离', shortestDistance.toFixed(3) + '米', '影响范围', value.radius + '米'];
        let customIcon = this.createIcon('/assets/map/images/lanqi.png', [10, 30]);
        let marker = this.drawMarker(location.longitude, location.latitude, title, customIcon);
      }

      if (value.collectType == this.constructionControlPlanPointConstant.LINE) {
        value.locations.forEach((location) => {
          let message = ['最近距离', shortestDistance.toFixed(3) + '米', '影响范围', value.radius + '米'];
          let customIcon = this.createIcon('/assets/map/images/lanqi.png', [10, 30]);
          this.drawMarker(location.longitude, location.latitude, message, customIcon);
        });
        this.drawPolyLine(value, { color: color });
      }

      if (value.collectType == this.constructionControlPlanPointConstant.AREA) {
        value.locations.forEach((location) => {
          let message = ['最近距离', shortestDistance.toFixed(3) + '米', '影响范围', value.radius + '米'];
          let customIcon = this.createIcon('/assets/map/images/lanqi.png', [10, 30]);
          this.drawMarker(location.longitude, location.latitude, message, customIcon);
        });

        // 创建多边形
        this.drawPolygons(value, color);
      }
    });
  }

  // 画施工点影响范围与20米警戒线的交集
  drawConstructionControlPlanPointsInfluenceArea(): void {
    if (StringUtils.arrayEmpty(this.constructionControlPlanPoints)) return;
    // 施工点
    this.constructionControlPlanPoints.forEach((value) => {
      let location = value.locations[0];
      let shortestDistance = value.shortestDistance;
      shortestDistance = shortestDistance - value.radius > 0 ? shortestDistance - value.radius : shortestDistance;
      let color = shortestDistance - 1.5 <= value.radius ? 'red' : '#008000';

      if (value.collectType == this.constructionControlPlanPointConstant.POINT) {
        let title = ['最近距离', shortestDistance.toFixed(3) + '米', '影响范围', value.radius + '米'];
        let customIcon = this.createIcon('/assets/map/images/lanqi.png', [10, 30]);
        let marker = this.drawMarker(location.longitude, location.latitude, title, customIcon);

        if (this.wingBuffer15) this.addBufferIntersect(marker.toGeoJSON(), value.radius, '#ff0000', this.wingBuffer15);
        if (this.wingBuffer50) this.addBufferIntersect(marker.toGeoJSON(), value.radius, '#ff972b', this.wingBuffer50);
        if (this.wingBuffer100) this.addBufferIntersect(marker.toGeoJSON(), value.radius, '#f1ff0e', this.wingBuffer100);
        if (this.wingBuffer200) this.addBufferIntersect(marker.toGeoJSON(), value.radius, '#00e6df', this.wingBuffer200);
        if (value.radius != 0) this.addBufferDifference(marker.toGeoJSON(), this.side200Buffer, value.radius, '#00f082');
      }

      if (value.collectType == this.constructionControlPlanPointConstant.LINE) {
        value.locations.forEach((location) => {
          let message = ['最近距离', shortestDistance.toFixed(3) + '米', '影响范围', value.radius + '米'];
          let customIcon = this.createIcon('/assets/map/images/lanqi.png', [10, 30]);
          this.drawMarker(location.longitude, location.latitude, message, customIcon);
        });
        let polyline = this.drawPolyLine(value, { color: color });
        if (this.wingBuffer15) this.addBufferIntersect(polyline.toGeoJSON(), value.radius, '#ff0000', this.wingBuffer15);
        if (this.wingBuffer50) this.addBufferIntersect(polyline.toGeoJSON(), value.radius, '#ff972b', this.wingBuffer50);
        if (this.wingBuffer100) this.addBufferIntersect(polyline.toGeoJSON(), value.radius, '#f1ff0e', this.wingBuffer100);
        if (this.wingBuffer200) this.addBufferIntersect(polyline.toGeoJSON(), value.radius, '#00e6df', this.wingBuffer200);
        if (value.radius != 0) this.addBufferDifference(polyline.toGeoJSON(), this.side200Buffer, value.radius, '#00f082');
      }

      if (value.collectType == this.constructionControlPlanPointConstant.AREA) {
        value.locations.forEach((location) => {
          let message = ['最近距离', shortestDistance.toFixed(3) + '米', '影响范围', value.radius + '米'];
          let customIcon = this.createIcon('/assets/map/images/lanqi.png', [10, 30]);
          this.drawMarker(location.longitude, location.latitude, message, customIcon);
        });

        // 创建多边形
        let polygon = this.drawPolygons(value, color);
        if (this.wingBuffer15) this.addBufferIntersect(polygon.toGeoJSON(), value.radius, '#ff0000', this.wingBuffer15);
        if (this.wingBuffer50) this.addBufferIntersect(polygon.toGeoJSON(), value.radius, '#ff972b', this.wingBuffer50);
        if (this.wingBuffer100) this.addBufferIntersect(polygon.toGeoJSON(), value.radius, '#f1ff0e', this.wingBuffer100);
        if (this.wingBuffer200) this.addBufferIntersect(polygon.toGeoJSON(), value.radius, '#00e6df', this.wingBuffer200);
        if (value.radius != 0) this.addBufferDifference(polygon.toGeoJSON(), this.side200Buffer, value.radius, '#00f082');
      }
    });
  }

  /**
   * 画垂线，做从first到second的长为100m连线的垂线
   * @param first
   * @param second
   * @param polyLineOptions 线的样式
   * @param markerIcon 点的图标
   * @param markerTitle 弹框文字
   * @param pointOnRight 为true时，在右侧打点
   */
  drawPerpendicular(
    first: Location,
    second: Location,
    polyLineOptions: PolylineOptions,
    markerIcon: Icon,
    markerTitle: string[],
    pointOnRight?: boolean,
  ) {
    // 计算方位角
    let bearing = turf.rhumbBearing(turf.point([first.longitude, first.latitude]), turf.point([second.longitude, second.latitude]));

    let pt = turf.point([first.longitude, first.latitude], { 'marker-color': 'F00' });
    let distance = 0.1; // 公里

    let destination1 = turf.rhumbDestination(pt, distance, bearing + 90, { units: 'kilometers' });

    // @ts-ignore
    let lng1 = destination1.geometry.coordinates[0];
    // @ts-ignore
    let lat1 = destination1.geometry.coordinates[1];
    this.drawPolyLineBase([latLng(first.latitude, first.longitude), latLng(lat1, lng1)], polyLineOptions);
    if (pointOnRight) {
      this.drawMarker(lng1, lat1, markerTitle, markerIcon);
      this.drawPopup(lng1, lat1, markerTitle);
    }

    let destination2 = turf.rhumbDestination(pt, distance, bearing - 90, { units: 'kilometers' });
    // @ts-ignore
    let lng2 = destination2.geometry.coordinates[0];
    // @ts-ignore
    let lat2 = destination2.geometry.coordinates[1];
    this.drawPolyLineBase([latLng(first.latitude, first.longitude), latLng(lat2, lng2)], polyLineOptions);
    if (!pointOnRight) {
      this.drawMarker(lng2, lat2, markerTitle, markerIcon);
      this.drawPopup(lng2, lat2, markerTitle);
    }
  }

  /**
   * 画圆到overlays图层上(如果想放到baseLayers图层上，需要改最后一行)
   * @param lng 圆心经度
   * @param lat 圆心纬度
   * @param radius 半径
   * @param color 圆颜色(填充色默认为底色，可以修改fillColor改变填充色)
   */
  drawCircle(lng: number, lat: number, radius: number, color: string): L.Circle<any> | null {
    if (radius <= 0) return null;

    // 创建圆
    const circleItem = circle([lat, lng], {
      color: color,
      fillColor: '#DDDDDD',
      fillOpacity: 0.5,
      weight: 1,
      radius: radius,
    });
    this.overlays.push(circleItem);
    return circleItem;
  }

  @ViewChild('opcRightClickMenu', { read: ElementRef, static: true }) opcRightClickMenu!: ElementRef;
  checkedLocation: {
    locationId?: string;
    containsLocationData?: ContainsLocationData;
    marker?: Marker;
    areOpc: boolean;
    areRailwayLineSection: boolean;
  } = {
    areOpc: false,
    areRailwayLineSection: false,
  };

  moveCenter() {
    this.locationPointLayers = [];

    this.rawOpcs.forEach((rawOpc) => {
      if (StringUtils.arrayEmpty(rawOpc.locations)) return;
      rawOpc.locations.forEach((location) => {
        if (Math.abs(location.longitude - this.center.lng) > 0.001) return;
        if (Math.abs(location.latitude - this.center.lat) > 0.001) return;
        let marker = this.drawMarker(
          location.longitude,
          location.latitude,
          ['光电缆测量点'],
          this.createIcon('/assets/map/images/editmarker.png'),
          undefined,
          this.locationPointLayers,
        );

        marker.on('click', () => {
          this.checkedLocation = {
            locationId: location.id,
            containsLocationData: rawOpc,
            marker: marker,
            areOpc: true,
            areRailwayLineSection: false,
          };
          this.getDistanceFromOpcOrRailwayLine();
        });
        marker.on('contextmenu', () => {
          this.checkedLocation = {
            locationId: location.id,
            containsLocationData: rawOpc,
            marker: marker,
            areOpc: true,
            areRailwayLineSection: false,
          };
          const content = this.opcRightClickMenu.nativeElement;
          const popup = L.popup().setContent(content).setLatLng(new LatLng(location.latitude, location.longitude));
          this.map.openPopup(popup);
        });
      });
    });

    this.rawRailwayLineSections.forEach((rawRailwayLineSection) => {
      rawRailwayLineSection.locations.forEach((location) => {
        if (Math.abs(location.longitude - this.center.lng) > 0.001) return;
        if (Math.abs(location.latitude - this.center.lat) > 0.001) return;
        let marker = this.drawMarker(
          location.longitude,
          location.latitude,
          location.kilometerMark ? ['铁路测量点', '公里标：' + location.kilometerMark] : ['铁路测量点'],
          this.createIcon('/assets/map/images/railway-line-location.png'),
          undefined,
          this.locationPointLayers,
        );

        marker.on('click', () => {
          this.checkedLocation = {
            locationId: location.id,
            containsLocationData: rawRailwayLineSection,
            marker: marker,
            areOpc: false,
            areRailwayLineSection: true,
          };
          this.getDistanceFromOpcOrRailwayLine();
        });
        marker.on('contextmenu', () => {
          this.checkedLocation = {
            locationId: location.id,
            containsLocationData: rawRailwayLineSection,
            marker: marker,
            areOpc: false,
            areRailwayLineSection: true,
          };
          const content = this.opcRightClickMenu.nativeElement;
          const popup = L.popup().setContent(content).setLatLng(new LatLng(location.latitude, location.longitude));
          this.map.openPopup(popup);
        });
      });
    });
  }

  deleteLocationConfirm() {
    this.confirmSrv.confirm({
      nzTitle: '确认要删除该点吗？',
      nzContent: '',
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: () => {
        this.checkedLocation.marker!.remove();
        this.deleteLocation(this.checkedLocation.locationId!, this.checkedLocation.containsLocationData!, this.checkedLocation.marker!);
      },
      nzOnCancel: () => {},
    });
  }

  deleteLocation(id: string, containsLocationData: ContainsLocationData, marker: Marker) {
    this.http.post('/api/backstage/location/delete', null, { id: id }).subscribe((res) => {
      if (!res.success) return;
      containsLocationData.locations = containsLocationData.locations.filter((location) => location.id != id);
      marker.remove();
      this.msg.success('提交成功');
    });
  }

  getDistanceFromOpcOrRailwayLine() {
    let rawOpcIds = this.rawOpcs.map((rawOpc) => rawOpc.id);
    let rawRailwayLineSectionIds = this.rawRailwayLineSections.map((rawRailwayLineSection) => rawRailwayLineSection.id);
    const params = {
      locationId: this.checkedLocation.locationId,
      containsLocationDataId: this.checkedLocation.containsLocationData!.id,
      areOpc: this.checkedLocation.areOpc,
      areRailwayLineSection: this.checkedLocation.areRailwayLineSection,
      rawOpcIds: rawOpcIds.toString(),
      rawRailwayLineSectionIds: rawRailwayLineSectionIds.toString(),
    };

    this.http.post('/api/backstage/location/getDistanceFromOpcOrRailwayLine', null, params).subscribe((res) => {
      if (!res.success) return;
      this.msg.success(res.msg);
    });
  }

  /**
   * 添加标识
   * @param lng 经度
   * @param lat 纬度
   * @param title 提示信息，是个string数组，数组中每个string占一行
   * @param customIcon 自定义标识
   * @param markerOpctions 样式
   * @param layers 添加到哪个图层
   */
  drawMarker(lng: number, lat: number, title: string[], customIcon: Icon, markerOpctions?: MarkerOptions, layers?: Layer[]): Marker {
    const marker = new Marker([lat, lng], markerOpctions);
    marker.setIcon(customIcon);

    // title = title.concat(['lng', lng + ''])
    // title = title.concat(['lat', lat + ''])
    marker.bindPopup(title.join('<br/>'));
    marker.getPopup()?.setLatLng(latLng(lat, lng));
    // marker.on('click', () => {
    //   if (id)
    //     this._clipboardService.copyFromContent(id);
    // });
    if (layers) layers.push(marker);
    else this.overlays.push(marker);
    return marker;
  }

  drawPopup(lng: number, lat: number, title: string[], layers?: Layer[]) {
    if (layers) L.popup().setLatLng(latLng(lat, lng)).setContent(title.join('<br/>')).addTo(new LayerGroup(layers));

    L.popup().setLatLng(latLng(lat, lng)).setContent(title.join('<br/>')).addTo(this.map);
  }

  /**
   * 画线
   * @param containsLocationData 包含location的数据
   * @param options 主要是样式
   */
  drawPolyLine(containsLocationData: ContainsLocationData, options: PolylineOptions): Polyline<LineString | MultiLineString, any> {
    let points: LatLng[] = [];
    let locations = containsLocationData.locations;

    locations.forEach((point) => {
      points.push(latLng(point.latitude, point.longitude));
    });
    return this.drawPolyLineBase(points, options);
  }

  drawPolyLineBase(points: LatLng[], options: PolylineOptions, layers?: Layer[]): Polyline<LineString | MultiLineString, any> {
    let polylineItem = polyline(points, options);
    if (!layers) layers = this.overlays;
    layers.push(polylineItem);
    return polylineItem;
  }

  drawPolyLineByLocation(locations: Location[], options: PolylineOptions, layers?: Layer[]): Polyline<LineString | MultiLineString, any> {
    let points: LatLng[] = [];

    locations.forEach((location) => {
      points.push(latLng(location.latitude, location.longitude));
    });
    return this.drawPolyLineBase(points, options, layers);
  }

  //
  /**
   * 画光缆环形色带（辅助线）
   * @param geoJson
   * @param outerWidth 画色带的时候，外环半径
   * @param color
   * @param innerWidth 画色带的时候，内环半径
   * @return { outerBuffer: 光缆到光缆圆形的色带, sideBuffer: 光缆周围的环形色带 }
   */
  addBuffer(
    geoJson: geojson.Feature,
    outerWidth: number,
    color: string,
    innerWidth?: number,
  ): {
    outerBuffer: turf.helpers.Feature<turf.helpers.Polygon | turf.helpers.MultiPolygon, turf.helpers.Properties>;
    sideBuffer: turf.helpers.Feature<turf.helpers.Polygon | turf.helpers.MultiPolygon, turf.helpers.Properties>;
  } {
    let buffer = turf.buffer(geoJson, outerWidth, { units: 'meters' });
    let featureData = buffer.geometry;
    if (innerWidth) {
      let innerBuffer = turf.buffer(geoJson, innerWidth, { units: 'meters' });
      // @ts-ignore
      featureData = turf.difference(buffer, innerBuffer);
    }
    if (buffer && featureData) {
      let options = {
        color: color,
        fillColor: color,
        width: 0.2,
        fill: true,
        fillOpacity: 0,
        // dashArray: '20, 20',
        // dashOffset: '20',
        stroke: true,
      };
      // @ts-ignore
      let geometryLayer = L.GeoJSON.geometryToLayer(featureData, options);
      let path = geometryLayer as Path;
      this.auxiliaryLineLayers.push(path);
    }
    if (innerWidth) {
      return {
        // @ts-ignore
        outerBuffer: featureData,
        sideBuffer: buffer,
      };
    }
    return {
      outerBuffer: buffer,
      sideBuffer: buffer,
    };
  }

  addBufferWithFillOpacity(
    geoJson: geojson.Feature,
    outerWidth: number,
    color: string,
    innerWidth: number,
  ): turf.helpers.Feature<turf.helpers.Polygon | turf.helpers.MultiPolygon, turf.helpers.Properties> {
    let buffer = turf.buffer(geoJson, outerWidth, { units: 'meters' });
    let featureData;
    let innerBuffer = turf.buffer(geoJson, innerWidth, { units: 'meters' });
    // @ts-ignore
    featureData = turf.difference(buffer, innerBuffer);

    if (buffer && featureData) {
      let options = {
        color: color,
        fillColor: color,
        width: 2,
        fill: true,
        fillRule: 'evenodd',
        fillOpacity: 0.4,
        stroke: false,
      };
      // @ts-ignore
      let geometryLayer = L.GeoJSON.geometryToLayer(featureData, options);
      let path = geometryLayer as Path;
      this.overlappingLayers.push(path);
    }
    if (innerWidth) {
      // @ts-ignore
      return featureData;
    }
    return buffer;
  }

  /**
   * 在geoJson对应的点附近画半径为width的圆，并画出这个圆与innerBuffer相交的区域
   * @param geoJson
   * @param width
   * @param color
   * @param innerBuffer
   */
  addBufferIntersect(
    geoJson: geojson.Feature<any, any>,
    width: number,
    color: string,
    innerBuffer?: turf.helpers.Feature<turf.helpers.Polygon | turf.helpers.MultiPolygon, turf.helpers.Properties>,
  ): void {
    if (width == 0) return;
    let buffer = turf.buffer(geoJson, width, { units: 'meters' });

    // @ts-ignore
    let featureData = turf.intersect(buffer, innerBuffer);

    if (featureData) {
      let options = {
        color: color,
        fillColor: color,
        fill: true,
        fillRule: 'evenodd',
        fillOpacity: 0.6,
        stroke: false,
      };
      // @ts-ignore
      let geometryLayer = L.GeoJSON.geometryToLayer(featureData, options);
      let path = geometryLayer as Path;
      this.overlappingLayers.push(path);
    }
  }

  addBufferDifference(
    geoJson: geojson.Feature<any, any>,
    differenceBuffer: turf.helpers.Feature<turf.helpers.Polygon | turf.helpers.MultiPolygon, turf.helpers.Properties> | undefined,
    width: number,
    color: string,
  ): void {
    let options = {
      color: color,
      fillColor: color,
      fill: true,
      fillRule: 'evenodd',
      fillOpacity: 0.6,
      stroke: false,
    };

    let buffer = turf.buffer(geoJson, width, { units: 'meters' });

    if (!differenceBuffer) {
      // @ts-ignore
      let geometryLayer = L.GeoJSON.geometryToLayer(buffer, options);
      let path = geometryLayer as Path;
      this.overlappingLayers.push(path);
      return;
    }
    // @ts-ignore
    let featureData = turf.difference(buffer, differenceBuffer);

    if (featureData) {
      // @ts-ignore
      let geometryLayer = L.GeoJSON.geometryToLayer(featureData, options);
      let path = geometryLayer as Path;
      this.overlappingLayers.push(path);
    }
  }

  /**
   * 画多边形
   * @param containsLocationData
   * @param color
   */
  drawPolygons(containsLocationData: ContainsLocationData, color: string): Polygon {
    let points: LatLng[] = [];
    containsLocationData.locations.forEach((point) => {
      points.push(latLng(point.latitude, point.longitude));
    });
    return this.drawPolygonsBase(points, color);
  }

  drawPolygonsBase(points: LatLng[], color: string): Polygon {
    let polylineItem = polygon(points, { color: color });
    this.overlays.push(polylineItem);
    return polylineItem;
  }

  drawPolygonsLatLngArrays(points: Position[][], color: string): void {
    // this.drawPolygonsBase(latLngs, color);
  }

  createIcon(url: string, iconAnchor?: number[], iconSize?: number[]): Icon {
    let iconOptions: IconOptions = {
      iconUrl: url,
      iconSize: [30, 30],
    };

    if (iconAnchor) iconOptions.iconAnchor = L.point({ x: iconAnchor[0], y: iconAnchor[1] });
    if (iconSize) iconOptions.iconSize = L.point({ x: iconSize[0], y: iconSize[1] });

    return icon(iconOptions);
  }

  /**
   * 画被切割的铁路线
   * @param railwayLineSections
   * @param startKilometer
   * @param endKilometer
   * @param msgPrefix
   */
  drawCutRailwayLineSections(railwayLineSections: RailwayLineSection[], msgPrefix: string, perpendicularWeight: number): void {
    railwayLineSections.forEach((railwayLineSection) => {
      let locations = railwayLineSection.locations;

      this.drawRailwayLines(locations);

      if (locations.length > 2) {
        let startKilometerStr = new KilometerPipe().transform(locations[1].kilometerMark);
        let startKilometerMsg = [msgPrefix + '起始：' + startKilometerStr];
        this.drawPerpendicular(
          locations[0],
          locations[1],
          {
            color: '#905a3d',
            weight: perpendicularWeight,
          },
          this.createIcon('/assets/tmp/img/start-kilometer-marker.png'),
          startKilometerMsg,
          false,
        );
      }
      if (locations.length > 4) {
        let endKilometerStr = new KilometerPipe().transform(locations[locations.length - 1].kilometerMark);
        let endKilometerMsg = [msgPrefix + '截止：' + endKilometerStr];
        this.drawPerpendicular(
          locations[locations.length - 1],
          locations[locations.length - 2],
          {
            color: '#905a3d',
            weight: perpendicularWeight,
          },
          this.createIcon('/assets/tmp/img/end-kilometer-marker.png'),
          endKilometerMsg,
          true,
        );
      }
    });
  }
}
