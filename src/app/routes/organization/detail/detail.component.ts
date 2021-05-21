import { Component, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import {Organization} from "../../../pojos/organization/organization";

@Component({
  selector: 'app-organization-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class OrganizationDetailComponent implements OnInit {
  validateForm: FormGroup;
  organization: Organization = {
    id: '',
    level: 0,
    name: '',
    description: '',
    remark: '',
  };
  parentOrganizations: Organization[] = [];
  loading = false;
  checkedOrganizationId = '';

  // ----表单部分
  // 验证单位名是否重复
  organizationValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        this.http
          .post('/api/backstage/organization/checkOrganization', null, { name: this.organization.name, id: this.organization.id })
          .subscribe((res) => {
            if (!res.success) observer.next({ error: true, duplicated: true });
            else observer.next(null);
            observer.complete();
          });
      }, 10);
    });

  // 提交岗位信息
  executeRoleInfo() {
    const params = {
      id: this.organization.id,
      name: this.organization.name,
      parentId: this.organization.parentId,
      description: this.organization.description,
      remark: this.organization.remark,
    };
    this.http.post('/api/backstage/organization/saveOrUpdate', null, params).subscribe((res) => {
      if (!res.success) return;

      this.msg.success(res.msg);
      this.router.navigate(['/organization/list']);
    });
  }

  loadDataFromServer(): void {
    this.http
      .post('/api/backstage/organization/info', null, {
        organizationId: this.organization.id,
        parentOrganizationId: this.checkedOrganizationId,
      })
      .subscribe((res) => {
        if (!res.success) return;
        this.loading = false;
        this.parentOrganizations = res.parentOrganizations;
        this.organization.parentId = res.organization.parentId;
        if (res.organization.id) this.organization = res.organization;
        // if (this.organization.level == 1)
        //   this.validateForm.controls.parentId.disable();
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
      name: ['', [Validators.required], [this.organizationValidator]],
      parentId: [''],
      remark: [''],
      description: [''],
    });
  }

  ngOnInit(): void {
    // 获取roleId
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.organizationId) this.organization.id = queryParams.organizationId;
      if (queryParams.checkedOrganizationId) this.checkedOrganizationId = queryParams.checkedOrganizationId;
    });
    // 加载菜单信息
    this.loadDataFromServer();
  }
}
