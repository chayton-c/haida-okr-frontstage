import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';
import {_HttpClient, TitleService} from '@delon/theme';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  ConstructionControlPlanKilometerMark, ConstructionControlPlanKilometerMarkConstant,
  ConstructionControlPlanKilometerMarkEditable
} from '../../../pojos/construction-control-plan/construction-control-plan-kilometer-mark';
import {Organization} from '../../../pojos/organization/organization';
import {User} from '../../../pojos/user/user';
import {ConstructionControlPlan, ConstructionControlPlanConstant,} from '../../../pojos/construction-control-plan/construction-control-plan';
import {Station} from '../../../pojos/station/station';
import {HttpUtils} from '../../../shared/utils/http-utils';
import {Constant} from '../../../pojos/common/constant';
import {RailwayLine} from '../../../pojos/railway-line/railway-line';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import {ConstructionControlPlanWorkTimeEditable} from '../../../pojos/construction-control-plan/construction-control-plan-work-time';
import {UtilComponent} from '../../delon/util/util.component';

@Component({
  selector: 'app-construction-control-plan-detail',
  templateUrl: './detail.component.html',
})
export class ConstructionControlPlanDetailComponent implements OnInit, OnDestroy {
  editIndex = -1;

  validateForm: FormGroup;
  constant: Constant = new Constant();
  constructionControlPlan: ConstructionControlPlan = {
    id: '',
    approveStatus: 0,
    processStatus: 0,
    investigationProgressStatus: 0,
    code: '',
    executeUserId: '',
    finishStatus: 0,
    influenceArea: '',
    name: '',
    signInStationId: '',
    signInUserId: '',
    warnStatus: 0,
    workInfo: '',
  };
  constructionConstrolPlanConstant: ConstructionControlPlanConstant = new ConstructionControlPlanConstant();
  stations: Station[] = [];
  railwayLines: RailwayLine[] = [];
  users: User[] = [];
  workshops: Organization[] = [];
  loading = false;

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  get items(): FormArray {
    return this.validateForm.controls.items as FormArray;
  }

  // 保存
  save(next?: (res: any) => void) {
    this.http
      .post('/api/backstage/constructionControlPlan/saveOrUpdate', null, HttpUtils.transform(this.constructionControlPlan))
      .subscribe((res) => {
        if (!res.success) {
          return;
        }

        this.msg.success(res.msg);
        if (next) {
          next(res);
        }
        this.router.navigate(['/construction-control-plan/list']);
      });
  }

  loadDataFromServer(): void {
    this.http.post('/api/backstage/constructionControlPlan/info', null, {id: this.constructionControlPlan.id}).subscribe((res) => {
      this.constructionControlPlan = res.constructionControlPlan;
      if (!this.constructionControlPlan.id) {
        this.constructionControlPlan.id = UtilComponent.uuid();
      }

      this.stations = res.stations;
      // if (this.stations && this.stations.length > 0 && !this.constructionControlPlan.startStationId) this.constructionControlPlan.startStationId = this.stations[0].id;
      this.railwayLines = res.railwayLines;

      this.users = res.users;

      this.validateForm.controls.code.disable();

      this.loading = false;
      this.loadConstructionControlPlanKilometerMarks();
      this.loadConstructionControlPlanWorkTimes();
    });
  }

  updateRailwayLine(constructionControlPlanKilometerMarkEditable: ConstructionControlPlanKilometerMarkEditable) {
    let railwayLineId = constructionControlPlanKilometerMarkEditable.railwayLineId;
    if (!railwayLineId) return;
    this.checkingRailwayLineId = railwayLineId;
    constructionControlPlanKilometerMarkEditable.railwayLineName = this.railwayLines.find(x => x.id == railwayLineId)!.name;
    constructionControlPlanKilometerMarkEditable.startStationId = '';
    constructionControlPlanKilometerMarkEditable.endStationId = '';

    this.http
      .post('/api/client/station/getStationsByRailwayLineId', null, {railwayLineId: this.checkingRailwayLineId})
      .subscribe((res) => {
        this.stations = res.obj;
      });
  }

