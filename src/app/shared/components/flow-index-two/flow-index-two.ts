import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

interface IndexPlans {
  pendingRelevancePlans: number;
  pendingStartPlans: number;
  constructingPlans: number;
}

@Component({
  selector: 'flow-index-two',
  templateUrl: './flow-index-two.html',
  styleUrls: ['./azure-rp-page.css', './index-styles.css'],
})
export class FlowIndexTwo implements OnInit {
  indexPlans: IndexPlans = {
    pendingRelevancePlans: 0,
    pendingStartPlans: 0,
    constructingPlans: 0,
  };

  loadDataFromServer(): void {
    this.http.post('/api/backstage/frontStageIndex', null, null).subscribe((res) => {
      if (!res.success) return;
      this.indexPlans.pendingRelevancePlans = res.pendingRelevancePlans;
      this.indexPlans.pendingStartPlans = res.pendingStartPlans;
      this.indexPlans.constructingPlans = res.constructingPlans;
      this.cdr.detectChanges();
    });
  }

  constructor(
    public http: _HttpClient,
    public injector: Injector,
    public router: Router,
    public msg: NzMessageService,
    private modal: ModalHelper,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDataFromServer();
  }
}
