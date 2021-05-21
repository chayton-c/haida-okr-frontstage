import { Component, Injector, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { _HttpClient } from '@delon/theme';
import { Router } from '@angular/router';
import { Role } from '../../../pojos/auth/role/role';
import { NzMessageService } from 'ng-zorro-antd/message';

interface FormParams {
  name: string;
}

@Component({
  selector: 'app-role-list',
  templateUrl: './list.component.html',
})
export class RoleListComponent implements OnInit {
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  formParams: FormParams = {
    name: '',
  };
  roles: Role[] = [];
  loading = true;
  total = 1;
  pageSize = 10;
  pageIndex = 1;

  loadDataFromServer(pageIndex: number, pageSize: number, formParams: FormParams): void {
    this.loading = true;

    const params = {
      pageSize: pageSize,
      currentPage: pageIndex,
      name: formParams.name,
    };

    this.http.post('/api/role', null, params).subscribe((res) => {
      this.loading = false;
      this.roles = res.roles;
      this.total = res.page.dataTotal;
    });
  }

  addPage(): void {
    this.router.navigate(['/role/detail']);
  }

  updatePage(): void {
    let checkedId = this.setOfCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('请选择需要修改的岗位');
      return;
    }

    this.router.navigate(['/role/detail'], {
      queryParams: { id: checkedId },
    });
  }

  updateAuth(): void {
    let checkedId = this.setOfCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('请选择需要修改的岗位');
      return;
    }

    this.router.navigate(['/role/detail'], {
      queryParams: { id: checkedId, step: 1 },
    });
  }

  deleteRole(): void {
    let roleIds: string[] = [];
    this.setOfCheckedId.forEach((value) => roleIds.push(value));
    if (roleIds.length == 0) {
      this.msg.error('请选择需要删除的岗位');
      return;
    }

    this.http.post('/api/role/deleteRole', null, { roleIds: roleIds.toString() }).subscribe((res) => {
      if (!res.success) return;

      this.msg.info('删除成功');

      this.loadDataFromServer(this.pageIndex, this.pageSize, this.formParams);
    });
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) this.setOfCheckedId.add(id);
    else this.setOfCheckedId.delete(id);
  }

  onAllChecked(checked: boolean): void {
    this.roles.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.roles;
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.loadDataFromServer(pageIndex, pageSize, this.formParams);
  }

  resetFormParams(): void {
    this.formParams = {
      name: '',
    };
  }

  constructor(public http: _HttpClient, public injector: Injector, public router: Router, public msg: NzMessageService) {}

  ngOnInit(): void {
    this.loadDataFromServer(this.pageIndex, this.pageSize, this.formParams);
  }
}
