import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { Pojo } from '../../../pojos/common/pojo';
import {Organization} from "../../../pojos/organization/organization";
import {User} from "../../../pojos/user/user";
import {Role} from "../../../pojos/auth/role/role";
import {Equipment, EquipmentConstant} from "../../../pojos/equipment/equipment";
import {HttpUtils} from "../../../shared/utils/http-utils";


@Component({
  selector: 'app-equipment-info',
  templateUrl: './info.component.html',
})
export class EquipmentInfoComponent implements OnInit {
  validateForm: FormGroup;
  checkedOrganizationId = '';
  equipmentConstant: EquipmentConstant = new EquipmentConstant();
  equipment: Equipment = {
    locations: [],
    id: "",
    imei: "",
    name: "",
    status: this.equipmentConstant.NORMAL,
    workshopId: "",
    equipmentType: this.equipmentConstant.SUPERVISOR
  };
  workshops: Organization[] = [];
  loading = false;

  // ----表单部分
  // 验证岗位名是否重复
  roleValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        this.http.post('/api/backstage/equipment/checkUserName', null, { imei: this.equipment.imei, id: this.equipment.id }).subscribe((res) => {
          if (!res.success) observer.next({ error: true, duplicated: true });
          else observer.next(null);
          observer.complete();
        });
      }, 10);
    });

  // 提交数据
  execute() {
    this.http.post('/api/backstage/equipment/saveOrUpdate', null, HttpUtils.transform(this.equipment)).subscribe((res) => {
      if (!res.success) return;

      this.msg.success(res.msg);
      this.router.navigate(['/equipment/list']);
    });
  }

  loadDataFromServer(): void {
    this.http
      .post('/api/backstage/equipment/info', null, {
        id: this.equipment.id
      })
      .subscribe((res) => {
        this.workshops = res.workshops;
        this.equipment = res.equipment;
        if (!this.equipment.workshopId && this.workshops.length == 1) {
          this.equipment.workshopId = this.workshops[0].id;
          this.validateForm.controls.workshopId.disable();
        }

        this.loading = false;
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
      workshopId: [''],
      equipmentType: [''],
      name: [''],
      imei: [''],
      linkmanPhoneNumber: [''],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.id) this.equipment.id = queryParams.id;
    });
    // 加载菜单信息
    this.loadDataFromServer();
  }
}

