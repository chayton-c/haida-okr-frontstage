import { Pipe, PipeTransform } from '@angular/core';
import {
  ConstructionControlPlan,
  ConstructionControlPlanConstant,
} from '../../../pojos/construction-control-plan/construction-control-plan';

@Pipe({ name: 'planFilterPipe' })
export class PlanFilterPipe implements PipeTransform {
  constructionControlPlanConstant: ConstructionControlPlanConstant = new ConstructionControlPlanConstant();

  transform(
    plans: ConstructionControlPlan[],
    processStatus: number | undefined,
    planStatus: number | undefined,
    investigationProgressStatus: number | undefined,
  ): any {
    if (processStatus != undefined) {
      plans = plans.filter((plans) => plans.processStatus === processStatus);
    }
    if (planStatus != undefined) {
      plans = plans.filter((plans) => plans.planStatus === planStatus);
    }
    if (investigationProgressStatus != undefined) {
      plans = plans.filter((plans) => plans.investigationProgressStatus === investigationProgressStatus);
    }

    return plans.length ? plans.length : 0;
  }
}
