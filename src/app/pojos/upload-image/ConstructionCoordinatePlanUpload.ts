export interface ConstructionCoordinatePlanUpload {
  id: string;
  uploadImageId: string;
  constructionCoordinatePlanId: string;
  fileType: number;
  fileUrl: string;
  addTime: Date;
  fileName: string;
}

export class ConstructionCoordinatePlanUploadConstant {
  public readonly COOPERATIVE_SCHEME = 0; // 类型-配合方案附件
  public readonly SAFETY_PROTOCOL = 1; // 类型-安全协议
}
