import { Excel } from "../../types";
import Paper from "../Paper";
import Button from "../ui/Button";
import UploadedFileList from "./UploadedFileList";

type UploadedFiles = {
  files: Excel[];
  onExcelInfoClick: (id: string) => void;
  onExcelDownloadClick: (fileId: string, fileName: string) => Promise<void>;
  onExcelRemoveClick: (fileId: string) => Promise<void>;
};

function UploadedFiles({
  files,
  onExcelInfoClick,
  onExcelDownloadClick,
  onExcelRemoveClick,
}: UploadedFiles) {
  return (
    <Paper className="flex-1 h-full overflow-auto">
      <h2 className="text-lg font-bold mb-2">Uploaded Files</h2>
      <UploadedFileList files={files}>
        {({ id, name }) => (
          <div className="flex items-center gap-4">
            <Button onClick={() => onExcelInfoClick(id)}>Info</Button>
            <Button
              variant="success"
              onClick={() => onExcelDownloadClick(id, name)}
            >
              Download
            </Button>
            <Button variant="danger" onClick={() => onExcelRemoveClick(id)}>
              Remove
            </Button>
          </div>
        )}
      </UploadedFileList>
    </Paper>
  );
}

export default UploadedFiles;
