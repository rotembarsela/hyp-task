import { Excel } from "../../types";
import { fetcher } from "../../utils/fetcher";
import Paper from "../Paper";
import Button from "../ui/Button";
import HyperLink from "../ui/HyperLink";
import RouterLink from "../ui/RouterLink";
import FileList from "./FileList";

type UploadedFiles = {
  files: Excel[];
};

function UploadedFiles({ files }: UploadedFiles) {
  const handleDeleteClick = async (id: string) => {
    try {
      await fetcher<void, undefined>(`/excels/${id}`, "DELETE");
      alert("File deleted successfully");
      // Optionally, refresh the list or remove the deleted file from state
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  return (
    <Paper className="flex-1 h-full overflow-auto">
      <h2 className="text-lg font-bold mb-2">Uploaded Files</h2>
      <FileList files={files}>
        {({ id, file }) => (
          <div className="flex items-center gap-4">
            <RouterLink to={`/excels/${id}`}>Info</RouterLink>
            <HyperLink href={URL.createObjectURL(file)} download={file.name}>
              Download
            </HyperLink>
            <Button variant="danger" onClick={() => handleDeleteClick(id)}>
              Remove
            </Button>
          </div>
        )}
      </FileList>
    </Paper>
  );
}

export default UploadedFiles;
