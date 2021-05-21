import { Component, OnInit } from '@angular/core';
import {_HttpClient, TitleService} from '@delon/theme';
import {ActivatedRoute, Router} from '@angular/router';
import {NzMessageService} from "ng-zorro-antd/message";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-construction-control-plan-preview',
  templateUrl: './preview.component.html',
})
export class ConstructionControlPlanPreviewComponent implements OnInit {
  constructionControlPlanId?: string;
  parentUrl?: string;
  parentName?: string;

  constructor(
    public http: _HttpClient,
    private msg: NzMessageService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    private titleService: TitleService
  ) {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.constructionControlPlanId) this.constructionControlPlanId = queryParams.constructionControlPlanId;
      if (queryParams.parentUrl) this.parentUrl = queryParams.parentUrl;
      if (queryParams.parentName) this.parentName = queryParams.parentName;
    });
  }
  ngOnInit(): void {
    this.titleService.setTitle('配合方案预览');
  }
  backToParentUrl() {
    this.router.navigate([this.parentUrl]);
  }
}
