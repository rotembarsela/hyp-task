import { ClockIcon } from "@heroicons/react/24/outline";
import { Excel } from "../../types";

type PendingFileListProps = {
  files: Excel[];
};

function PendingFileList({ files }: PendingFileListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {files.map(({ id, file }) => (
        <li key={id} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ClockIcon width={24} height={24} />
            <p>{file.name}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default PendingFileList;
