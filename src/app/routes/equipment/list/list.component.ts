import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper, TitleService } from '@delon/theme';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User } from '../../../pojos/user/user';
import {
  ConstructionControlPlan,
  ConstructionControlPlanConstant,
} from '../../../pojos/construction-control-plan/construction-control-plan';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { ProBasicListEditComponent } from '../../pro/list/basic-list/edit/edit.component';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import {DateUtils} from "../../../shared/utils/date-utils";
import {Equipment, EquipmentConstant} from "../../../pojos/equipment/equipment";
import {OnReuseInit, ReuseHookOnReuseInitType} from "@delon/abc/reuse-tab";
import {Organization} from "../../../pojos/organization/organization";

interface FormParams {
  workshopId?: string;
  nameOrCode: string;
}
@Component({
  selector: 'app-equipment-list',
  templateUrl: './list.component.html',
})
export class EquipmentListComponent implements OnInit, OnReuseInit {
  checked = false;
  setOfCheckedId = new Set<string>();
  equipmentConstant: EquipmentConstant = new EquipmentConstant();
  equipments: Equipment[] = [];
  workshops: Organization[] = [];
  loading = true;
  total = 1;
  pageSize = 5;
  pageIndex = 1;
  formParams: FormParams = {
    nameOrCode: '',
  };

  addPage() {
    this.router.navigate(["/equipment/info"]);
  }

  updatePage() {
    let checkedId = this.setOfCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('请选择需要修改的设备');
      return;
    }

    this.router.navigate(["/equipment/info"], {
      queryParams: {
        id: checkedId
      },
    });
  }

  //列表查询
  loadDataFromServer(): void {
    this.loading = true;

    const params = {
      pageSize: this.pageSize,
      currentPage: this.pageIndex,
      workshopId: this.formParams.workshopId,
      nameOrCode: this.formParams.nameOrCode,
    };

    this.http.post('/api/backstage/equipment/getList', null, params).subscribe((res) => {
      this.loading = false;
      this.equipments = res.equipments;
      this.workshops = res.workshops;
      console.log(this.workshops);
      this.total = res.page.dataTotal;
    });
  }

  updateCheckedSet(id: string, checked: boolean): void {
    this.setOfCheckedId.clear();

    if (checked) this.setOfCheckedId.add(id);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.setOfCheckedId.clear();
    const { pageSize, pageIndex } = params;

    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.loadDataFromServer();
  }

  constructor(
    public http: _HttpClient,
    public injector: Injector,
    public router: Router,
    public msg: NzMessageService,
    private modal: ModalHelper,
    private cdr: ChangeDetectorRef,
    private titleService: TitleService,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('设备列表');
    this.loadDataFromServer();
  }

  _onReuseInit(type?: ReuseHookOnReuseInitType): void {
    this.loadDataFromServer();
  }
}

