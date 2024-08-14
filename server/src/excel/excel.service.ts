import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ExcelService {
  private readonly uploadDir = '/data/ExcelUploads';
  private readonly pendingDir = '/data/ExcelPending';

  listFiles(folder: 'uploads' | 'pending'): string[] {
    const directoryPath =
      folder === 'uploads' ? this.uploadDir : this.pendingDir;
    try {
      return fs.readdirSync(directoryPath);
    } catch (error) {
      console.error(`Error reading directory ${directoryPath}:`, error);
      throw error;
    }
  }

  readFile(folder: 'uploads' | 'pending', filename: string): string {
    const directoryPath =
      folder === 'uploads' ? this.uploadDir : this.pendingDir;
    const filePath = path.join(directoryPath, filename);
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      throw error;
    }
  }

  deleteFile(folder: 'uploads' | 'pending', filename: string): void {
    const directoryPath =
      folder === 'uploads' ? this.uploadDir : this.pendingDir;
    const filePath = path.join(directoryPath, filename);
    try {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
      throw error;
    }
  }
}
