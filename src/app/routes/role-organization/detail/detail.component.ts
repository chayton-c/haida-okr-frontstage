import { Component, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import {Role} from "../../../pojos/auth/role/role";

@Component({
  selector: 'app-role-organization-detail',
  templateUrl: './detail.component.html',
})
export class RoleOrganizationDetailComponent implements OnInit {
  validateForm: FormGroup;
  roleId: string = '';
  organizationId: string = '';
  roles: Role[] = [];
  loading = false;

  execute() {
    const params = {
      roleId: this.roleId,
      organizationId: this.organizationId,
    };
    this.http.post('/api/backstage/roleOrganization/add', null, params).subscribe((res) => {
      if (!res.success) return;

      this.msg.success(res.msg);
      this.router.navigate(['/organization/list']);
    });
  }

  loadDataFromServer(): void {
    this.http
      .post('/api/backstage/roleOrganization/getRestRolesByOrganizationId', null, {
        organizationId: this.organizationId,
      })
      .subscribe((res) => {
        if (!res.success) return;
        this.loading = false;
        this.roles = res.roles;
        console.log(this.roles)
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
      roleId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // 获取roleId
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.organizationId) this.organizationId = queryParams.organizationId;
    });
    // 加载菜单信息
    this.loadDataFromServer();
  }
}
