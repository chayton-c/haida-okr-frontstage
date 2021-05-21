export interface ConstructionControlPlanWorkTime {
  id: string;
  constructionControlPlanId: string;
  seq?: number;
  startDate?: Date;
  startTime?: Date;
  endDate?: Date;
  endTime?: Date;
  addTime?: Date;
  updateTime?: Date;
  detailInfo?: string;
}

export interface ConstructionControlPlanWorkTimeEditable extends ConstructionControlPlanWorkTime {
  edit?: boolean
  persistent?: boolean; // 持久状态(已插入到数据库的)
}
