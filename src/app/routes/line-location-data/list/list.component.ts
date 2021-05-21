import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { _HttpClient } from '@delon/theme';
import { Layer } from 'leaflet';

@Component({
  selector: 'line-location-data-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class LineLocationDataListComponent implements AfterViewInit {
  // @ts-ignore
  private map: L.Map;

  formParams: {
    wasAllLine: string;
    stationId: string;
  } = {
    wasAllLine: '0',
    stationId: '',
  };

  railwayLineLayer: Layer | undefined;

  constructor(public http: _HttpClient) {}

  test() {
    console.log('this.formParams.wasAllLine');
    console.log(this.formParams.wasAllLine);
    if (this.formParams.wasAllLine === '0' && this.formParams.stationId == '') console.log(35);
  }
  // 完整铁路线路
  loadRawRailwayLineLocations() {
    if (this.formParams.wasAllLine === '0' && this.formParams.stationId == '') return;
    console.log(40);
    const params = {
      wasAllLine: this.formParams.wasAllLine,
      stationId: this.formParams.stationId,
    };
    this.http.post('/api/backstage/location/getAllRailwayLineStringLocations', null, params).subscribe((res: any) => {
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

  private initMap(): void {
    this.map = L.map('line-map', {
      center: [45.779577, 126.707084],
      zoom: 12,
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      // attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  ngOnInit(): void {
    // this.test();
    this.loadRawRailwayLineLocations();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
