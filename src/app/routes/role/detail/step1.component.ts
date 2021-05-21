import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {ActivatedRoute, Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from "rxjs";
import {Role} from "../../../pojos/auth/role/role";
import {Menu} from "../../../pojos/auth/menu/menu";
import {TransferService} from "./transfer.service";


export interface RepairClass {
  type: number;
  name: string;
}

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css'],
})
export class Step1Component implements OnInit {
  get item(): TransferService {
    return this.srv;
  }

  validateForm: FormGroup;
  role: Role = {
    id: '',
    name: '',
    description: '',
  };
  loading = false;
  menus: Menu[] = [];
  mapOfExpandedData: { [key: string]: Menu[] } = {};

  // ----表单部分
  // 验证岗位名是否重复
  roleNameValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        this.http.post('/api/role/checkRole', null, {name: this.role.name, id: this.role.id}).subscribe((res) => {
          if (!res.success) observer.next({error: true, duplicated: true});
          else observer.next(null);
          observer.complete();
        });
      }, 10);
    });

  // 提交岗位信息
  executeRoleInfo() {
    const params = {
      id: this.role.id,
      name: this.role.name,
      organizationPermission: this.role.organizationPermission,
      description: this.role.description,
    };
    this.http.post('/api/role/updateRole', null, params).subscribe((res) => {
      if (!res.success) return;

      this.role = res.role;
      this.msg.success(res.msg);
      this.item.id = this.role.id;
      this.item.step++;
    });
  }

  loadDataFromServer(): void {
    this.http
      .post('/api/auth/authList', null, {
        roleId: this.role.id,
      })
      .subscribe((res) => {
        if (!res.success) return;
        this.loading = false;
        if (res.role.id) {
          this.role = res.role;
        }
        if (res.role.organizationPermission) this.role.organizationPermission = res.role.organizationPermission;
      });
  }

  constructor(
    public http: _HttpClient,
    private activatedRoute: ActivatedRoute,
    private msg: NzMessageService,
    private router: Router,
    private fb: FormBuilder,
    private srv: TransferService,
  ) {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      organizationPermission: ['', [Validators.required]],
      default: [''],
    });
  }

  ngOnInit(): void {
    // 获取roleId
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.id) this.role.id = queryParams.id;
    });
    // 加载菜单信息
    this.loadDataFromServer();
  }
}
