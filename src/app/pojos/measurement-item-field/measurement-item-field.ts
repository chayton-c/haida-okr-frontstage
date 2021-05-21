export interface MeasurementItemField {
  id: string;
  name: string;
  measurementTemplateId? : string;
  measurementUnitId? : string;
  unitName: string;
  measurementUnitName: string;
  maxValue: number;
  minValue: number;
  correctValue: string;
  manHour: number;
  description: string;
  remark: string;
  edit?: boolean;
  seq?: number;
}
