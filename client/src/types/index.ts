import { ReactNode } from "react";

export type User = {
  id: number;
  token: string;
  name: string;
};

export type Excel = {
  id: string;
  file: File;
};

export type Variant = "info" | "success" | "danger" | "warning";

export type Size = "sm" | "md" | "lg" | "xl";

export type ExcelRow = {
  [key: string]: ReactNode;
};

export type ExcelSpreadsheet = {
  id: string;
  name: string;
  headerRow: string[];
  bodyRows: ExcelRow[];
};
