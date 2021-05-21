import {Permission} from "../permission/permission";

export interface Menu {
  id: string;
  key: string;
  name: string;
  level?: number;
  expand?: boolean;
  children?: Menu[];
  hasAuth?: boolean;
  parent?: Menu;
  permissions: Permission[];
}