  updateStartStationId(constructionControlPlanKilometerMarkEditable: ConstructionControlPlanKilometerMarkEditable) {
    let startStationId = constructionControlPlanKilometerMarkEditable.startStationId;
    if (!startStationId) return;
    constructionControlPlanKilometerMarkEditable.startStationName = this.stations.find(x => x.id == startStationId)!.name;
  }

  updateEndStationId(constructionControlPlanKilometerMarkEditable: ConstructionControlPlanKilometerMarkEditable) {
    let endStationId = constructionControlPlanKilometerMarkEditable.endStationId;
    if (!endStationId) return;
    constructionControlPlanKilometerMarkEditable.endStationName = this.stations.find(x => x.id == endStationId)!.name;
    console.log(constructionControlPlanKilometerMarkEditable.endStationName);
  }

  constructor(
    public http: _HttpClient,
    private activatedRoute: ActivatedRoute,
    private msg: NzMessageService,
    private router: Router,
    private titleService: TitleService,
    private fb: FormBuilder,
  ) {
    this.validateForm = this.fb.group({
      code: ['', [Validators.required]],
      name: [''],
      approveStatus: [''],
      executeUserId: [''],
      finishStatus: [''],
      constructionStatus: [''],
      constructionProjectInfo: [''],
      influenceArea: [''],
      constructionContentAndInfluenceArea: [''],
      constructionDepartmentAndPrincipalName: [''],
      constructionPeriod: [''],
      needCooperate: [''],
      cooperateLocationInfo: [''],
      constructDepartment: [''],
      railwayLineStatus: [''],
      signInStationId: [''],
      signInUserId: [''],
      endTime: [''],
      warnStatus: [''],
      endDistanceFromRailway: [''],
      workInfo: [''],
      protectiveMeasuresInfo: [''],
      supervisionDepartmentAndPrincipalName: [''],
      equipmentMonitoringDepartmentAndPrincipalName: [''],
      remarks: [''],
      starRating: [''],
      auditDepartment: [''],
      constructionType: [''],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('方案详情');
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.constructionControlPlanId) {
        this.constructionControlPlan.id = queryParams.constructionControlPlanId;
        if (!this.constructionControlPlan.id) {
          this.constructionControlPlan.id = UtilComponent.uuid();
        }
      }
    });
    this.loadDataFromServer();

  }

  // 施工地点可编辑列表部分
  constructionControlPlanKilometerMarkConstant = new ConstructionControlPlanKilometerMarkConstant();
  constructionControlPlanKilometerMarkEditCache: { [key: string]: { edit: boolean; data: ConstructionControlPlanKilometerMarkEditable } } = {};
  constructionControlPlanKilometerMarkEditables: ConstructionControlPlanKilometerMarkEditable[] = [];
  constructionControlPlanKilometerMarkLoading = false;
  checkingRailwayLineId?: string; // 编辑施工地点时，选择的线路id

  loadConstructionControlPlanKilometerMarks() {
    this.http
      .post('/api/backstage/constructionControlPlanKilometerMark/getList', null, {
        constructionControlPlanId: this.constructionControlPlan.id,
      })
      .subscribe((res) => {
        if (!res.success) {
          return;
        }
        this.constructionControlPlanKilometerMarkEditables = res.constructionControlPlanKilometerMarks;
        this.constructionControlPlanKilometerMarkEditables.forEach((value) => {
          ConstructionControlPlanKilometerMark.splitKilometer(value);
          value.edit = false;
          value.persistent = true;
        });
        this.constructionControlPlanKilometerMarkUpdateEditCache();
        console.log(this.constructionControlPlanKilometerMarkEditables)
        console.log(this.constructionControlPlanKilometerMarkEditCache)
      });
  }

  constructionControlPlanKilometerMarksStartEdit(id: string): void {
    this.constructionControlPlanKilometerMarkEditCache[id].edit = true;
  }

  saveConstructionControlPlanKilometerMark(id: string): void {
    let constructionControlPlanKilometerMark = this.constructionControlPlanKilometerMarkEditCache[id].data;

    this.http.post('/api/backstage/constructionControlPlanKilometerMark/saveOrUpdate', null, HttpUtils.transform(constructionControlPlanKilometerMark))
      .subscribe((res) => {
        if (!res.success) {
          return;
        }
        this.constructionControlPlanKilometerMarkLoading = false;
        this.constructionControlPlanKilometerMarkEditCache[id].edit = false;
        const index = this.constructionControlPlanKilometerMarkEditables.findIndex(item => item.id === id);
        constructionControlPlanKilometerMark.persistent = true;
        this.constructionControlPlanKilometerMarkEditables[index] = constructionControlPlanKilometerMark;

        this.constructionControlPlanKilometerMarkUpdateEditCache();
      });
  }

  deleteConstructionControlKilometerMarkTime(id: string): void {
    this.http.post('/api/backstage/constructionControlPlanKilometerMark/delete', null, {
      id: id
    })
      .subscribe((res) => {
        if (!res.success) {
          return;
        }
        this.msg.success('删除成功');

        this.constructionControlPlanKilometerMarkEditables = this.constructionControlPlanKilometerMarkEditables.filter(x => x.id !== id);
        this.constructionControlPlanKilometerMarkUpdateEditCache();
      });
  }

  constructionControlPlanKilometerMarkUpdateEditCache(): void {
    // 不能同时编辑多个
    let editing = false;
    this.constructionControlPlanKilometerMarkEditables.forEach((value) => {
      editing = this.constructionControlPlanKilometerMarkEditCache[value.id] && this.constructionControlPlanKilometerMarkEditCache[value.id].edit ? true : editing;
    });
    if (editing) {
      return;
    }

    this.constructionControlPlanKilometerMarkEditables.forEach(item => {
      this.constructionControlPlanKilometerMarkEditCache[item.id] = {
        edit: false,
        data: {...item}
      };
    });
  }

  cancelEditConstructionControlPlanKilometerMark(id: string): void {
    const index = this.constructionControlPlanKilometerMarkEditables.findIndex(item => item.id === id);
    let opcMark = this.constructionControlPlanKilometerMarkEditables[index];

    let persistent = opcMark.persistent;
    if (persistent) {
      this.constructionControlPlanKilometerMarkEditCache[id] = {
        data: {...this.constructionControlPlanKilometerMarkEditables[index]},
        edit: false,
      };
    } else {
      this.constructionControlPlanKilometerMarkEditables = this.constructionControlPlanKilometerMarkEditables.filter(value => value.persistent);
      this.constructionControlPlanKilometerMarkUpdateEditCache();
    }
  }

  setKilometer(constructionControlPlanKilometerMark: ConstructionControlPlanKilometerMark) {
    ConstructionControlPlanKilometerMark.setKilometer(constructionControlPlanKilometerMark);
    console.log(constructionControlPlanKilometerMark)
    console.log(this.constructionControlPlanKilometerMarkEditCache)
  }

  addConstructionControlPlanKilometerMark() {
    // 不能同时编辑多个
    let editing = false;
    this.constructionControlPlanKilometerMarkEditables.forEach((value) => {
      editing = this.constructionControlPlanKilometerMarkEditCache[value.id].edit ? true : editing;
    });
    if (editing) {
      return;
    }

    let id = UtilComponent.uuid();

    const constructionControlPlanKilometerMarkEditable: ConstructionControlPlanKilometerMarkEditable = {
      id: id,
      constructionControlPlanId: this.constructionControlPlan.id,
    };

    this.constructionControlPlanKilometerMarkEditables.unshift(constructionControlPlanKilometerMarkEditable);
    this.constructionControlPlanKilometerMarkUpdateEditCache();
    this.constructionControlPlanKilometerMarksStartEdit(id);
    console.log(this.constructionControlPlanKilometerMarkEditables);
  }


  // 施工日期及时间可编辑列表部分
  constructionControlPlanWorkTimeEditCache: { [key: string]: { edit: boolean; data: ConstructionControlPlanWorkTimeEditable } } = {};
  constructionControlPlanWorkTimeEditables: ConstructionControlPlanWorkTimeEditable[] = [];
  constructionControlPlanWorkTimeLoading = false;

  loadConstructionControlPlanWorkTimes() {
    this.http
      .post('/api/backstage/constructionControlPlanWorkTime/getList', null, {
        constructionControlPlanId: this.constructionControlPlan.id,
      })
      .subscribe((res) => {
        if (!res.success) return;
        this.constructionControlPlanWorkTimeEditables = res.constructionControlPlanWorkTimes;
        this.constructionControlPlanWorkTimeEditables.forEach((value) => {
          value.edit = false;
          value.persistent = true;
        });
        this.constructionControlPlanWorkTimeUpdateEditCache();
      });
  }

  constructionControlPlanWorkTimeStartEdit(id: string): void {
    this.constructionControlPlanWorkTimeEditCache[id].edit = true;
  }

  saveConstructionControlPlanWorkTime(id: string): void {
    let constructionControlPlanWorkTime = this.constructionControlPlanWorkTimeEditCache[id].data;

    this.http.post('/api/backstage/constructionControlPlanWorkTime/saveOrUpdate', null, HttpUtils.transform(constructionControlPlanWorkTime))
      .subscribe((res) => {
        if (!res.success) return;
        this.constructionControlPlanWorkTimeLoading = false;
        this.constructionControlPlanWorkTimeEditCache[id].edit = false;
        const index = this.constructionControlPlanWorkTimeEditables.findIndex(item => item.id === id);
        constructionControlPlanWorkTime.persistent = true;
        this.constructionControlPlanWorkTimeEditables[index] = constructionControlPlanWorkTime;

        this.constructionControlPlanWorkTimeUpdateEditCache();
      });
  }

  deleteConstructionControlPlanWorkTime(id: string): void {
    this.http.post('/api/backstage/constructionControlPlanWorkTime/delete', null, {
      id: id
    })
      .subscribe((res) => {
        if (!res.success) return;
        this.msg.success('删除成功');

        this.constructionControlPlanWorkTimeEditables = this.constructionControlPlanWorkTimeEditables.filter(x => x.id !== id);
        this.constructionControlPlanWorkTimeUpdateEditCache();
      });
  }

  constructionControlPlanWorkTimeUpdateEditCache(): void {
    // 不能同时编辑多个
    let editing = false;
    this.constructionControlPlanWorkTimeEditables.forEach((value) => {
      editing = this.constructionControlPlanWorkTimeEditCache[value.id] && this.constructionControlPlanWorkTimeEditCache[value.id].edit ? true : editing;
    });
    if (editing) return;

    this.constructionControlPlanWorkTimeEditables.forEach(item => {
      this.constructionControlPlanWorkTimeEditCache[item.id] = {
        edit: false,
        data: {...item}
      };
    });
  }

  cancelEditConstructionControlPlanWorkTime(id: string): void {
    const index = this.constructionControlPlanWorkTimeEditables.findIndex(item => item.id === id);
    let opcMark = this.constructionControlPlanWorkTimeEditables[index];

    let persistent = opcMark.persistent;
    if (persistent) {
      this.constructionControlPlanWorkTimeEditCache[id] = {
        data: {...this.constructionControlPlanWorkTimeEditables[index]},
        edit: false,
      };
    } else {
      this.constructionControlPlanWorkTimeEditables = this.constructionControlPlanWorkTimeEditables.filter(value => value.persistent);
      this.constructionControlPlanWorkTimeUpdateEditCache();
    }
  }

  addConstructionControlPlanWorkTime() {
    // 不能同时编辑多个
    let editing = false;
    this.constructionControlPlanWorkTimeEditables.forEach((value) => {
      editing = this.constructionControlPlanWorkTimeEditCache[value.id].edit ? true : editing;
    });
    if (editing) return;

    let id = UtilComponent.uuid();

    const constructionControlPlanWorkTimeEditable: ConstructionControlPlanWorkTimeEditable = {
      id: id,
      constructionControlPlanId: this.constructionControlPlan.id,
    };

    this.constructionControlPlanWorkTimeEditables.unshift(constructionControlPlanWorkTimeEditable);
    this.constructionControlPlanWorkTimeUpdateEditCache();
    this.constructionControlPlanWorkTimeStartEdit(id);
  }


  ngOnDestroy(): void {
    let id = this.constructionControlPlan.id;

    this.http
      .post('/api/backstage/constructionControlPlanWorkTime/checkDeleteWhenDestropPage', null, {
        constructionControlPlanId: id
      });
    this.http
      .post('/api/backstage/constructionControlPlanKilometerMark/checkDeleteWhenDestropPage', null, {
        constructionControlPlanId: id
      });
  }
}
