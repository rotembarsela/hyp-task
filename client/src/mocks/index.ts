import { Excel, ExcelSpreadsheet } from "../types";
import { utils } from "../utils/utils";

/*
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
*/

const excels: Excel[] = [
  utils.createMockExcelFile("Excel1", 1024),
  utils.createMockExcelFile("Excel2", 2048),
  utils.createMockExcelFile("Excel3", 3072),
];

const excelSpreadsheets: ExcelSpreadsheet[] = [
  {
    fileId: utils.generateUUID(),
    fileName: "employee_records.xlsx",
    columns: ["ID", "Name", "Position", "Department"],
    rows: [
      {
        ID: 1,
        Name: "Alice",
        Position: "Developer",
        Department: "Engineering",
      },
      { ID: 2, Name: "Bob", Position: "Designer", Department: "Design" },
      { ID: 3, Name: "Charlie", Position: "Manager", Department: "Operations" },
    ],
  },
  {
    fileId: utils.generateUUID(),
    fileName: "product_inventory.xlsx",
    columns: ["SKU", "Product Name", "Quantity", "Price"],
    rows: [
      {
        SKU: "A001",
        "Product Name": "Widget A",
        Quantity: 100,
        Price: "$10.00",
      },
      {
        SKU: "B002",
        "Product Name": "Gadget B",
        Quantity: 200,
        Price: "$15.00",
      },
      { SKU: "C003", "Product Name": "Tool C", Quantity: 150, Price: "$7.50" },
    ],
  },
  {
    fileId: utils.generateUUID(),
    fileName: "student_grades.xlsx",
    columns: ["Student ID", "Name", "Course", "Grade"],
    rows: [
      { "Student ID": 101, Name: "David", Course: "Math", Grade: "A" },
      { "Student ID": 102, Name: "Eva", Course: "Science", Grade: "B+" },
      { "Student ID": 103, Name: "Frank", Course: "History", Grade: "A-" },
    ],
  },
];

export const mocks = { excels, excelSpreadsheets };
