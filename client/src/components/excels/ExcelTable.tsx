import React from "react";
import { ExcelSpreadsheet } from "../../types";

type ExcelTableProps = {
  excel: ExcelSpreadsheet;
};

const ExcelTable: React.FC<ExcelTableProps> = ({ excel }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {excel.columns.map((col, index) => (
            <th
              key={index}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {excel.rows.map((row, index) => (
          <tr key={index} className="even:bg-gray-50">
            {excel.columns.map((col) => (
              <td key={col} className="px-6 py-4 whitespace-nowrap">
                {row[col]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExcelTable;
