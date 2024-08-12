import { ClockIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { Excel } from "../../types";

type FileListProps = {
  children?: (file: Excel) => ReactNode;
  files: Excel[];
  isUploaded?: boolean;
};

function FileList({ children, files, isUploaded = true }: FileListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {files.map(({ id, file }) => (
        <li key={id} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {isUploaded ? (
              <DocumentIcon width={24} height={24} />
            ) : (
              <ClockIcon width={24} height={24} />
            )}
            <p>{file.name}</p>
          </div>
          {children && (
            <div className="flex space-x-2">{children({ id, file })}</div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default FileList;
