import {ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import {NzCascaderOption} from "ng-zorro-antd/cascader/typings";
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {OpcMarkImage} from '../../../../pojos/opc/opc-mark-image';
import {User} from '../../../../pojos/user/user';
import {StringUtils} from "../../../utils/string-utils";

@Component({
  selector: 'opc-mark-images-table',
  templateUrl: './opc-mark-images-table.html',
})
export class OpcMarkImagesTable {
  // 图片列表模态框部分
  isVisible = false;
  showModal(): void {
    this.isVisible = true;
    this.loadDataFromServer();
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  @Input() opcMarkId!: string;
  opcMarkImages: OpcMarkImage[] = [];

  loadDataFromServer(): void {

    const params = {
      opcMarkId: this.opcMarkId,
    };

    this.http.post('/api/backstage/opcMarkImage/getList', null, params).subscribe((res) => {
      this.opcMarkImages = res.opcMarkImages;
    });
  }

  constructor(public http: _HttpClient, public injector: Injector, public router: Router, public msg: NzMessageService) {}

  ngOnInit(): void {
    this.loadDataFromServer();
  }

  // 图片详情模态框部分
  // 图片列表模态框部分
  checkedImage?: OpcMarkImage;
  imageDetailVisible = false;
  imageDetailShowModal(checkedImage: OpcMarkImage): void {
    this.checkedImage = checkedImage;
    this.imageDetailVisible = true;
  }

  imageDetailHandleOk(): void {
    this.imageDetailVisible = false;
  }

  imageDetailHandleCancel(): void {
    this.imageDetailVisible = false;
  }
}
