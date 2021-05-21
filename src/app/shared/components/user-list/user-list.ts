import {Component, Input, Injector, OnInit, Output, EventEmitter} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Router } from '@angular/router';
import {NzMessageService} from "ng-zorro-antd/message";
import {User} from "../../../pojos/user/user";

interface FormParams {
  displayName: string;
  roleName: string;
}

@Component({
  selector: 'user-list',
  templateUrl: './user-list.html',
})
export class DataListComponent {
  @Input() headers: string[] = [];
  @Input() keys: string[] = [];
  @Input() url: string = '';
  @Input() requestDataName: string = '';
  @Input() checkedDatas: any[] = [];
  @Output() outer = new EventEmitter();
  @Input() singleSelect: boolean = false;

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  formParams: FormParams = {
    displayName: '',
    roleName: '',
  };
  datas: any[] = [];
  loading = true;
  total = 1;
  pageSize = 10;
  pageIndex = 1;
  executeDatas: any[] = [];

  loadDataFromServer(pageIndex: number, pageSize: number, formParams: FormParams): void {
    this.loading = true;

    const params = {
      pageSize: pageSize,
      currentPage: pageIndex,
      displayName: formParams.displayName,
      roleName: formParams.roleName
    }
    this.http.post(this.url, null, params).subscribe((res) => {
      this.loading = false;
      this.datas = res[this.requestDataName];

      console.log(this.checkedDatas);
      // 禁用已选择
      if (this.checkedDatas) {
        this.datas.forEach(value => value.disabled = this.checkedDatas.find(value1 => value1.id == value.id))
        this.checkedDatas.forEach(value => this.setOfCheckedId.add(value.id));
      }

      // this.datas = res1.get(this.requestDataName);
      this.total = res.page.dataTotal;
    });
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (this.singleSelect)
      this.setOfCheckedId.clear();

    if (checked)
      this.setOfCheckedId.add(id);

    this.passCheckedDataToFather();
  }

  onAllChecked(checked: boolean): void {
    if (this.singleSelect)
      return;

    this.datas.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.datas;
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: string, checked: boolean, disabled?: boolean): void {
    if (disabled)
      return;

    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  passCheckedDataToFather():void {
    this.executeDatas = this.datas.filter(value => this.setOfCheckedId.has(value.id));
    this.outer.emit(this.executeDatas);
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
