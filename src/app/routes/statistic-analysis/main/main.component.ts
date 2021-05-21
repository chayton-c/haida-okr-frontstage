import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { _HttpClient, SettingsService } from '@delon/theme';
import { DomSanitizer } from '@angular/platform-browser';
import { connect, getInstanceByDom } from 'echarts';
import { DateUtils } from '../../../shared/utils/date-utils';
import { StatisticAnalysisConstant } from '../../../pojos/statistic-analysis/statistic-analysis';

@Component({
  selector: 'app-statistic-analysis-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class StatisticAnalysisMainComponent implements OnInit {
  statisticAnalysisConstant: StatisticAnalysisConstant = new StatisticAnalysisConstant();
  constructor(
    private http: _HttpClient,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private settingService: SettingsService,
  ) {}

  testOpen() {
    window.open(`${this.settingService.user.jeecgUrl}/view/998bb3288bd94f199bd8ee5ba80f8a48`, '_blank');
  }
  open(type: number) {
    // 趋势图
    if (type === this.statisticAnalysisConstant.TENDENCY_CHART) {
      window.open(`${this.settingService.user.jeecgUrl}/view/31ac5542978940fa9590f5d193e4ce8e`, '_blank');
    }

    // BC类施工计划
    if (type === this.statisticAnalysisConstant.BC_CONSTRUCTION) {
      window.open(`${this.settingService.user.jeecgUrl}/view/998bb3288bd94f199bd8ee5ba80f8a48`, '_blank');
    }
  }

  //
  // loading = false;
  // formParams = {
  //   startTime: new Date().getTime() - DateUtils.getMillisecondsByDays(7),
  //   endTime: new Date().getTime() - DateUtils.getMillisecondsByDays(1),
  // };
  // xAxisData = [];
  // // seriesData = [];
  // seriesData: Map<string, any> = new Map();
  //
  // loadDataFromServer(): void {
  //   this.loading = true;
  //
  //   const params = {
  //     startTime: this.formParams.startTime,
  //     endTime: this.formParams.endTime,
  //   };
  //
  //   this.http.post('/api/backstage/statisticsPlanOrDailyPlan/countDailyPlanByConstructionStatus', null, params).subscribe((res) => {
  //     if (!res.success) return;
  //     this.loading = false;
  //     this.xAxisData = res.daysList;
  //     this.seriesData = res.result;
  //
  //     this.xAxisData.forEach((x) => {
  //       // this.seriesData
  //     });
  //     // console.log(res.result);
  //     console.log('res.daysList');
  //     console.log(res.daysList);
  //     console.log('this.seriesData');
  //     console.log(this.seriesData);
  //     this.cdr.detectChanges();
  //   });
  // }
  //
  // options = {
  //   color: ['#3398DB'],
  //   tooltip: {
  //     trigger: 'axis',
  //     axisPointer: {
  //       type: 'shadow',
  //     },
  //   },
  //   grid: {
  //     left: '3%',
  //     right: '4%',
  //     bottom: '3%',
  //     containLabel: true,
  //   },
  //   xAxis: [
  //     {
  //       type: 'category',
  //       // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  //       data: this.xAxisData,
  //       axisTick: {
  //         alignWithLabel: true,
  //       },
  //     },
  //   ],
  //   yAxis: [
  //     {
  //       type: 'value',
  //     },
  //   ],
  //   series: [
  //     {
  //       name: 'Counters',
  //       type: 'bar',
  //       barWidth: '30%',
  //       data: this.seriesData,
  //     },
  //   ],
  // };
  //
  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     const chartElement2 = document.getElementById('chart2');
  //     let chart2;
  //     if (chartElement2) {
  //       chart2 = getInstanceByDom(chartElement2);
  //     }
  //     // @ts-ignore
  //     connect([chart2]);
  //   });
  // }

  ngOnInit() {
    // this.loadDataFromServer();
  }
}
