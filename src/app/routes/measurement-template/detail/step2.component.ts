import {ChangeDetectionStrategy, Component, Injector, OnInit} from '@angular/core';
import {TransferService} from './transfer.service';
import {UtilComponent} from "../../delon/util/util.component";
import {ActivatedRoute, Router} from "@angular/router";
import {MeasurementItemField} from "../../../pojos/measurement-item-field/measurement-item-field";
import {_HttpClient} from "@delon/theme";
import {MeasurementUnit} from "../../../pojos/measurement-unit/measurement-unit";
import {CacheService} from "@delon/cache";
import {NzMessageService} from "ng-zorro-antd/message";
import {MeasurementTemplate} from "../../../pojos/measurement-template/measurement-template";

interface MeasurementItemFieldEditable extends MeasurementItemField {
  persistent?: boolean; // 持久状态(已插入到数据库的)
}

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styles: [
      `
      .save {
        margin-right: 8px;
      }
    `
  ]
})
export class Step2Component implements OnInit {
  typeDevice = MeasurementTemplate.DEVICE;
  typeStation = MeasurementTemplate.STATION;
  type: number = -1;

  // 可编辑列表部分
  editCache: { [key: string]: { edit: boolean; data: MeasurementItemFieldEditable } } = {};
  loading: boolean = false;
  measurementTemplateId: string = '';
  measurementItemFields: MeasurementItemFieldEditable[] = [];
  measurementUnits: MeasurementUnit[] = [];
  measurementTemplate: MeasurementTemplate = {
    id: '',
    name: '',
    description: '',
    remark: '',
  };
  pageSize = 10;
  pageIndex = 1;
  total = 1;

  // 分布表单部分
  get item(): TransferService {
    return this.srv;
  }

  constructor(
    public http: _HttpClient,
    private activatedRoute: ActivatedRoute,
    private srv: TransferService,
    public router: Router,
    private msg: NzMessageService) {

  }

  ngOnInit(): void {
    console.log(this.item.measurementTemplateId)
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.measurementTemplateId) this.measurementTemplateId = queryParams.measurementTemplateId;
      else this.measurementTemplateId = this.item.measurementTemplateId;

      if (queryParams.type) this.type = queryParams.type;
    });

    this.item.step = 1;
    this.loadDataFromServer();
  }

  loadDataFromServer() {
    this.http
      .post('/api/backstage/measurementItemFiled/getList', null, {
        measurementTemplateId: this.measurementTemplateId,
      })
      .subscribe((res) => {
        if (!res.success) return;
        this.loading = false;
        this.measurementItemFields = res.measurementItemFields;
        this.measurementTemplate = res.measurementTemplate;
        this.measurementUnits = res.measurementUnits;
        this.measurementItemFields.forEach(value => {
          value.edit = false;
          value.persistent = true;
        });

        this.updateEditCache();
      });
  }

  changeMeasurementUnit(id: string, measurementItemField: MeasurementItemFieldEditable): void {
    let measurementUnit = this.measurementUnits.filter(value => value.id == id);
    measurementItemField.unitName = measurementUnit[0].unitName;
    measurementItemField.measurementUnitName = measurementUnit[0].name;
  }


  _submitForm(): void {
    if (this.type == this.typeStation)
      this.router.navigate(['/measurement-template/line-list']);
    if (this.type == this.typeDevice)
      this.router.navigate(['/measurement-template/list']);
  }

  prev(): void {
    --this.item.step;
  }

  add() {
    // 不能同时编辑多个
    let editing = false;
    this.measurementItemFields.forEach(value => {
      editing = this.editCache[value.id].edit ? true : editing;
    });
    if (editing)
      return;

    let id = UtilComponent.uuid();
    const measurementItemField: MeasurementItemFieldEditable = {
      id: id,
      seq: this.measurementItemFields.length + 1,
      name: '',
      measurementTemplateId: this.measurementTemplateId,
      measurementUnitId: '',
      measurementUnitName: '',
      unitName: '',
      maxValue: 0,
      minValue: 0,
      correctValue: '',
      manHour: 0,
      description: '',
      remark: '',
      persistent: false,
    }

    this.measurementItemFields.unshift(measurementItemField);
    this.updateEditCache();
    this.startEdit(id);
  }

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  delete(id: string): void {
    this.http
      .post('/api/backstage/measurementItemFiled/delete', null, {
        id: id,
      })
      .subscribe((res) => {
        if (!res.success) return;
        this.loading = false;
        this.msg.success('删除成功');

        this.measurementItemFields = this.measurementItemFields.filter(value => value.id !== id);
        this.updateEditCache();
      });

  }

  cancelEdit(id: string): void {
    const index = this.measurementItemFields.findIndex(item => item.id === id);
    let measurementItemField = this.measurementItemFields[index];

    let persistent = measurementItemField.persistent;
    if (persistent) {
      this.editCache[id] = {
        data: {...this.measurementItemFields[index]},
        edit: false,
      };
    } else {
      this.measurementItemFields = this.measurementItemFields.filter(value => value.persistent);
      this.updateEditCache();
    }
  }

  saveEdit(id: string): void {
    let measurementItemField = this.editCache[id].data;

    this.http
      .post('/api/backstage/measurementItemFiled/saveOrUpdate', null, {
        id: measurementItemField.id,
        name: measurementItemField.name,
        measurementTemplateId: measurementItemField.measurementTemplateId,
        measurementUnitId : measurementItemField.measurementUnitId,
        unitName: measurementItemField.unitName,
        maxValue: measurementItemField.maxValue,
        minValue: measurementItemField.minValue,
        correctValue: measurementItemField.correctValue,
        manHour: measurementItemField.manHour,
        description: measurementItemField.description,
        remark: measurementItemField.remark,
        seq: measurementItemField.seq,
      })
      .subscribe((res) => {
        if (!res.success) return;
        this.loading = false;
        this.editCache[id].edit = false;
        if (res.measurementItemFields) this.measurementItemFields = res.measurementItemFields;
        console.log(this.measurementItemFields)
        const index = this.measurementItemFields.findIndex(item => item.id === id);
        measurementItemField.persistent = true;
        this.measurementItemFields[index] = measurementItemField;

        this.updateEditCache();
      });

  }

  updateEditCache(): void {
    this.measurementItemFields.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: {...item}
      };
    });
  }
}
