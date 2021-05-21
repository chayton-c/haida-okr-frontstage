import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  ConstructionCoordinatePlanUpload,
  ConstructionCoordinatePlanUploadConstant,
} from '../../../pojos/upload-image/ConstructionCoordinatePlanUpload';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { UploadUtil } from '../../utils/upload-util';
import { HttpClient } from '@angular/common/http';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import {ConstructionControlPlan, ConstructionControlPlanConstant} from "../../../pojos/construction-control-plan/construction-control-plan";

interface FormParams {
  startValue?: Date;
  endValue?: Date;
}

@Component({
  selector: 'upload-image-list',
  templateUrl: './upload-image-list.html',
})
export class UploadImageList implements OnInit {
  @Input() checkedDatas: any[] = [];
  @Output() outer = new EventEmitter();
  @Input() constructionControlPlanId?: string;
  @Input() uploadFileType?: number;

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  formParams: FormParams = {};
  constructionCoordinatePlanUploads: ConstructionCoordinatePlanUpload[] = [];
  constructionControlPlan: ConstructionControlPlan = {
    approveStatus: 0,
    code: "",
    finishStatus: 0,
    id: "",
    influenceArea: "",
    name: "",
    signInStationId: "",
    warnStatus: 0,
    workInfo: ""
  };
  constructionConstrolPlanConstant: ConstructionControlPlanConstant = new ConstructionControlPlanConstant();
  loading = true;
  total = 1;
  pageSize = 5;
  pageIndex = 1;
  executeDatas: any[] = [];

  //上传文件请求路径
  uploadUrlCooperativeScheme: any;
  uploadUrlSafetyProtocol: any;

  //常量
  constructionCoordinatePlanUploadConstant: ConstructionCoordinatePlanUploadConstant = new ConstructionCoordinatePlanUploadConstant();

  //日期时间范围
  startValue: Date | null = null;
  endValue: Date | null = null;
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) return false;
    return startValue.getTime() > this.endValue.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) return false;
    return endValue.getTime() <= this.startValue.getTime();
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) this.endDatePicker.open();
  }

  handleEndOpenChange(open: boolean): void {
  }
  //日期时间范围

  loadDataFromServer(pageIndex: number, pageSize: number): void {
    //formParams: FormParams
    this.loading = true;

    const params = {
      pageSize: pageSize,
      currentPage: pageIndex,
      constructionControlPlanId: this.constructionControlPlanId,
      // startTime: this.formParams.startValue,
      // endTime : this.formParams.endValue,
    };

    this.http.post('/api/backstage/constructionCoordinatePlanUpload/getList', null, params).subscribe((res) => {
      this.loading = false;
      this.constructionCoordinatePlanUploads = res.constructionCoordinatePlanUploads;
      this.constructionControlPlan = res.constructionControlPlan;

      this.total = res.page.dataTotal;
    });
  }

  // 文件上传部分
  excels: NzUploadFile[] = [];

  //上传配合方案
  cooperativeSchemeBeforeUpload = (file: NzUploadFile): boolean => {
    UploadUtil.uploadFile(
      file,
      '/api/backstage/constructionCoordinatePlanUpload/uploadCooperativeSchemeFile?id=' + this.constructionControlPlanId,
      this.naviveHttp,
      (resp) => {
        if (!resp.body.success) return;
        this.msg.success(resp.body.msg);
        this.loadDataFromServer(this.pageIndex, this.pageSize);
      },
    );
    return false;
  };

  //上传安全协议
  safetyProtocolBeforeUpload = (file: NzUploadFile): boolean => {
    UploadUtil.uploadFile(
      file,
      '/api/backstage/constructionCoordinatePlanUpload/uploadSafetyProtocol?id=' + this.constructionControlPlanId,
      this.naviveHttp,
      (resp) => {
        if (!resp.body.success) return;
        this.msg.success(resp.body.msg);
        this.loadDataFromServer(this.pageIndex, this.pageSize);
      },
    );
    return false;
  };

  deleteFile(id: string): void {
    this.http.post('/api/backstage/constructionCoordinatePlanUpload/delete', null, { id: id }).subscribe((res) => {
      if (!res.success) return;
      this.msg.success(res.msg);
      this.loadDataFromServer(this.pageIndex, this.pageSize);
    });
  }

  updateCheckedSet(id: string, checked: boolean): void {
    this.setOfCheckedId.clear();

    if (!checked) return;

    this.setOfCheckedId.add(id);
    this.uploadUrlCooperativeScheme = '/api/backstage/constructionCoordinatePlanUpload/uploadCooperativeSchemeFile?id=' + id;
    this.uploadUrlSafetyProtocol = '/api/backstage/constructionCoordinatePlanUpload/uploadCooperativeSchemeFile?id=' + id;
  }

  onAllChecked(checked: boolean): void {
    this.constructionCoordinatePlanUploads.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.constructionCoordinatePlanUploads;
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.loadDataFromServer(pageIndex, pageSize);
  }

  rowChecked(id: string) {
    const checked = this.setOfCheckedId.has(id);
    this.onItemChecked(id, !checked);
  }

  constructor(
    private msg: NzMessageService,
    public http: _HttpClient,
    public naviveHttp: HttpClient,
    public injector: Injector,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.loadDataFromServer(this.pageIndex, this.pageSize);
  }

  passCheckedDataToFather(): void {
    this.executeDatas = this.constructionCoordinatePlanUploads.filter((value) => this.setOfCheckedId.has(value.id));
    this.outer.emit(this.executeDatas);
  }
}
