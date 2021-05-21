import { Component, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import {NzTreeNode, NzTreeNodeOptions} from "ng-zorro-antd/core/tree";
import {Device} from "../../../pojos/device/device";

@Component({
  selector: 'app-device-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DeviceDetailComponent implements OnInit {
  validateForm: FormGroup;
  device: Device = {
    id: '',
    name: '',
    code: '',
    stationId: '',
    deviceTypeIdOrDeviceSubTypeId: '',
    deviceModel: '',
    remark: '',
  };
  formParams = {};
  loading = false;
  deviceTypeSelectTreeNodes: Array<NzTreeNodeOptions> = [];
  lineSelectTreeNodes: Array<NzTreeNodeOptions> = [];

  execute() {
    const params = {
      id: this.device.id,
      code: this.device.code,
      name: this.device.name,
      stationId: this.device.stationId,
      deviceTypeIdOrDeviceSubTypeId: this.device.deviceTypeIdOrDeviceSubTypeId,
      deviceModel: this.device.deviceModel,
      remark: this.device.remark,
    };
    this.http.post('/api/backstage/device/saveOrUpdate', null, params).subscribe((res) => {
      if (!res.success) return;

      this.msg.success(res.msg);
      this.router.navigate(['/device/list']);
    });
  }

  loadDataFromServer(): void {
    this.http
      .post('/api/backstage/device/info', null, {
        id: this.device.id,
      })
      .subscribe((res) => {
        if (!res.success) return;
        this.loading = false;
        if (res.device.id) this.device = res.device;
      });
  }

  loadSelectTrees(): void {
    this.http.post('/api/backstage/line/initSelectTrees').subscribe((res) => {
      this.deviceTypeSelectTreeNodes = res.deviceTypeSelectTreeNodes;
      this.lineSelectTreeNodes = res.lineSelectTreeNodes;
      this.lineSelectTreeNodes.forEach(value => value.disabled = true);
    });
  }

  // 验证同车站下设备编码是否重复
  deviceCodeValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (!this.device.stationId) {
          observer.next({ error: true, needStationId: true });
          observer.complete();
          return;
        }

        const params = {
          id: this.device.id,
          code: this.device.code,
          stationId: this.device.stationId
        }
        this.http.post('/api/backstage/device/checkCode', null, params).subscribe((res) => {
          if (!res.success) observer.next({ error: true, duplicated: true });
          else observer.next(null);
          observer.complete();
        });
      }, 10);
    });

  constructor(
    public http: _HttpClient,
    private activatedRoute: ActivatedRoute,
    private msg: NzMessageService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      stationId: ['', [Validators.required]],
      deviceTypeIdOrDeviceSubTypeId: ['', [Validators.required]],
      deviceModel: [''],
      remark: [''],
    });
  }

  ngOnInit(): void {
    // 获取roleId
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.id) this.device.id = queryParams.id;
      if (queryParams.formParams) this.formParams = queryParams.formParams;
      console.log(this.formParams)
    });
    // 加载菜单信息
    this.loadDataFromServer();
    // 加载设备类型和环境位置信息
    this.loadSelectTrees();
  }
}
