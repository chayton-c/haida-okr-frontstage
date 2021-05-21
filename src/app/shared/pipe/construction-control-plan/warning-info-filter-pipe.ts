import { Pipe, PipeTransform } from '@angular/core';
import { WarningInfo } from '../../../pojos/construction-control-plan/warning-info';

@Pipe({ name: 'warningInfoFilterPipe' })
export class WarningInfoFilterPipe implements PipeTransform {
  transform(
    warnings: WarningInfo[],
    warnLevel: number | undefined,
    processStatus: number | undefined,
    dateFilter: 'none' | 'month' | 'year',
  ): any {
    if (processStatus != undefined) {
      warnings = warnings
        .filter((warnings) => warnings.warnLevel === warnLevel)
        .filter((warnings) => warnings.processStatus === processStatus);
    } else {
      if (dateFilter == 'month') {
        warnings = warnings
          .filter((warnings) => warnings.warnLevel === warnLevel)
          .filter((warnings) => warnings.addTime && new Date(warnings.addTime).getMonth() === new Date().getMonth());
      }
      if (dateFilter == 'year') {
        warnings = warnings
          .filter((warnings) => warnings.warnLevel === warnLevel)
          .filter((warnings) => warnings.addTime && new Date(warnings.addTime).getFullYear() === new Date().getFullYear());
      }
    }

    return warnings.length ? warnings.length : 0;
  }
}
