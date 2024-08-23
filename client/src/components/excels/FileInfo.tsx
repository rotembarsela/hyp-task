import { ExcelSpreadsheet } from "../../types";
import Paper from "../Paper";
import Button from "../ui/Button";
import Divider from "../ui/Divider";
import ExcelTable from "./ExcelTable";

type FileInfoProps = {
  excel: ExcelSpreadsheet;
  onExcelInfoClose: () => void;
};

function FileInfo({ excel, onExcelInfoClose }: FileInfoProps) {
  return (
    <Paper className="w-full h-full flex flex-col gap-12">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{excel.fileName}</h2>
        <Button onClick={onExcelInfoClose}>Close</Button>
      </div>
      <Divider />
      <ExcelTable excel={excel} />
    </Paper>
  );
}

export default FileInfo;
