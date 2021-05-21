import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from '@delon/theme';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { Pojo } from '../../../pojos/common/pojo';
import { Station } from '../../../pojos/station/station';
import { Organization } from '../../../pojos/organization/organization';

@Component({
  selector: 'app-station-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class StationDetailComponent implements OnInit {
  validateForm: FormGroup;
  checkedOrganizationId = '';
  station: Station = {
    id: '',
    name: '',
    code: '',
    railwayLineId: '',
    seq: 1,
    bureauId: '',
    sectionId: '',
    workshopId: '',
  };
  bureaus: Organization[] = [];
  sections: Organization[] = [];
  workshops: Organization[] = [];
  loading = false;

  // ----表单部分
  // 验证岗位名是否重复
  // roleValidator = (control: FormControl) =>
  //   new Observable((observer: Observer<ValidationErrors | null>) => {
  //     setTimeout(() => {
  //       this.http.post('/api/backstage/user/checkUserName', null, { userName: this.station.userName, id: this.station.id }).subscribe((res) => {
  //         if (!res.success) observer.next({ error: true, duplicated: true });
  //         else observer.next(null);
  //         observer.complete();
  //       });
  //     }, 10);
  //   });

  // 提交位置信息
  executeStationInfo() {
    const params = {
      id: this.station.id,
      name: this.station.name,
      code: this.station.code,
      workshopId: this.station.workshopId,
      kilometerMark: this.station.kilometerMark,
    };
    this.http.post('/api/backstage/station/saveOrUpdate', null, params).subscribe((res) => {
      if (!res.success) return;

      this.msg.success(res.msg);
      this.router.navigate(['/station/list']);
    });
  }

  loadDataFromServer(): void {
    this.http
      .post('/api/backstage/station/info', null, {
        id: this.station.id,
      })
      .subscribe((res) => {
        this.bureaus = res.bureaus;
        this.sections = res.sections;
        this.workshops = res.workshops;
        this.station = res.station;
        if (this.bureaus.length == 1 && !this.station.bureauId) this.station.bureauId = this.bureaus[0].id;
        if (this.sections.length == 1 && !this.station.sectionId) this.station.sectionId = this.sections[0].id;

        this.loading = false;
      });
  }

  resetOrganizations(level: number): void {
    if (level == 2) {
      let checkedWorkshop = this.workshops.find((value) => value.id == this.station.workshopId);
      if (!checkedWorkshop || checkedWorkshop.parentId != this.station.sectionId) this.station.workshopId = '';
    }
    if (level == 1) {
      let checkedSection = this.sections.find((value) => value.id == this.station.sectionId);
      if (!checkedSection || checkedSection.parentId != this.station.bureauId) this.station.sectionId = '';
    }
  }

  constructor(
    public http: _HttpClient,
    private activatedRoute: ActivatedRoute,
    private msg: NzMessageService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      bureauId: [''],
      sectionId: [''],
      workshopId: ['', [Validators.required]],
      kilometerMark: [''],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.stationId) this.station.id = queryParams.stationId;
    });
    // 加载菜单信息
    this.loadDataFromServer();
  }
}
