export interface Organization {
  id: string;
  name: string;
  description: string;
  parentId? : string;
  remark: string;
  level?: number;
  expand?: boolean;
  organizationList?: Organization[];
  parent?: Organization;
  selected?: boolean;
}
