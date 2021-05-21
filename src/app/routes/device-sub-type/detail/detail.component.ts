import { Component, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

export interface DeviceSubType {
  id: string;
  name: string;
  deviceTypeId: string;
  description: string;
  remark: string;
  deviceTypeName: string;
}

@Component({
  selector: 'app-device-sub-type-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['../../device-type/detail/detail.component.css'],
})
export class DeviceSubTypeDetailComponent implements OnInit {
  validateForm: FormGroup;
  deviceSubType: DeviceSubType = {
    id: '',
    name: '',
    deviceTypeId: '',
    description: '',
    remark: '',
    deviceTypeName: '',
  };
  loading = false;

  executeInfo() {
    const params = {
      id: this.deviceSubType.id,
      name: this.deviceSubType.name,
      deviceTypeId: this.deviceSubType.deviceTypeId,
      description: this.deviceSubType.description,
      remark: this.deviceSubType.remark,
    };
    this.http.post('/api/backstage/deviceSubType/saveOrUpdate', null, params).subscribe((res) => {
      if (!res.success) return;

      this.msg.success(res.msg);
      this.router.navigate(['/device-type/list']);
    });
  }

  loadDataFromServer(): void {
    this.http
      .post('/api/backstage/deviceSubType/info', null, {
        id: this.deviceSubType.id,
        deviceTypeId: this.deviceSubType.deviceTypeId,
      })
      .subscribe((res) => {
        if (!res.success) return;
        this.loading = false;
        this.deviceSubType.deviceTypeId = res.deviceSubType.deviceTypeId;
        this.deviceSubType.deviceTypeName = res.deviceSubType.deviceTypeName;
        if (res.deviceSubType.id) this.deviceSubType = res.deviceSubType;
        this.validateForm.controls.deviceTypeName.disable();
      });
  }

  constructor(
    public http: _HttpClient,
    private activatedRoute: ActivatedRoute,
    private msg: NzMessageService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      deviceTypeName: [''],
      description: [''],
      remark: [''],
    });
  }

  ngOnInit(): void {
    // 获取roleId
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.deviceTypeId) this.deviceSubType.deviceTypeId = queryParams.deviceTypeId;
      if (queryParams.deviceSubTypeId) this.deviceSubType.id = queryParams.deviceSubTypeId;
    });
    // 加载菜单信息
    this.loadDataFromServer();
  }
}
