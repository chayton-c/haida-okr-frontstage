import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { _HttpClient} from '@delon/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {TransferService} from "./transfer.service";
import {MeasurementTemplate} from "../../../pojos/measurement-template/measurement-template";
import {Observable, Observer} from "rxjs";


export interface RepairClass {
  type: number,
  name: string
}

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css'],
})
export class Step1Component implements OnInit {
  typeDevice = MeasurementTemplate.DEVICE;
  typeStation = MeasurementTemplate.STATION;

  validateForm: FormGroup;
  repairClasses: Array<RepairClass> = [];
  deviceTypeIdOrDeviceSubTypeId = '';
  stationId = '';
  loading = false;

  measurementTemplate: MeasurementTemplate = {
    id: '',
    name: '',
    deviceTypeId: '',
    deviceTypeName: '',
    deviceSubTypeId: '',
    deviceSubTypeName: '',
    stationId: '',
    stationName: '',
    description: '',
    remark: '',
    repairClass: -1,
    type: -1,
  };

  get item(): TransferService {
    return this.srv;
  }

  execute() {
    if (this.measurementTemplate == null)
      return;

    const params = {
      id: this.measurementTemplate.id,
      name: this.measurementTemplate.name,
      deviceTypeId: this.measurementTemplate.deviceTypeId,
      deviceSubTypeId: this.measurementTemplate.deviceSubTypeId,
      stationId: this.measurementTemplate.stationId,
      description: this.measurementTemplate.description,
      remark: this.measurementTemplate.remark,
      repairClass: this.measurementTemplate.repairClass,
      type: this.measurementTemplate.type,
    };
    this.http.post('/api/backstage/measurementTemplate/saveOrUpdate', null, params).subscribe((res) => {
      if (!res.success) return;

      this.measurementTemplate = res.measurementTemplate;
      this.item.measurementTemplateId = this.measurementTemplate.id;
      this.msg.success(res.msg);
      ++this.item.step;
    });
  }

  loadDataFromServer(): void {
    this.http
      .post('/api/backstage/measurementTemplate/info', null, {
        id: this.measurementTemplate.id,
        type: this.measurementTemplate.type,
        deviceTypeIdOrDeviceSubTypeId: this.deviceTypeIdOrDeviceSubTypeId,
        stationId: this.stationId
      })
      .subscribe((res) => {
        if (!res.success) return;
        this.loading = false;
        if (res.deviceSubTypeName) this.measurementTemplate.deviceSubTypeName = res.deviceSubTypeName;
        if (res.deviceTypeName) this.measurementTemplate.deviceTypeName = res.deviceTypeName;
        if (res.measurementTemplate.id) this.measurementTemplate = res.measurementTemplate;
        if (res.repairClasses) this.repairClasses = res.repairClasses;

        this.measurementTemplate.deviceSubTypeName = res.measurementTemplate.deviceSubTypeName;
        this.measurementTemplate.deviceTypeName = res.measurementTemplate.deviceTypeName;
        this.measurementTemplate.deviceTypeId = res.measurementTemplate.deviceTypeId;
        this.measurementTemplate.deviceSubTypeId = res.measurementTemplate.deviceSubTypeId;
        this.measurementTemplate.stationId = res.measurementTemplate.stationId;
        this.measurementTemplate.stationName = res.measurementTemplate.stationName;

        this.validateForm.controls.deviceSubTypeName.disable();
        this.validateForm.controls.deviceTypeName.disable();

        console.log(res.repairClasses);
      });
  }

  constructor(
    public http: _HttpClient,
    private activatedRoute: ActivatedRoute,
    private msg: NzMessageService,
    private router: Router,
    private fb: FormBuilder,
    private srv: TransferService)
  {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      deviceTypeName: [''],
      deviceSubTypeName: [''],
      stationName: [''],
      description: [''],
      remark: [''],
      repairClass: [''],
      type: [''],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.measurementTemplateId)
        this.measurementTemplate.id = queryParams.measurementTemplateId;
      else
        this.measurementTemplate.id = this.item.measurementTemplateId;

      if (queryParams.type) this.measurementTemplate.type = queryParams.type;
      if (queryParams.deviceTypeIdOrDeviceSubTypeId) this.deviceTypeIdOrDeviceSubTypeId = queryParams.deviceTypeIdOrDeviceSubTypeId;
      if (queryParams.stationId) this.stationId = queryParams.stationId;
    });
    console.log(this.measurementTemplate.id)
    // 加载菜单信息
    this.loadDataFromServer();
  }
}
