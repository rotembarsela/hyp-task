import { DocumentIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { ExcelSpreadsheet } from "../../types";
import ExcelCard from "./ExcelCard";

type UploadedFileListProps = {
  children?: (file: ExcelSpreadsheet) => ReactNode;
  files: ExcelSpreadsheet[];
};

function UploadedFileList({ children, files }: UploadedFileListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {files.map((file) => (
        <ExcelCard key={file.id}>
          <div className="flex items-center gap-3">
            <DocumentIcon width={40} height={40} />
            <p className="text-lg">{file.name}</p>
          </div>
          {children && <div className="flex space-x-2">{children(file)}</div>}
        </ExcelCard>
      ))}
    </ul>
  );
}

export default UploadedFileList;
