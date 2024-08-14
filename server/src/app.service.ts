import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  logFolderContents() {
    const excelUploadsPath = '/data/ExcelUploads';
    const excelPendingPath = '/data/ExcelPending';

    this.logDirectoryContents(excelUploadsPath);
    this.logDirectoryContents(excelPendingPath);
  }

  private logDirectoryContents(directoryPath: string) {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error(`Error reading directory ${directoryPath}:`, err);
      } else {
        console.log(`Contents of ${directoryPath}:`);
        files.forEach((file) => {
          console.log(file);
        });
      }
    });
  }
}
