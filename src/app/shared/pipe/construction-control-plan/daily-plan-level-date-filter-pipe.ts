import { Pipe, PipeTransform } from '@angular/core';
import { ConstructionDailyPlan, ConstructionDailyPlanConstant } from '../../../pojos/construction-control-plan/construction-daily-plan';

@Pipe({ name: 'dailyPlanLevelDateFilterPipe' })
export class dailyPlanLevelDateFilterPipe implements PipeTransform {
  constructionDailyPlanConstant: ConstructionDailyPlanConstant = new ConstructionDailyPlanConstant();

  transform(
    plans: ConstructionDailyPlan[],
    level: number | undefined,
    dateFilter: 'none' | 'month' | 'year',
    notStartOrStart: 'notStart' | 'start',
  ): any {
    if (notStartOrStart == 'notStart') {
      if (level != undefined) {
        plans = plans
          .filter((x) => x.finishedStatus === this.constructionDailyPlanConstant.PENDING_START)
          .filter((x) => x.warnStatus === level);
      }

      if (dateFilter) {
        if (dateFilter == 'none') plans = plans.filter((x) => x.finishedStatus === this.constructionDailyPlanConstant.PENDING_START);

        if (dateFilter == 'month')
          plans = plans
            .filter((x) => x.finishedStatus === this.constructionDailyPlanConstant.PENDING_START)
            .filter((x) => x.startTime && new Date(x.startTime).getMonth() === new Date().getMonth() - 1);

        if (dateFilter == 'year')
          plans = plans
            .filter((x) => x.finishedStatus === this.constructionDailyPlanConstant.PENDING_START)
            .filter((x) => x.startTime && new Date(x.startTime).getFullYear() === new Date().getFullYear());
      }
    } else {
      if (level != undefined) {
        plans = plans
          .filter((x) => x.finishedStatus === this.constructionDailyPlanConstant.PROCESSING)
          .filter((x) => x.warnStatus === level);
      }

      if (dateFilter) {
        if (dateFilter == 'none') plans = plans.filter((x) => x.finishedStatus === this.constructionDailyPlanConstant.PROCESSING);

        if (dateFilter == 'month')
          plans = plans
            .filter((x) => x.finishedStatus === this.constructionDailyPlanConstant.PROCESSING)
            .filter((x) => x.startTime && new Date(x.startTime).getMonth() === new Date().getMonth() - 1);

        if (dateFilter == 'year')
          plans = plans
            .filter((x) => x.finishedStatus === this.constructionDailyPlanConstant.PROCESSING)
            .filter((x) => x.startTime && new Date(x.startTime).getFullYear() === new Date().getFullYear());
      }
    }

    return plans.length ? plans.length : 0;
  }
}
