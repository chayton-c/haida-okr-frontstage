import { Component, Injector, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  ConstructionControlPlan,
  ConstructionControlPlanConstant,
} from '../../../pojos/construction-control-plan/construction-control-plan';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';

interface FormParams {
  displayName: string;
  roleName: string;
}
@Component({
  selector: 'app-construction-control-plan-approve',
  templateUrl: './approve.component.html',
})
export class ConstructionControlPlanApproveComponent implements OnInit {
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  formParams: FormParams = {
    displayName: '',
    roleName: '',
  };
  constructionControlPlans: ConstructionControlPlan[] = [];
  constructionConstrolPlanConstant: ConstructionControlPlanConstant = new ConstructionControlPlanConstant();
  loading = true;
  total = 1;
  pageSize = 5;
  pageIndex = 1;

  loadDataFromServer(pageIndex: number, pageSize: number, formParams: FormParams): void {
    this.loading = true;

    const params = {
      pageSize: pageSize,
      currentPage: pageIndex,
      displayName: formParams.displayName,
      roleName: formParams.roleName,
    };

    this.http.post('/api/backstage/constructionControlPlan/getList', null, params).subscribe((res) => {
      this.loading = false;
      this.constructionControlPlans = res.constructionControlPlans;
      this.total = res.page.dataTotal;
    });
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

  approvePlan(): void {
    let checkedId = this.setOfCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('请选择需要审核的预计划');
      return;
    }

    const params = {
      id: checkedId,
    };

    this.http.post('/api/backstage/constructionControlPlan/approve', null, params).subscribe((res) => {
      if (!res.success) return;

      this.msg.success(res.msg);
      let find = this.constructionControlPlans.find((value) => value.id == checkedId);
      if (find) find.approveStatus = this.constructionConstrolPlanConstant.APPROVED;
    });
  }

  previewPage(): void {
    let checkedId = this.setOfCheckedId.values().next().value;
    if (!checkedId) {
      this.msg.error('请选择需要查看的预计划');
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
    this.loadDataFromServer(pageIndex, pageSize, this.formParams);
  }

  constructor(public http: _HttpClient, public injector: Injector, public router: Router, public msg: NzMessageService) {}

  ngOnInit(): void {
    this.loadDataFromServer(this.pageIndex, this.pageSize, this.formParams);
  }
}
