import { ReactNode } from "react";

export type User = {
  id: number;
  token: string;
  name: string;
};

export type Excel = {
  id: string;
  name: string;
};

export type Variant = "info" | "success" | "danger" | "warning";

export type Size = "sm" | "md" | "lg" | "xl";

export type ExcelRow = {
  [key: string]: ReactNode;
};

export type ExcelSpreadsheet = {
  fileId: string;
  fileName: string;
  columns: string[];
  rows: ExcelRow[];
};

export type ExcelsUploadResponse = {
  message: string;
  pendingFiles: Excel[];
  uploadedFiles: Excel[];
  invalidFiles: string[];
};

export type ExcelsListResponse = {
  pendingFiles: Excel[];
  uploadedFiles: Excel[];
};
