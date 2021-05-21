import { Pipe, PipeTransform } from '@angular/core';
import {
  ConstructionControlPlan,
  ConstructionControlPlanConstant,
} from '../../../pojos/construction-control-plan/construction-control-plan';

@Pipe({ name: 'planLevelDateFilterPipe' })
export class PlanLevelDateFilterPipe implements PipeTransform {
  constructionControlPlanConstant: ConstructionControlPlanConstant = new ConstructionControlPlanConstant();

  transform(
    plans: ConstructionControlPlan[],
    level: number | undefined,
    dateFilter: 'none' | 'month' | 'year',
    notStartOrStart: 'none' | 'notStart' | 'start',
  ): any {
    if (notStartOrStart == 'none') {
      if (level != undefined) {
        plans = plans
          .filter((x) => x.processStatus === this.constructionControlPlanConstant.RELEVANCEED)
          .filter((x) => x.warnStatus === level);
      }

      if (dateFilter) {
        if (dateFilter == 'none') plans = plans.filter((x) => x.processStatus === this.constructionControlPlanConstant.RELEVANCEED);

        if (dateFilter == 'month')
          plans = plans
            .filter((x) => x.processStatus === this.constructionControlPlanConstant.RELEVANCEED)
            .filter((x) => x.startTime && new Date(x.startTime).getMonth() === new Date().getMonth() - 1);

        if (dateFilter == 'year')
          plans = plans
            .filter((x) => x.processStatus === this.constructionControlPlanConstant.RELEVANCEED)
            .filter((x) => x.startTime && new Date(x.startTime).getFullYear() === new Date().getFullYear());
      }
    } else if (notStartOrStart == 'notStart') {
      if (level != undefined) {
        plans = plans
          .filter((x) => x.planStatus === this.constructionControlPlanConstant.PENDING_START)
          .filter((x) => x.startTime && new Date(x.startTime).getTime() > new Date().getTime())
          .filter((x) => x.warnStatus === level);
      }

      if (dateFilter) {
        if (dateFilter == 'none')
          plans = plans
            .filter((x) => x.planStatus === this.constructionControlPlanConstant.PENDING_START)
            .filter((x) => x.startTime && new Date(x.startTime).getTime() > new Date().getTime());

        if (dateFilter == 'month')
          plans = plans
            .filter((x) => x.planStatus === this.constructionControlPlanConstant.PENDING_START)
            .filter((x) => x.startTime && new Date(x.startTime).getMonth() === new Date().getMonth() - 1);

        if (dateFilter == 'year')
          plans = plans
            .filter((x) => x.planStatus === this.constructionControlPlanConstant.PENDING_START)
            .filter((x) => x.startTime && new Date(x.startTime).getFullYear() === new Date().getFullYear());
      }
    } else {
      if (level != undefined) {
        plans = plans
          .filter((x) => x.planStatus === this.constructionControlPlanConstant.CONSTRUCTING)
          .filter((x) => x.startTime && new Date(x.startTime).getTime() < new Date().getTime())
          .filter((x) => x.warnStatus === level);
      }

      if (dateFilter) {
        if (dateFilter == 'none')
          plans = plans
            .filter((x) => x.planStatus === this.constructionControlPlanConstant.CONSTRUCTING)
            .filter((x) => x.startTime && new Date(x.startTime).getTime() < new Date().getTime());

        if (dateFilter == 'month')
          plans = plans
            .filter((x) => x.planStatus === this.constructionControlPlanConstant.CONSTRUCTING)
            .filter((x) => x.startTime && new Date(x.startTime).getMonth() === new Date().getMonth() - 1);

        if (dateFilter == 'year')
          plans = plans
            .filter((x) => x.planStatus === this.constructionControlPlanConstant.CONSTRUCTING)
            .filter((x) => x.startTime && new Date(x.startTime).getFullYear() === new Date().getFullYear());
      }
    }

    return plans.length ? plans.length : 0;
  }
}
