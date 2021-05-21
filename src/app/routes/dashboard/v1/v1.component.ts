import { Platform } from '@angular/cdk/platform';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OnboardingService } from '@delon/abc/onboarding';
import {_HttpClient, TitleService} from '@delon/theme';

@Component({
  selector: 'app-dashboard-v1',
  templateUrl: './v1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardV1Component implements OnInit {
  todoData = [
    {
      completed: true,
      avatar: '1',
      name: '线路测量正式计划(进行中)',
      content: `哈信号车间`,
    },
    {
      completed: true,
      avatar: '1',
      name: '线路测量正式计划(未开始)',
      content: `哈信号车间`,
    },
    {
      completed: true,
      avatar: '1',
      name: '线路测量计划(待签入)',
      content: `哈信号车间`,
    },
  ];

  webSite!: any[];
  salesData!: any[];
  offlineChartData!: any[];

  constructor(private http: _HttpClient,
              private titleService: TitleService,
              private cdr: ChangeDetectorRef,
              private obSrv: OnboardingService,
              private platform: Platform) {
    // TODO: Wait for the page to load
    setTimeout(() => this.genOnboarding(), 1000);
  }

  ngOnInit(): void {
    this.titleService.setTitle('首页');
  }

  private genOnboarding(): void {
    const KEY = 'on-boarding';
    if (!this.platform.isBrowser || localStorage.getItem(KEY) === '1') {
      return;
    }
    this.http.get(`./assets/tmp/on-boarding.json`).subscribe((res) => {
      this.obSrv.start(res);
      localStorage.setItem(KEY, '1');
    });
  }
}
