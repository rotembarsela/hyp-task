import { ClockIcon } from "@heroicons/react/24/outline";
import { Excel } from "../../types";
import ExcelCard from "./ExcelCard";

type PendingFileListProps = {
  files: Excel[];
};

function PendingFileList({ files }: PendingFileListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {files.map(({ id, file }) => (
        <ExcelCard key={id}>
          <div className="flex items-center gap-3">
            <ClockIcon width={40} height={40} />
            <p className="text-lg">{file.name}</p>
          </div>
        </ExcelCard>
      ))}
    </ul>
  );
}

export default PendingFileList;
