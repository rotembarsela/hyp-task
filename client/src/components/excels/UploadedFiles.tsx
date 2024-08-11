import Paper from "../Paper";
import FileList from "./FileList";

type UploadedFiles = {
  files: File[];
};

function UploadedFiles({ files }: UploadedFiles) {
  return (
    <Paper className="flex-1 h-full overflow-auto">
      <h2 className="text-lg font-bold mb-2">Uploaded Files</h2>
      <FileList files={files}>
        {(file) => (
          <>
            <button onClick={() => alert(file.name)}>Info</button>
            <button onClick={() => alert(file.name)}>Download</button>
            <button onClick={() => alert(file.name)}>Remove</button>
          </>
        )}
      </FileList>
    </Paper>
  );
}

export default UploadedFiles;
