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
import { ConstructionCoordinatePlanDetailComponent } from '../detail/detail.component';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import {DateUtils} from "../../../shared/utils/date-utils";

interface FormParams {
  processStatus?: number;
  codeOrConstructionProjectInfo: string;
  startTime?: Date;
  endTime?: Date;
}
@Component({
  selector: 'app-construction-control-plan-list',
  templateUrl: './list.component.html',
  styleUrls: ['../list.component.less'],
})
export class ConstructionCoordinatePlanListComponent implements OnInit {
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  constructionConstrolPlanConstant: ConstructionControlPlanConstant = new ConstructionControlPlanConstant();
  constructionControlPlans: ConstructionControlPlan[] = [];
  loading = true;
  total = 1;
  pageSize = 5;
  pageIndex = 1;
  formParams: FormParams = {
    processStatus: this.constructionConstrolPlanConstant.PENDING_RELEVANCE,
    codeOrConstructionProjectInfo: '',
  };

  //起止日期框设置
  startTime: Date | null = DateUtils.getTodayTime000000();
  endTime: Date | null = null;
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  disabledStartDate = (startTime: Date): boolean => {
    if (!startTime || !this.endTime) return false;
    return startTime.getTime() > this.endTime.getTime();
  };

  disabledEndDate = (endTime: Date): boolean => {
    if (!endTime || !this.startTime) return false;
    return endTime.getTime() <= this.startTime.getTime();
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) this.endDatePicker.open();
  }

  //列表查询
  loadDataFromServer(pageIndex: number, pageSize: number, formParams: FormParams): void {
    this.loading = true;

    const params = {
      pageSize: pageSize,
      currentPage: pageIndex,
      processStatusStr: formParams.processStatus,
      codeOrConstructionProjectInfo: formParams.codeOrConstructionProjectInfo,
      startTime: this.startTime,
      endTime: this.endTime,
    };

    this.http.post('/api/backstage/constructionControlPlan/getList', null, params).subscribe((res) => {
      this.loading = false;
      this.constructionControlPlans = res.constructionControlPlans;
      this.total = res.page.dataTotal;
    });
  }

  consoleValue(value: any): void {
    console.log('日期框输出');
    console.log(value);
  }
  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) this.setOfCheckedId.add(id);
    else this.setOfCheckedId.delete(id);
  }

  onAllChecked(checked: boolean): void {
    this.constructionControlPlans.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.constructionControlPlans;
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
    this.setOfCheckedId.clear();
    const { pageSize, pageIndex } = params;
    this.loadDataFromServer(pageIndex, pageSize, this.formParams);
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
    this.titleService.setTitle('方案管控');
    this.loadDataFromServer(this.pageIndex, this.pageSize, this.formParams);
  }
}
