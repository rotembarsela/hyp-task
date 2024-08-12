export type User = {
  name: string;
  email: string;
  israeliId: number;
  phone: number;
};

export type Excel = {
  id: string;
  file: File;
};

export type Variant = "info" | "success" | "danger" | "warning";

export type Size = "sm" | "md" | "lg" | "xl";
