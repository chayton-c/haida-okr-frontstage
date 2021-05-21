export class DeviceMaintenancePlan {

  id: string;
  submitUserName?: string;
  name: string;
  code: string;
  executionStrategy: number;
  executionStrategyName?: string;
  previousCreateTaskDate?: Date;
  nextTaskDate?: Date;
  stopped: number;
  executorNames?: string;
  deviceQuantity?: number;
  executionCycle?: number;
  executionDate: string;
  duration?: number;
  repairClass: number;
  startTime?: Date;

  constructor(id: string, submitUserName: string, name: string, code: string, executionStrategy: number, executionStrategyName: string, previousCreateTaskDate: Date, nextTaskDate: Date, stopped: number, executorNames: string, deviceQuantity: number, executionCycle: number, executionDate: string, duration: number, repairClass: number, startTime: Date) {
    this.id = id;
    this.submitUserName = submitUserName;
    this.name = name;
    this.code = code;
    this.executionStrategy = executionStrategy;
    this.executionStrategyName = executionStrategyName;
    this.previousCreateTaskDate = previousCreateTaskDate;
    this.nextTaskDate = nextTaskDate;
    this.stopped = stopped;
    this.executorNames = executorNames;
    this.deviceQuantity = deviceQuantity;
    this.executionCycle = executionCycle;
    this.executionDate = executionDate;
    this.duration = duration;
    this.repairClass = repairClass;
    this.startTime = startTime;
  }
}
