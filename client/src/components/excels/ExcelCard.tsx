import { PropsWithChildren } from "react";

type ExcelCardProps = PropsWithChildren;

const ExcelCard = ({ children }: ExcelCardProps) => {
  return (
    <li className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 border border-gray-200 rounded-md shadow-sm">
      {children}
    </li>
  );
};

export default ExcelCard;
