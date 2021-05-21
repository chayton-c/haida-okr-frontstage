import { Component, OnInit } from '@angular/core';
import { _HttpClient} from '@delon/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {RailwayLine} from "../../../pojos/railway-line/railway-line";

@Component({
  selector: 'app-railway-line-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class RailwayLineDetailComponent implements OnInit {
  validateForm: FormGroup;
  railwayLine: RailwayLine = {
    id: '',
    name: '',
    code: ''
  };
  loading = false;

  executeRailwayLineInfo() {
    const params = {
      id: this.railwayLine.id,
      name: this.railwayLine.name,
      code: this.railwayLine.code
    };
    this.http.post('/api/backstage/railwayLine/saveOrUpdate', null, params).subscribe((res) => {
      if (!res.success) return;

      this.msg.success(res.msg);
      this.router.navigate(['/railway-line/list']);
    });
  }

  loadDataFromServer(): void {
    this.http
      .post('/api/backstage/railwayLine/info', null, {
        id: this.railwayLine.id,
      })
      .subscribe((res) => {
        if (!res.success) return;
        this.loading = false;
        if (res.railwayLine.id) this.railwayLine = res.railwayLine;
      });
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
    });
  }

  ngOnInit(): void {
    // 获取roleId
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.railwayLineId) this.railwayLine.id = queryParams.railwayLineId;
    });
    // 加载菜单信息
    this.loadDataFromServer();
  }
}
