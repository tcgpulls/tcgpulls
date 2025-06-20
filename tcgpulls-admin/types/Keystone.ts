import { CmsUserRoles } from "./CmsUser";

export type KeystoneSessionT = {
  itemId?: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: {
      id: string;
      label: string;
      value: CmsUserRoles;
    };
  };
};
