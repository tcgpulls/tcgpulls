// accessControl.ts
import { KeystoneSessionT } from "./types/Keystone";
import { KeystoneContext } from "@keystone-6/core/types";

const isSudo = ({ context }: { context: any }) => {
  return Boolean((context.req as any)?.isSudoContext);
};

const isSuperAdmin = ({ session }: { session?: KeystoneSessionT }) => {
  const role = session?.data.role.value;
  return role === "super-admin";
};

const isSudoOrSuperAdmin = ({
  session,
  context,
}: {
  session?: KeystoneSessionT;
  context?: any;
}) => {
  if (!session) return isSudo({ context });
  if (!context) return isSuperAdmin({ session });
  return isSudo({ context }) || isSuperAdmin({ session });
};

const isAdmin = ({ session }: { session?: KeystoneSessionT }) => {
  const role = session?.data.role.value;
  return role === "super-admin" || role === "admin";
};

const isEditor = ({ session }: { session?: KeystoneSessionT }) => {
  const role = session?.data.role.value;
  return role === "super-admin" || role === "admin" || role === "editor";
};

const isViewer = ({ session }: { session?: KeystoneSessionT }) => {
  const role = session?.data.role.value;
  return (
    role === "super-admin" ||
    role === "admin" ||
    role === "editor" ||
    role === "viewer"
  );
};

const rules = {
  isSudo,
  isSuperAdmin,
  isSudoOrSuperAdmin,
  isAdmin,
  isEditor,
  isViewer,
};

export default rules;
