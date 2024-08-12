import { Excel, User } from "../types";
import { utils } from "../utils/utils";

const users: User[] = [
  {
    name: "john",
    email: "johndoe@gmail.com",
    israeliId: 423523626,
    phone: 12345678,
  },
  {
    name: "shon",
    email: "shon@gmail.com",
    israeliId: 342523626,
    phone: 42352535,
  },
  {
    name: "kris",
    email: "kris@gmail.com",
    israeliId: 6324234234,
    phone: 21314124,
  },
];

const createMockExcelFile = (name: string, size: number): Excel => {
  const file = new File(
    [new Array(size).fill("\x00").join("")], // Mock content
    `${name}.xlsx`, // File name
    {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    } // MIME type
  );
  return { id: utils.generateUUID(), file };
};

const excels: Excel[] = [
  createMockExcelFile("Excel1", 1024),
  createMockExcelFile("Excel2", 2048),
  createMockExcelFile("Excel3", 3072),
];

export const mocks = { users, excels };
