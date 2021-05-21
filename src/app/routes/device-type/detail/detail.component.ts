import { Component, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface DeviceType {
  id: string;
  name: string;
}

@Component({
  selector: 'app-device-type-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DeviceTypeDetailComponent implements OnInit {
  validateForm: FormGroup;
  deviceType: DeviceType = {
    id: '',
    name: '',
  };
  loading = false;

  executeInfo() {
    const params = {
      id: this.deviceType.id,
      name: this.deviceType.name,
    };
    this.http.post('/api/backstage/deviceType/saveOrUpdate', null, params).subscribe((res) => {
      if (!res.success) return;

      this.msg.success(res.msg);
      this.router.navigate(['/device-type/list']);
    });
  }

  loadDataFromServer(): void {
    this.http
      .post('/api/backstage/deviceType/info', null, {
        id: this.deviceType.id,
      })
      .subscribe((res) => {
        if (!res.success) return;
        this.loading = false;
        if (res.deviceType.id) this.deviceType = res.deviceType;
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
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.deviceTypeId) this.deviceType.id = queryParams.deviceTypeId;
    });
    // 加载菜单信息
    this.loadDataFromServer();
  }
}
