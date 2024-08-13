import { useState } from "react";
import FileUpload from "../components/FileUpload";
import { useAppContext } from "../context/useAppProvider";
import { fetcher } from "../utils/fetcher";
import UploadedFiles from "../components/excels/UploadedFiles";
import PendingFiles from "../components/excels/PendingFiles";
import { mocks } from "../mocks";
import { Excel, ExcelSpreadsheet } from "../types";
import { utils } from "../utils/utils";
import FileInfo from "../components/excels/FileInfo";

function Excels() {
  const { selectedUser } = useAppContext();

  const [uploadedFiles, setUploadedFiles] = useState<ExcelSpreadsheet[]>(
    mocks.excelSpreadsheets
  );
  const [pendingFiles, setPendingFiles] = useState<Excel[]>([]);
  const [excelInfo, setExcelInfo] = useState<ExcelSpreadsheet | null>(null);

  const handleFilesSelected = (files: File[]) => {
    const newPendingFiles: Excel[] = files.map((file) => ({
      id: utils.generateUUID(),
      file,
    }));

    setPendingFiles(newPendingFiles);
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
      const response = await fetcher<ExcelSpreadsheet[], FormData>(
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

  const handleExcelInfoClick = (id: string) => {
    // TODO: Api Call
    const findExcelFile = mocks.excelSpreadsheets.find((exc) => exc.id === id);
    if (!findExcelFile) {
      return;
    }

    setExcelInfo(findExcelFile);
  };

  const handleExcelInfoClose = () => {
    setExcelInfo(null);
  };

  return (
    <div className="h-full flex flex-col items-center gap-12">
      <h1 className="text-2xl">Hello, {selectedUser.name} 👋</h1>
      {excelInfo ? (
        <FileInfo excel={excelInfo} onExcelInfoClose={handleExcelInfoClose} />
      ) : (
        <>
          <FileUpload
            onFilesSelected={handleFilesSelected}
            title="Upload Files"
          />
          <div className="w-full h-[calc(100svh-264px)] flex items-start gap-7">
            <UploadedFiles
              files={uploadedFiles}
              onExcelInfoClick={handleExcelInfoClick}
            />
            <PendingFiles files={pendingFiles} />
          </div>
        </>
      )}
    </div>
  );
}

export default Excels;
