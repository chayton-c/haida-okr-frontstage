import {AfterViewInit, ChangeDetectionStrategy, Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { TransferService } from './transfer.service';
import {Role} from "../../../pojos/auth/role/role";
import {Menu} from "../../../pojos/auth/menu/menu";
import {_HttpClient} from "@delon/theme";
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {Permission} from "../../../pojos/auth/permission/permission";

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit {
  get item(): TransferService {
    return this.srv;
  }
  loading = false;
  role: Role = {
    id: '',
    name: '',
    organizationPermission: 0,
    description: '',
  };
  menus: Menu[] = [];
  mapOfExpandedData: Map<string, Menu[]> = new Map<string, Menu[]>();

  // ----表单部分
  // 验证岗位名是否重复

  backToList() {
    this.router.navigate(['/role/list']);
  }

  backToPreviousStep() {
    this.item.step--;
  }

  // ---树形菜单部分

  // 增加/移除授权
  executeAuthSwitch(menu: Menu) {
    menu.hasAuth = !menu.hasAuth;
    if (this.role.id == '') {
      this.msg.error('请在提交岗位信息后配置权限');
      menu.hasAuth = !menu.hasAuth;
      return;
    }

    const params = {
      roleId: this.role.id,
      menuId: menu.id,
      hasAuth: menu.hasAuth,
    };

    this.http.post('/api/auth/updateAuth', null, params).subscribe((res) => {
      if (!res.success) {
        menu.hasAuth = !menu.hasAuth;
        return;
      }

      this.msg.success(res.msg);
    });
  }

  executePermissionSwitch(permission: Permission) {
    permission.hasAuth = !permission.hasAuth;
    if (this.role.id == '') {
      this.msg.error('请在提交岗位信息后配置权限');
      permission.hasAuth = !permission.hasAuth;
      return;
    }

    const params = {
      roleId: this.role.id,
      permissionId: permission.id,
      hasAuth: permission.hasAuth,
    };

    this.http.post('/api/auth/togglePermissionAuth', null, params).subscribe((res) => {
      if (!res.success) {
        permission.hasAuth = !permission.hasAuth;
        return;
      }

      this.msg.success(res.msg);
    });
  }

  collapse(array: Menu[], data: Menu, $event: boolean): void {
    console.log(67);
    if ($event) return;

    if (!data.children) return;

    data.children.forEach((d) => {
      const target = array.find((a) => a.id === d.id)!;
      target.expand = false;
      this.collapse(array, target, false);
    });
    console.log(data.children);
  }

  convertTreeToList(root: Menu): Menu[] {
    const stack: Menu[] = [];
    const array: Menu[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: true });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children && node.children.length == 0) node.children = undefined;
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: true, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: Menu, hashMap: { [key: string]: boolean }, array: Menu[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  loadDataFromServer(): void {
    this.loading = false;
    this.http
      .post('/api/auth/authList', null, {
        roleId: this.role.id,
      })
      .subscribe((res) => {
        if (!res.success) return;
        this.loading = false;
        if (res.role.id) this.role = res.role;
        if (res.role.organizationPermission) this.role.organizationPermission = res.role.organizationPermission;
        this.menus = res.menuTree;
        console.log(this.menus);

        // 加载树方法
        this.menus.forEach((item) => {
          this.mapOfExpandedData.set(item.key, this.convertTreeToList(item))
        });
      });
  }

  constructor(
    public http: _HttpClient,
    private activatedRoute: ActivatedRoute,
    private msg: NzMessageService,
    private router: Router,
    private fb: FormBuilder,
    private srv: TransferService,
    private _nzZone:NgZone
  ) {
  }

  ngOnInit(): void {
    this.item.step = 1;
    this.loading = true;
    // 获取roleId
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.id) this.role.id = queryParams.id;
      if (this.item.id) this.role.id = this.item.id;
    });
    // 加载菜单信息
    this.loadDataFromServer();
  }
}
