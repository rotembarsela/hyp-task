import { ChangeEvent, useRef } from "react";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  title?: string;
}

const FileUpload = ({ onFilesSelected, title = "Upload" }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];

      const validFiles = Array.from(files).filter((file) =>
        validTypes.includes(file.type)
      );

      if (validFiles.length !== files.length) {
        alert("Some files were not valid Excel files and were not selected.");
      }

      onFilesSelected(validFiles);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <input
        type="file"
        accept=".xls,.xlsx"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        aria-labelledby="file-upload-button"
      />
      <button
        id="file-upload-button"
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="inline-block px-4 py-2 bg-blue-500 text-white font-semibold cursor-pointer rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        {title}
      </button>
    </div>
  );
};

export default FileUpload;
