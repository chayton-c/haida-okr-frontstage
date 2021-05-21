import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { StatisticAnalysisRoutingModule } from './statistic-analysis-routing.module';
import { StatisticAnalysisMainComponent } from './main/main.component';
import { NgxEchartsModule } from 'ngx-echarts';

const COMPONENTS: Type<void>[] = [StatisticAnalysisMainComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, StatisticAnalysisRoutingModule, NgxEchartsModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class StatisticAnalysisModule {}
