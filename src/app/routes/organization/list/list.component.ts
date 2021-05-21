import { Component, Injector, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { OnReuseInit, ReuseHookOnReuseInitType } from '@delon/abc/reuse-tab';
import { Organization } from '../../../pojos/organization/organization';
import { Role } from '../../../pojos/auth/role/role';
import { User } from '../../../pojos/user/user';

interface UserFormParams {
  displayName: string;
}

interface RoleFormParams {
  name: string;
}

interface SubordinateOrganizationFormParams {
  name: string;
}

@Component({
  selector: 'app-organization-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class OrganizationListComponent implements OnInit, OnReuseInit {
  _onReuseInit(type?: ReuseHookOnReuseInitType): void {
    this.loadOrganizationDataFromServer();
    this.loadRoleDataFromServer(this.rolePageIndex, this.rolePageSize, this.roleFormParams);
    this.loadSubordinateOrganizationFromServer(
      this.subordinateOrganizationPageIndex,
      this.subordinateOrganizationPageSize,
      this.subordinateOrganizationFormParams,
    );
  }

  ngOnInit(): void {
    this.titleService.setTitle('组织管理');
    // 加载菜单信息
    this.loadOrganizationDataFromServer();
  }

  constructor(
    public http: _HttpClient,
    private msg: NzMessageService,
    public injector: Injector,
    public router: Router,
    private titleService: TitleService,
  ) {}

  // =============================左侧树形菜单部分=======================================
  organizationLoading = false;
  organizations: Organization[] = [];
  organizationList: Set<Organization> = new Set();
  checkedOrganization: Organization | undefined = undefined;
  mapOfExpandedData: { [id: string]: Organization[] } = {};

  collapse(array: Organization[], data: Organization, $event: boolean): void {
    if ($event) return;

    if (!data.organizationList) return;

    data.organizationList.forEach((d) => {
      const target = array.find((a) => a.id === d.id)!;
      target.expand = false;
      this.collapse(array, target, false);
    });
  }

  convertTreeToList(root: Organization): Organization[] {
    const stack: Organization[] = [];
    const array: Organization[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: true });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.organizationList && node.organizationList.length == 0) node.organizationList = undefined;
      if (node.organizationList) {
        for (let i = node.organizationList.length - 1; i >= 0; i--) {
          let expand: undefined | boolean = node.level == 0 || (this.checkedOrganization && this.checkedOrganization.id == node.id);
          stack.push({ ...node.organizationList[i], level: node.level! + 1, expand: expand, parent: node });
        }
      }
    }

    // 如果没有选择的组织，选择第一个
    let hasSelectedOrganizations = false;
    this.organizationList.forEach((value) => {
      if (value.selected) hasSelectedOrganizations = true;
    });
    if (!hasSelectedOrganizations) this.clickOrganization(this.organizationList.values().next().value);

    return array;
  }

  clickOrganization(item: Organization) {
    this.organizationList.forEach((value) => (value.selected = false));
    item.selected = true;
    this.checkedOrganization = item;
    this.loadUsersFromServer(this.userPageIndex, this.userPageSize, this.userFormParams);
    this.loadRoleDataFromServer(this.rolePageIndex, this.rolePageSize, this.roleFormParams);
    this.loadSubordinateOrganizationFromServer(
      this.subordinateOrganizationPageIndex,
      this.subordinateOrganizationPageSize,
      this.subordinateOrganizationFormParams,
    );
  }

  visitNode(node: Organization, hashMap: { [id: string]: boolean }, array: Organization[]): void {
    this.organizationList.add(node);
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  loadOrganizationDataFromServer(): void {
    this.http.post('/api/backstage/organization/initOrganizationCasecade', null).subscribe((res) => {
      if (!res.success) return;
      this.organizationLoading = false;
      this.organizations = res.organizations;

      // 加载树方法
      this.organizations.forEach((item) => {
        this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
      });
    });
  }

  // =============================右上岗位列表部分=======================================

  setOfRolesCheckedId = new Set<string>();
  roleFormParams: RoleFormParams = {
    name: '',
  };
  roles: Role[] = [];
  roleLoading = true;
  checkedRole: Role | null = null;
  roleTotal = 1;
  rolePageSize = 5;
  rolePageIndex = 1;

  loadRoleDataFromServer(pageIndex: number, pageSize: number, formParams: RoleFormParams): void {
    this.roleLoading = true;
    if (!this.checkedOrganization) {
      this.roleLoading = false;
      return;
    }

    const params: {
      pageSize: number;
      currentPage: number;
      roleName: string;
      organizationId: string;
    } = {
      pageSize: pageSize,
      currentPage: pageIndex,
      roleName: formParams.name,
      organizationId: this.checkedOrganization.id,
    };

    this.http.post('/api/backstage/roleOrganization/getRolesByOrganization', null, params).subscribe((res) => {
      this.roleLoading = false;
      this.roles = res.roles;
      this.roleTotal = res.page.dataTotal;
    });
  }

  onRoleChecked(data: Role, checked: boolean): void {
    if (!checked) {
      this.setOfRolesCheckedId.clear();
      this.checkedRole = null;
      this.loadUsersFromServer(this.userPageIndex, this.userPageSize, this.userFormParams);
      return;
    }

    this.checkedRole = data;
    this.setOfRolesCheckedId.clear();
    this.setOfRolesCheckedId.add(data.id);
    this.loadUsersFromServer(this.userPageIndex, this.userPageSize, this.userFormParams);
  }

  addRoleOrganization(): void {
    let organizationId = this.checkedOrganization?.id;

    this.router.navigate(['/role-organization/detail'], {
      queryParams: {
        organizationId: organizationId,
      },
    });
  }

  deleteRoleOrganization(): void {
    if (!this.checkedRole) {
      this.msg.error('请选择要删除的岗位');
      return;
    }

    let organizationId = this.checkedOrganization?.id;
    let roleId = this.checkedRole.id;

    this.http
      .post('/api/backstage/roleOrganization/delete', null, {
        roleId: roleId,
        organizationId: organizationId,
      })
      .subscribe((res) => {
        if (!res.success) return;

        this.loadRoleDataFromServer(this.rolePageIndex, this.rolePageSize, this.roleFormParams);
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.loadRoleDataFromServer(pageIndex, pageSize, this.roleFormParams);
  }

  resetFormParams(): void {
    this.roleFormParams = {
      name: '',
    };
  }

  // =============================右下用户列表部分=======================================

  userChecked = false;
  userIndeterminate = false;
  userLoading = false;
  setOfUsersCheckedId = new Set<string>();
  userFormParams: UserFormParams = {
    displayName: '',
  };
  users: User[] = [];
  userTotal = 1;
  userPageSize = 5;
  userPageIndex = 1;

  loadUsersFromServer(pageIndex: number, pageSize: number, formParams: UserFormParams): void {
    this.userLoading = true;

    if (!this.checkedOrganization) {
      this.userLoading = false;
      return;
    }

    let checkRoleId = this.checkedRole ? this.checkedRole.id : '';

    const params = {
      pageSize: pageSize,
      currentPage: pageIndex,
      displayName: formParams.displayName,
      organizationId: this.checkedOrganization.id,
      roleId: checkRoleId,
    };

    this.http.post('/api/backstage/user', null, params).subscribe((res) => {
      this.userLoading = false;
      this.users = res.users;
      this.userTotal = res.page.dataTotal;
    });
  }

  userAddPage(): void {
    let checkedOrganizationId = this.checkedOrganization ? this.checkedOrganization.id : '';
    this.router.navigate(['/user/detail'], {
      queryParams: {
        checkedOrganizationId: checkedOrganizationId,
      },
    });
  }

  userUpdatePage(): void {
    let checkedId = this.setOfUsersCheckedId.values().next().value;
    let checkedOrganizationId = this.checkedOrganization ? this.checkedOrganization.id : '';

    if (!checkedId) {
      this.msg.error('请选择要修改的用户');
      return;
    }
    this.router.navigate(['/user/detail'], {
      queryParams: {
        userId: checkedId,
        checkedOrganizationId: checkedOrganizationId,
      },
    });
  }

  deleteUser(): void {
    let userIds: string[] = [];
    this.setOfUsersCheckedId.forEach((value) => userIds.push(value));
    if (userIds.length == 0) {
      this.msg.error('请选择要删除的用户');
      return;
    }

    this.http.post('/api/backstage/user/deleteUser', null, { userIds: userIds.toString() }).subscribe((res) => {
      if (!res.success) return;

      this.msg.info('删除成功');
      this.loadUsersFromServer(this.userPageIndex, this.userPageSize, this.userFormParams);
    });
  }

  userUpdateCheckedSet(id: string, checked: boolean): void {
    if (checked) this.setOfUsersCheckedId.add(id);
    else this.setOfUsersCheckedId.delete(id);
  }

  userOnAllChecked(checked: boolean): void {
    this.users.forEach(({ id }) => this.userUpdateCheckedSet(id, checked));
    this.userRefreshCheckedStatus();
  }

  userRefreshCheckedStatus(): void {
    const listOfEnabledData = this.users;
    this.userChecked = listOfEnabledData.every(({ id }) => this.setOfUsersCheckedId.has(id));
    this.userIndeterminate = listOfEnabledData.some(({ id }) => this.setOfUsersCheckedId.has(id)) && !this.userChecked;
  }

  userOnItemChecked(id: string, checked: boolean): void {
    this.userUpdateCheckedSet(id, checked);
    this.userRefreshCheckedStatus();
  }

  userOnQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.loadUsersFromServer(pageIndex, pageSize, this.userFormParams);
  }

  // 下级菜单部分
  subordinateOrganizationChecked = false;
  subordinateOrganizationIndeterminate = false;
  subordinateOrganizationLoading = false;
  setOfSubordinateOrganizationCheckedId = new Set<string>();
  subordinateOrganizationFormParams: SubordinateOrganizationFormParams = {
    name: '',
  };
  subordinateOrganizations: Organization[] = [];
  subordinateOrganizationTotal = 1;
  subordinateOrganizationPageSize = 5;
  subordinateOrganizationPageIndex = 1;

  // 获取下级组织
  loadSubordinateOrganizationFromServer(pageIndex: number, pageSize: number, formParams: SubordinateOrganizationFormParams): void {
    this.subordinateOrganizationLoading = true;
    if (!this.checkedOrganization) {
      this.subordinateOrganizationLoading = false;
      return;
    }

    const params = {
      pageSize: pageSize,
      currentPage: pageIndex,
      name: formParams.name,
      checkedOrganizationId: this.checkedOrganization.id,
    };

    this.http.post('/api/backstage/organization/getSubordinateOrganization', null, params).subscribe((res) => {
      this.subordinateOrganizationLoading = false;
      this.subordinateOrganizations = res.subordinateOrganizations;
      this.subordinateOrganizationTotal = res.page.dataTotal;
    });
  }

  organizationAddPage(): void {
    let checkedOrganizationId = this.checkedOrganization ? this.checkedOrganization.id : '';
    this.router.navigate(['/organization/detail'], {
      queryParams: {
        checkedOrganizationId: checkedOrganizationId,
      },
    });
  }

  organizationUpdatePage(): void {
    let checkedOrganizationId = this.checkedOrganization ? this.checkedOrganization.id : '';
    this.router.navigate(['/organization/detail'], {
      queryParams: {
        organizationId: checkedOrganizationId,
        checkedOrganizationId: checkedOrganizationId,
      },
    });
  }

  deleteOrganizations(): void {
    let organizationIds: string[] = [];
    this.setOfSubordinateOrganizationCheckedId.forEach((value) => organizationIds.push(value));
    if (organizationIds.length == 0) {
      this.msg.error('请选择要删除的用户');
      return;
    }

    this.http.post('/api/backstage/organization/delete', null, { organizationIds: organizationIds.toString() }).subscribe((res) => {
      if (!res.success) return;

      this.msg.info('删除成功');
      this.loadOrganizationDataFromServer();
      this.clickOrganization(this.organizationList.values().next().value);
    });
  }

  organizationListUpdatePage(): void {
    let checkedId = this.setOfSubordinateOrganizationCheckedId.values().next().value;
    let checkedOrganizationId = this.checkedOrganization ? this.checkedOrganization.id : '';
    if (!checkedOrganizationId) {
      this.msg.error('请选择需要修改的组织');
      return;
    }

    this.router.navigate(['/organization/detail'], {
      queryParams: {
        organizationId: checkedId,
        checkedOrganizationId: checkedOrganizationId,
      },
    });
  }

  subordinateOrganizationUpdateCheckedSet(id: string, checked: boolean): void {
    if (checked) this.setOfSubordinateOrganizationCheckedId.add(id);
    else this.setOfSubordinateOrganizationCheckedId.delete(id);
  }

  subordinateOrganizationOnAllChecked(checked: boolean): void {
    this.subordinateOrganizations.forEach(({ id }) => this.subordinateOrganizationUpdateCheckedSet(id, checked));
    this.subordinateOrganizationRefreshCheckedStatus();
  }

  subordinateOrganizationRefreshCheckedStatus(): void {
    const listOfEnabledData = this.subordinateOrganizations;
    this.subordinateOrganizationChecked = listOfEnabledData.every(({ id }) => this.setOfSubordinateOrganizationCheckedId.has(id));
    this.subordinateOrganizationIndeterminate =
      listOfEnabledData.some(({ id }) => this.setOfSubordinateOrganizationCheckedId.has(id)) && !this.subordinateOrganizationChecked;
  }

  subordinateOrganizationOnItemChecked(id: string, checked: boolean): void {
    this.subordinateOrganizationUpdateCheckedSet(id, checked);
    this.subordinateOrganizationRefreshCheckedStatus();
  }

  subordinateOrganizationOnQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.loadSubordinateOrganizationFromServer(pageIndex, pageSize, this.subordinateOrganizationFormParams);
  }
}
