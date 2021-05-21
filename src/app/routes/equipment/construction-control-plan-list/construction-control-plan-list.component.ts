import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {_HttpClient, ModalHelper, TitleService} from '@delon/theme';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {ActivatedRoute, Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Equipment, EquipmentConstant} from "../../../pojos/equipment/equipment";
import {ReuseHookOnReuseInitType} from "@delon/abc/reuse-tab";
import {Organization} from "../../../pojos/organization/organization";

@Component({
  selector: 'app-equipment-construction-control-plan-list',
  templateUrl: './construction-control-plan-list.component.html',
})
export class EquipmentConstructionControlPlanListComponent implements OnInit {
  checked = false;
  setOfCheckedId = new Set<string>();
  constructionControlPlanId = '';
  equipmentConstant: EquipmentConstant = new EquipmentConstant();
  equipments: Equipment[] = [];
  using = false;
  workshops: Organization[] = [];
  loading = true;
  total = 1;
  pageSize = 5;
  pageIndex = 1;
  formParams: {
    workshopId?: string;
    name: string;
  } = {
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
      constructionControlPlanId: this.constructionControlPlanId,
    };

    this.http.post('/api/backstage/equipment/getListByConstructionControlPlan', null, params).subscribe((res) => {
      this.loading = false;
      this.equipments = res.equipments;
      this.workshops = res.workshops;
      this.total = res.page.dataTotal;
      console.log(79)
    });
  }

  updateEquipmentInfluenceRadius(equipment: Equipment) {
    if (!equipment.using) return;
    const params = {
      equipmentId: equipment.id,
      constructionControlPlanId: this.constructionControlPlanId,
      influenceRadius: equipment.influenceRadius
    };

    this.http.post('/api/backstage/constructionConstrolPlanEquipment/updateEquipmentInfluenceRadius', null, params).subscribe((res) => {
      this.msg.success("提交成功");
    });
  }

  navigateToPlanList(): void {
    this.router.navigate(["/construction-control-plan/list"], {
      queryParams: {
        approvePlanId: this.constructionControlPlanId
      },
    });
  }

  executeEquipmentSwitch(equipment: Equipment) {
    const params = {
      equipmentId: equipment.id,
      constructionControlPlanId: this.constructionControlPlanId,
      influenceRadius: equipment.influenceRadius
    };

    if (equipment.using) {
      this.http.post('/api/backstage/constructionConstrolPlanEquipment/removeEquipment', null, params).subscribe((res) => {
        this.loading = false;
        equipment.using = false;
      });
    } else {
      this.http.post('/api/backstage/constructionConstrolPlanEquipment/addEquipment', null, params).subscribe((res) => {
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
    const {pageSize, pageIndex} = params;

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
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.constructionControlPlanId) this.constructionControlPlanId = queryParams.constructionControlPlanId;
    });

    this.titleService.setTitle('设备列表');
    this.loadDataFromServer();
  }

  _onReuseInit(type?: ReuseHookOnReuseInitType): void {
    // this.titleService.setTitle('设备列表');
    // this.loadDataFromServer();
  }
}
