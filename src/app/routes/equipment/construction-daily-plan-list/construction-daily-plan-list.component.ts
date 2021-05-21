import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper, TitleService } from '@delon/theme';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import {ActivatedRoute, Router} from '@angular/router';
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
  name: string;
}
@Component({
  selector: 'app-equipment-construction-daily-plan-list',
  templateUrl: './construction-daily-plan-list.component.html',
})
export class EquipmentConstructionDailyPlanListComponent implements OnInit {
  checked = false;
  setOfCheckedId = new Set<string>();
  constructionDailyPlanId = '';
  equipmentConstant: EquipmentConstant = new EquipmentConstant();
  equipments: Equipment[] = [];
  using = false;
  workshops: Organization[] = [];
  loading = true;
  total = 1;
  pageSize = 5;
  pageIndex = 1;
  formParams: FormParams = {
    name: '',
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
      name: this.formParams.name,
      constructionDailyPlanId: this.constructionDailyPlanId,
    };

    this.http.post('/api/backstage/equipment/getListByConstructionDailyPlan', null, params).subscribe((res) => {
      this.loading = false;
      this.equipments = res.equipments;
      this.workshops = res.workshops;
      this.total = res.page.dataTotal;
      console.log(79)
    });
  }

  navigateToDailyPlanList(): void {
    this.router.navigate(["/operation-process/date-plan-list"]);
  }

  executeEquipmentSwitch(equipment: Equipment) {
    const requestParams = {equipmentId: equipment.id, constructionDailyPlanId: this.constructionDailyPlanId};

    if (equipment.using) {
      this.http.post('/api/backstage/constructionDailyPlan/removeEquipment', null, requestParams).subscribe((res) => {
        this.loading = false;
        equipment.using = false;
      });
    } else {
      this.http.post('/api/backstage/constructionDailyPlan/addEquipment', null, requestParams).subscribe((res) => {
        this.loading = false;
        equipment.using = true;
      });
    }
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
    private activatedRoute: ActivatedRoute,
    private modal: ModalHelper,
    private cdr: ChangeDetectorRef,
    private titleService: TitleService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.constructionDailyPlanId) this.constructionDailyPlanId = queryParams.constructionDailyPlanId;
    });

    this.titleService.setTitle('设备列表');
    this.loadDataFromServer();
  }

  _onReuseInit(type?: ReuseHookOnReuseInitType): void {
    // this.titleService.setTitle('设备列表');
    // this.loadDataFromServer();
  }
}

