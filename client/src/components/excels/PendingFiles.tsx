import Paper from "../Paper";
import FileList from "./FileList";

type PendingFilesProps = {
  files: File[];
};

function PendingFiles({ files }: PendingFilesProps) {
  return (
    <Paper className="w-1/3 h-full overflow-auto">
      <h2 className="text-lg font-bold mb-2">Pending Files</h2>
      <FileList files={files} isUploaded={false} />
    </Paper>
  );
}

export default PendingFiles;
