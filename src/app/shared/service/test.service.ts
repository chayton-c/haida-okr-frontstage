import { Injectable } from '@angular/core';
import {_HttpClient} from "@delon/theme";
import {NzCascaderOption} from "ng-zorro-antd/cascader/typings";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TestService {

  lineStationCasecaderOption: Array<NzCascaderOption> = [];

  constructor(
    public http: _HttpClient,) {
    this.initPage();
  }

  initPage(): void {
  }

  getLineStationCasecaderOption(): Observable<any> {
    return this.http.post('/api/backstage/line/initSelectTrees');
  }
}
