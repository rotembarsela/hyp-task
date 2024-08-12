import { DocumentIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { ExcelSpreadsheet } from "../../types";

type UploadedFileListProps = {
  children?: (file: ExcelSpreadsheet) => ReactNode;
  files: ExcelSpreadsheet[];
};

function UploadedFileList({ children, files }: UploadedFileListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {files.map((file) => (
        <li key={file.id} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <DocumentIcon width={24} height={24} />
            <p>{file.name}</p>
          </div>
          {children && <div className="flex space-x-2">{children(file)}</div>}
        </li>
      ))}
    </ul>
  );
}

export default UploadedFileList;
