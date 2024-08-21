import { Excel } from "../../types";
import { fetcher } from "../../utils/fetcher";
import { utils } from "../../utils/utils";
import Paper from "../Paper";
import Button from "../ui/Button";
import HyperLink from "../ui/HyperLink";
import UploadedFileList from "./UploadedFileList";

type UploadedFiles = {
  files: Excel[];
  onExcelInfoClick: (id: string) => void;
};

function UploadedFiles({ files, onExcelInfoClick }: UploadedFiles) {
  const handleDeleteClick = async (id: string) => {
    try {
      await fetcher<void, undefined>(`/excels/${id}`, "DELETE");
      alert("File deleted successfully");
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  const createDownloadLink = (id: string) => {
    console.log(id);

    const downloadUrl = utils.createMockExcelFile("Temp", 1024).name;

    console.log(downloadUrl);

    return downloadUrl;
  };

  return (
    <Paper className="flex-1 h-full overflow-auto">
      <h2 className="text-lg font-bold mb-2">Uploaded Files</h2>
      <UploadedFileList files={files}>
        {({ id, name }) => (
          <div className="flex items-center gap-4">
            <Button onClick={() => onExcelInfoClick(id)}>Info</Button>
            <HyperLink href={name} download={createDownloadLink(id)}>
              Download
            </HyperLink>
            <Button variant="danger" onClick={() => handleDeleteClick(id)}>
              Remove
            </Button>
          </div>
        )}
      </UploadedFileList>
    </Paper>
  );
}

export default UploadedFiles;
