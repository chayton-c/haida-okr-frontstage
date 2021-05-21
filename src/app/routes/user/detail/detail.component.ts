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


@Component({
  selector: 'app-user-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  validateForm: FormGroup;
  checkedOrganizationId = '';
  user: User = {
    id: '',
    userName: '',
    displayName: '',
    bureauId: '',
    sectionId: '',
    workshopId: '',
    workAreaId: '',
    roleId: '',
  };
  bureaus: Organization[] = [];
  sections: Organization[] = [];
  workshops: Organization[] = [];
  workAreas: Organization[] = [];
  roles: Role[] = [];
  loading = false;

  // ----表单部分
  // 验证岗位名是否重复
  roleValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        this.http.post('/api/backstage/user/checkUserName', null, { userName: this.user.userName, id: this.user.id }).subscribe((res) => {
          if (!res.success) observer.next({ error: true, duplicated: true });
          else observer.next(null);
          observer.complete();
        });
      }, 10);
    });

  // 提交岗位信息
  executeRoleInfo() {


    const params = {
      id: this.user.id,
      userName: this.user.userName,
      displayName: this.user.displayName,
      bureauId: this.user.bureauId,
      sectionId: this.user.sectionId,
      workshopId: this.user.workshopId,
      workAreaId: this.user.workAreaId,
      roleId: this.user.roleId,
    };
    this.http.post('/api/backstage/user/saveOrUpdate', null, params).subscribe((res) => {
      if (!res.success) return;

      this.user = res.role;
      this.msg.success(res.msg);
      this.router.navigate(['/organization/list']);
    });
  }

  loadDataFromServer(): void {
    this.http
      .post('/api/backstage/user/infoPage', null, {
        userId: this.user.id,
        checkedOrganizationId: this.checkedOrganizationId,
      })
      .subscribe((res) => {
        this.bureaus = res.bureaus;
        this.sections = res.sections;
        this.workshops = res.workshops;
        this.workAreas = res.workAreas;
        this.roles = res.roles;
        this.user = res.user;
        if (res.user.id) this.validateForm.controls.userName.disable();
        this.validateForm.controls.bureauId.disable();
        this.loading = false;
      });
  }

  resetOrganizations(level: number): void {
    if (level == 3) {
      let checkedWorkArea = this.workAreas.find((value) => value.id == this.user.workAreaId);
      if (!checkedWorkArea || checkedWorkArea.parentId != this.user.workshopId) this.user.workAreaId = '';
    }
    if (level == 2) {
      let checkedWorkshop = this.workshops.find((value) => value.id == this.user.workshopId);
      if (!checkedWorkshop || checkedWorkshop.parentId != this.user.sectionId) this.user.workshopId = '';
    }
    if (level == 1) {
      let checkedSection = this.sections.find((value) => value.id == this.user.sectionId);
      if (!checkedSection || checkedSection.parentId != this.user.bureauId) this.user.sectionId = '';
    }
  }

  constructor(
    public http: _HttpClient,
    private activatedRoute: ActivatedRoute,
    private msg: NzMessageService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required], [this.roleValidator]],
      displayName: ['', [Validators.required]],
      roleId: ['', [Validators.required]],
      bureauId: [''],
      sectionId: [''],
      workshopId: [''],
      workAreaId: [''],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.userId) this.user.id = queryParams.userId;
      if (queryParams.checkedOrganizationId) this.checkedOrganizationId = queryParams.checkedOrganizationId;
    });
    // 加载菜单信息
    this.loadDataFromServer();
  }
}
