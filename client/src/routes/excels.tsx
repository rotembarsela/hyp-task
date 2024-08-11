import { useState } from "react";
import FileUpload from "../components/FileUpload";
import { useAppContext } from "../context/useAppProvider";
import { fetcher } from "../utils/fetcher";
import UploadedFiles from "../components/excels/UploadedFiles";
import PendingFiles from "../components/excels/PendingFiles";

function Excels() {
  const { user } = useAppContext();

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const handleFilesSelected = (files: File[]) => {
    setPendingFiles(files);
    handleUpload(files);
  };

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) {
      alert("No valid files selected.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetcher<File[], FormData>(
        "https://test.com/api/excels",
        "POST",
        formData
      );

      console.log("Upload successful:", response);
      setUploadedFiles(response);
    } catch (error) {
      console.error("Upload error:", (error as Error).message);
    }
  };

  return (
    <div className="h-full flex flex-col items-center gap-12">
      <h1 className="text-2xl">Hello, {user.name} 👋</h1>
      <FileUpload onFilesSelected={handleFilesSelected} title="Upload Files" />
      <div className="w-full h-[calc(100svh-264px)] flex items-start gap-7">
        <UploadedFiles files={uploadedFiles} />
        <PendingFiles files={pendingFiles} />
      </div>
    </div>
  );
}

export default Excels;
