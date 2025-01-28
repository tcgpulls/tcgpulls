// accessControl.ts
import { KeystoneSessionT } from "./types/Keystone";
import { CmsUserRoles } from "./types/CmsUser";

const isSudo = ({ context }: { context: any }) => {
  return Boolean((context.req as any)?.isSudoContext);
};

const isSuperAdmin = ({ session }: { session?: KeystoneSessionT }) => {
  const role = session?.data.role.value;
  return role === CmsUserRoles.SuperAdmin;
};

const isAdmin = ({ session }: { session?: KeystoneSessionT }) => {
  const role = session?.data.role.value;
  return role === CmsUserRoles.SuperAdmin || role === CmsUserRoles.Admin;
};

const isEditor = ({ session }: { session?: KeystoneSessionT }) => {
  const role = session?.data.role.value;
  return (
    role === CmsUserRoles.SuperAdmin ||
    role === CmsUserRoles.Admin ||
    role === CmsUserRoles.Editor
  );
};

const isViewer = ({ session }: { session?: KeystoneSessionT }) => {
  const role = session?.data.role.value;
  return (
    role === CmsUserRoles.SuperAdmin ||
    role === CmsUserRoles.Admin ||
    role === CmsUserRoles.Editor ||
    role === CmsUserRoles.Viewer
  );
};

const rules = {
  isSudo,
  isSuperAdmin,
  isAdmin,
  isEditor,
  isViewer,
};

export default rules;
