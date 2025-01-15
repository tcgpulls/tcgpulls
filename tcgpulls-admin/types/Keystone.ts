export type KeystoneSessionT = {
  data: {
    id: string;
    name: string;
    email: string;
    role: {
      id: string;
      label: string;
      value: "super-admin" | "admin" | "editor" | "viewer";
    };
  };
};
