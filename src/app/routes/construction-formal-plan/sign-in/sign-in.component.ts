import { Component, Injector, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User } from '../../../pojos/user/user';
import { ConstructionControlPlan } from '../../../pojos/construction-control-plan/construction-control-plan';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';

interface FormParams {
  nameOrCode: string;
}
@Component({
  selector: 'app-construction-formal-plan-sign-in',
  templateUrl: './sign-in.component.html',
})
export class ConstructionFormalPlanSignInComponent implements OnInit {
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  formParams: FormParams = {
    nameOrCode: '',
  };
  constructionControlPlans: ConstructionControlPlan[] = [];
  loading = true;
  total = 1;
  pageSize = 5;
  pageIndex = 1;

  loadDataFromServer(): void {
    this.loading = true;

    const params = {
      pageSize: this.pageSize,
      currentPage: this.pageIndex,
      nameOrCode: this.formParams.nameOrCode,
    };

    this.http.post('/api/backstage/constructionControlPlan/getList', null, params).subscribe((res) => {
      this.loading = false;
      this.constructionControlPlans = res.constructionControlPlans;
      this.total = res.page.dataTotal;
    });
  }

  updateCheckedSet(id: string, checked: boolean): void {
    this.setOfCheckedId.clear();
    if (checked) this.setOfCheckedId.add(id);
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

  signIn(): void {
    let checkedId = this.setOfCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('请选择需要签入的预计划');
      return;
    }

    const params = {
      id: checkedId,
    };

    this.http.post('/api/backstage/constructionControlPlan/signIn', null, params).subscribe((res) => {
      if (res.success) this.loadDataFromServer();
    });
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
    this.loadDataFromServer();
  }

  constructor(public http: _HttpClient, public injector: Injector, public router: Router, public msg: NzMessageService) {}

  ngOnInit(): void {
    this.loadDataFromServer();
  }
}
