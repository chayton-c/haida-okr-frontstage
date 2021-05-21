export class Role {
  private static readonly BUREAU = 1;
  private static readonly SECTION = 2;
  private static readonly WORKSHOP = 3;
  private static readonly WORK_AREA = 4;

  id: string;
  name: string;
  description: string;
  organizationPermission?: number;
  organizationNames?: string;

  constructor(id: string, name: string, description: string, organizationPermission: number, organizationNames: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.organizationPermission = organizationPermission;
    this.organizationNames = organizationNames;
  }
}
