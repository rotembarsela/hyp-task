import { useEffect, useState } from "react";
import FileUpload from "../components/FileUpload";
import { useAppContext } from "../context/useAppProvider";
import { APIFetcher } from "../utils/fetcher";
import UploadedFiles from "../components/excels/UploadedFiles";
import PendingFiles from "../components/excels/PendingFiles";
import { mocks } from "../mocks";
import {
  Excel,
  ExcelsListResponse,
  ExcelSpreadsheet,
  ExcelsUploadResponse,
} from "../types";
import { utils } from "../utils/utils";
import FileInfo from "../components/excels/FileInfo";

function Excels() {
  const { selectedUser } = useAppContext();

  const [uploadedFiles, setUploadedFiles] = useState<Excel[]>([]);
  const [pendingFiles, setPendingFiles] = useState<Excel[]>([]);
  const [excelInfo, setExcelInfo] = useState<ExcelSpreadsheet | null>(null);

  const handleFilesSelected = (files: File[]) => {
    const newPendingFiles: Excel[] = files.map((file) => ({
      id: "",
      name: file.name,
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
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await APIFetcher<ExcelsUploadResponse>(
        `/excels/upload/${selectedUser.id}`,
        "POST",
        formData
      );

      await utils.sleep(2500);

      console.log("Upload successful:", response.message);
      setPendingFiles(response.pendingFiles);
      setUploadedFiles(response.uploadedFiles);
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

  const handleExcelDownloadClick = async (fileId: string, fileName: string) => {
    try {
      const response = await APIFetcher<Blob>(
        `/excels/download/${selectedUser.id}/${fileId}`,
        "GET"
      );

      const blob = response;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", (error as Error).message);
    }
  };

  useEffect(() => {
    const getPendingUploadedFiles = async () => {
      try {
        const response = await APIFetcher<ExcelsListResponse>(
          `/excels/list/${selectedUser.id}`,
          "GET"
        );

        setPendingFiles(response.pendingFiles);
        setUploadedFiles(response.uploadedFiles);
      } catch (error) {
        console.error("Get Excels error:", (error as Error).message);
      }
    };

    getPendingUploadedFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              onExcelDownloadClick={handleExcelDownloadClick}
            />
            <PendingFiles files={pendingFiles} />
          </div>
        </>
      )}
    </div>
  );
}

export default Excels;
