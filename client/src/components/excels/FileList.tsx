import { ClockIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

type FileListProps = {
  children?: (file: File) => ReactNode;
  files: File[];
  isUploaded?: boolean;
};

function FileList({ children, files, isUploaded = true }: FileListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {files.map((file) => (
        <li key={file.name} className="flex items-center gap-3">
          {isUploaded ? (
            <DocumentIcon width={24} height={24} />
          ) : (
            <ClockIcon width={24} height={24} />
          )}
          <p>{file.name}</p>
          {children && <div className="flex space-x-2">{children(file)}</div>}
        </li>
      ))}
    </ul>
  );
}

export default FileList;
