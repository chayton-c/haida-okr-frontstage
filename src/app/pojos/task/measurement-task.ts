export interface MeasurementTask {
  id: string,
  name: string,
  deviceMaintenancePlanId: string,
  submitUserName: string,
  executorNames: string,
  executeTime: Date,
  finishedStatus: number,
  repairClass: number,
  remark: string,
  startTime: Date,
  endTime: Date,
  addTime: Date,
  updateTime: Date,

}
