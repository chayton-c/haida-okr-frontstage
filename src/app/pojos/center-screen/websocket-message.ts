export class WebsocketMessage {
  workshopId: string;
  stationId: any;
  constructionControlPlanId: string;
  constructionDailyPlanId: string;

  constructor(workshopId: string, stationId: string, constructionControlPlanId: string, constructionDailyPlanId: string) {
    this.workshopId = workshopId;
    this.stationId = stationId;
    this.constructionControlPlanId = constructionControlPlanId;
    this.constructionDailyPlanId = constructionDailyPlanId;
  }
}
