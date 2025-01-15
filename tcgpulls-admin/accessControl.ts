// accessControl.ts
import { KeystoneSessionT } from "./types/Keystone";

const isSuperAdmin = ({ session }: { session?: KeystoneSessionT }) => {
  const role = session?.data.role.value;
  return role === "super-admin";
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
  isSuperAdmin,
  isAdmin,
  isEditor,
  isViewer,
};

export default rules;
