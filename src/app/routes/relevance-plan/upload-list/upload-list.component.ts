import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { _HttpClient, MenuService, ModalHelper, TitleService } from '@delon/theme';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ConstructionControlPlan } from '../../../pojos/construction-control-plan/construction-control-plan';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { HttpClient, HttpEventType, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { UploadUtil } from '../../../shared/utils/upload-util';
import { ConstructionFormalPlan, ConstructionFormalPlanConstant } from '../../../pojos/construction-control-plan/construction-formal-plan';

interface FormParams {
  planCode: string;
  relevanceStatus: string;
}
@Component({
  selector: 'app-relevance-plan-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['../../construction-coordinate-plan/list.component.less'],
})
export class RelevancePlanUploadListComponent implements OnInit {
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  formParams: FormParams = {
    planCode: '',
    relevanceStatus: '',
  };
  constructionFormalPlans: ConstructionFormalPlan[] = [];
  constructionFormalPlanConstant: ConstructionFormalPlanConstant = new ConstructionFormalPlanConstant();
  loading = true;
  total = 1;
  pageSize = 5;
  pageIndex = 1;
  size: NzButtonSize = 'default';

  data: Array<{
    id: number;
    title: string;
    subDescription: string;
    href: string;
    logo: string;
    owner: string;
    createdAt: Date;
    percent: number;
    status: string;
  }> = [];

  loadDataFromServer(): void {
    this.loading = true;

    const params = {
      pageSize: this.pageSize,
      currentPage: this.pageIndex,
      planCode: this.formParams.planCode,
      relevanceStatus: this.formParams.relevanceStatus,
    };

    this.http.post('/api/backstage/constructionFormalPlan/getList', null, params).subscribe((res) => {
      this.loading = false;
      this.constructionFormalPlans = res.constructionFormalPlans;
      this.total = res.page.dataTotal;
    });
  }

  updateCheckedSet(id: string, checked: boolean): void {
    // this.setOfCheckedId.clear();
    if (checked) this.setOfCheckedId.add(id);
    else this.setOfCheckedId.delete(id);
  }

  onAllChecked(checked: boolean): void {
    this.constructionFormalPlans.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  delete() {
    let ids: string[] = [];
    this.setOfCheckedId.forEach((value) => ids.push(value));
    if (ids.length == 0) {
      this.msg.error('请选择要删除的正式计划');
      return;
    }

    this.http.post('/api/backstage/constructionFormalPlan/delete', null, { ids: ids.toString() }).subscribe((res) => {
      if (!res.success) return;
      this.msg.success('提交成功');
      this.loadDataFromServer();
    });
  }

  // 文件上传部分
  excels: NzUploadFile[] = [];

  beforeUpload = (file: NzUploadFile): boolean => {
    UploadUtil.uploadFile(file, '/api/backstage/constructionFormalPlan/importByExcel', this.naviveHttp, (resp) => {
      if (!resp.body.success) return;

      this.loadDataFromServer();
      this.msg.success(resp.body.msg);
    });
    return false;
  };
  // end of 文件上传部分

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.constructionFormalPlans;
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  previewPage(): void {
    let checkedId = this.setOfCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('请选择需要修改的预计划');
      return;
    }

    this.router.navigate(['/construction-control-plan/preview'], {
      queryParams: {
        constructionControlPlanId: checkedId,
      },
    });
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadDataFromServer();
  }

  constructor(
    public http: _HttpClient,
    public naviveHttp: HttpClient,
    public injector: Injector,
    public router: Router,
    public msg: NzMessageService,
    private menuService: MenuService,
    private modal: ModalHelper,
    private titleService: TitleService,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('导入计划');
    this.loadDataFromServer();
  }
}
