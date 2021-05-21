import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper, TitleService } from '@delon/theme';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ConstructionControlPlan } from '../../../pojos/construction-control-plan/construction-control-plan';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { WarnInfoConstant, WarningInfo } from '../../../pojos/construction-control-plan/warning-info';
import { DateUtils } from '../../../shared/utils/date-utils';

@Component({
  selector: 'app-operation-process-warning-information-list',
  templateUrl: './warning-information-list.component.html',
  styleUrls: ['../../construction-coordinate-plan/list.component.less'],
})
export class OperationProcessWarningInformationListComponent implements OnInit {
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  formParams: {
    warnLevel?: number;
    processStatus?: number;
    startTime?: Date;
    endTime?: Date;
  } = {};
  warnInfoConstant = new WarnInfoConstant();
  warningInfos: WarningInfo[] = [];
  loading = true;
  total = 1;
  pageSize = 5;
  pageIndex = 1;
  size: NzButtonSize = 'default';
  showProcess = false;

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
      warnLevelStr: this.formParams.warnLevel,
      processStatusStr: this.formParams.processStatus,
      startTime: this.formParams.startTime,
      endTime: this.formParams.endTime,
    };

    this.http.post('/api/backstage/warningInfo/getList', null, params).subscribe((res) => {
      this.loading = false;
      this.warningInfos = res.warningInfos;
      this.total = res.page.dataTotal;
    });
  }

  showProcessModal() {
    let checkedId = this.setOfCheckedId.values().next().value;

    if (!checkedId) {
      this.msg.error('请选择要处理的预警');
      return;
    }

    if (this.warningInfos.filter((x) => x.id == checkedId && x.processStatus == this.warnInfoConstant.NOT_PROCESSED).length <= 0) {
      this.msg.error('该方案已处理');
      return;
    }

    this.showProcess = true;
  }

  processWarningBySendSms() {
    let checkedId = this.setOfCheckedId.values().next().value;

    if (!checkedId) {
      this.msg.error('请选择要处理的预警');
      return;
    }

    if (this.warningInfos.filter((x) => x.processStatus == this.warnInfoConstant.NOT_PROCESSED).length <= 0) {
      this.msg.error('该方案已处理');
      return;
    }

    this.http.post('/api/backstage/warningInfo/processWarningBySendSms', null, { id: checkedId }).subscribe((res) => {
      if (!res.success) return;
      this.msg.success('提交成功');
      this.showProcess = false;
      this.loadDataFromServer();
    });
  }

  processWarningByDoNothing() {
    let checkedId = this.setOfCheckedId.values().next().value;

    if (!checkedId) {
      this.msg.error('请选择要处理的预警');
      return;
    }

    if (this.warningInfos.filter((x) => x.processStatus == this.warnInfoConstant.NOT_PROCESSED).length <= 0) {
      this.msg.error('该方案已处理');
      return;
    }

    this.http.post('/api/backstage/warningInfo/processWarningByDoNothing', null, { id: checkedId }).subscribe((res) => {
      if (!res.success) return;
      this.msg.success('提交成功');
      this.showProcess = false;
      this.loadDataFromServer();
    });
  }

  updateCheckedSet(id: string, checked: boolean): void {
    this.setOfCheckedId.clear();
    if (checked) this.setOfCheckedId.add(id);
  }

  onAllChecked(checked: boolean): void {
    this.warningInfos.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.warningInfos;
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  uploadSuccess(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} 上传成功`);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} 上传失败.`);
    }
  }

  issuePlanJson(): void {
    const a = document.createElement('a'); // 创建a标签
    document.body.appendChild(a); // 向body里面添加a标签
    a.setAttribute('style', 'display:none'); // a 标签样式隐藏
    a.setAttribute('href', '/api/test/nagato'); // 拼接url，（ a标签里面的href属性）
    a.setAttribute('download', 'template.json'); // 设置a标签的属性为download  template.xlsx 默认下载的文件名为template 格式是xlsx
    a.click(); // 点击a标签
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
    public activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('预警信息');
    this.loadDataFromServer();
    // 根据路由带参设置查询条件
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.processStatus) this.formParams.processStatus = Number(queryParams.processStatus);
      if (queryParams.warnLevel) this.formParams.warnLevel = Number(queryParams.warnLevel);
      if (queryParams.totalType) {
        this.formParams.endTime = new Date();
        if (queryParams.totalType == 'nowYear') {
          this.formParams.startTime = DateUtils.getNowYear();
        } else if (queryParams.totalType == 'nowMonth') {
          this.formParams.startTime = DateUtils.getNowMonth();
        }
      }
    });
  }

  // 施工计划范围预览模态框部分
  showControlPlanMapFunction(id: string) {
    this.router.navigate(['/construction-control-plan/preview'], {
      queryParams: {
        constructionControlPlanId: id,
        parentUrl: '/operation-process/warning-information-list',
        parentName: '预警信息',
      },
    });
  }
}
