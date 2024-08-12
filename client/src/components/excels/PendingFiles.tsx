import { Excel } from "../../types";
import Paper from "../Paper";
import PendingFileList from "./PendingFileList";

type PendingFilesProps = {
  files: Excel[];
};

function PendingFiles({ files }: PendingFilesProps) {
  return (
    <Paper className="w-1/3 h-full overflow-auto">
      <h2 className="text-lg font-bold mb-2">Pending Files</h2>
      <PendingFileList files={files} />
    </Paper>
  );
}

export default PendingFiles;
