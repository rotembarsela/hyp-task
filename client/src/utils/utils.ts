import { Excel } from "../types";

const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const createMockExcelFile = (name: string, size: number): Excel => {
  const file = new File(
    [new Array(size).fill("\x00").join("")], // Mock content
    `${name}.xlsx`,
    {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );
  return { id: utils.generateUUID(), name: file.name };
};

const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const utils = {
  generateUUID,
  createMockExcelFile,
  sleep,
};
