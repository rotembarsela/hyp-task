import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { readFile, utils } from 'xlsx';
import * as fsp from 'fs/promises';
import { FileEntity } from 'src/entities/file.entity';
import { CustomerEntity } from 'src/entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class ExcelService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    private readonly userService: UserService,
  ) {}

  private readonly uploadDir = '/data/ExcelUploads';
  private readonly pendingDir = '/data/ExcelPending';

  private pendingQueue: string[] = [];

  private getUserDirectory(userId: number): {
    userUploadDir: string;
    userPendingDir: string;
  } {
    const userUploadDir = path.join(this.uploadDir, userId.toString());
    const userPendingDir = path.join(this.pendingDir, userId.toString());

    if (!fs.existsSync(userUploadDir)) {
      fs.mkdirSync(userUploadDir, { recursive: true });
    }

    if (!fs.existsSync(userPendingDir)) {
      fs.mkdirSync(userPendingDir, { recursive: true });
    }

    return { userUploadDir, userPendingDir };
  }

  public async uploadFiles(
    userId: number,
    files: Express.Multer.File[],
  ): Promise<void> {
    const { userPendingDir } = this.getUserDirectory(userId);

    for (const file of files) {
      console.log(file.originalname);

      const pendingFilePath = path.join(userPendingDir, file.originalname);

      await fsp.writeFile(pendingFilePath, file.buffer);

      this.pendingQueue.push(pendingFilePath);
    }

    await this.processPendingFiles(userId);
  }

  public async processPendingFiles(userId: number): Promise<void> {
    const { userUploadDir } = this.getUserDirectory(userId);
    const invalidFiles: string[] = [];

    while (this.pendingQueue.length > 0) {
      const filePath = this.pendingQueue.shift();

      if (await this.validateExcelFile(filePath)) {
        await this.processFile(filePath, userUploadDir);
      } else {
        console.error(`File validation failed for ${filePath}`);
        invalidFiles.push(path.basename(filePath));
        await fsp.unlink(filePath);
      }
    }

    if (invalidFiles.length > 0) {
      // Handle invalid files, e.g., logging, notifying, or saving the list to a database.
      console.log('Invalid files:', invalidFiles);
    }
  }

  /* DONT USE
  private canProcessMoreFiles(userUploadDir: string): boolean {
    const filesInUploadDir = fs.readdirSync(userUploadDir);
    return filesInUploadDir.length < 5;
  }
*/

  private async processFile(
    filePath: string,
    userUploadDir: string,
  ): Promise<void> {
    const filename = path.basename(filePath);
    const targetPath = path.join(userUploadDir, filename);

    console.log(userUploadDir);

    await this.moveFile(filePath, targetPath);

    const fileEntity = this.fileRepository.create({
      f_name: filename,
      f_path: userUploadDir,
    });
    await this.fileRepository.save(fileEntity);

    await this.saveCustomerData(targetPath, fileEntity.f_id);
  }

  public async getCustomerData(
    userId: number,
    fileId: number,
  ): Promise<{
    fileId: number;
    fileName: string;
    columns: string[];
    rows: any[];
  }> {
    // might be redundant
    const file = await this.findFileById(fileId);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const { userUploadDir } = this.getUserDirectory(userId);
    const filePath = path.join(userUploadDir, file.f_name);

    // might be redundant
    if (file.f_path !== userUploadDir || !fs.existsSync(filePath)) {
      throw new NotFoundException("File not found in the user's directory");
    }

    const customers = await this.customerRepository.find({
      where: { file: { f_id: fileId } },
    });

    const columns = ['Name', 'Email', 'Israeli ID', 'Phone'];
    const rows = customers.map((customer) => ({
      Name: customer.c_name,
      Email: customer.c_email,
      'Israeli ID': customer.c_israeli_id,
      Phone: customer.c_phone,
    }));

    return { fileId: file.f_id, fileName: file.f_name, columns, rows };
  }

  public async getFileForDownload(
    userId: number,
    fileId: number,
  ): Promise<{ filePath: string; fileName: string }> {
    const file = await this.findFileById(fileId);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const { userUploadDir } = this.getUserDirectory(userId);

    if (file.f_path !== userUploadDir) {
      throw new NotFoundException("File not found in the user's directory");
    }

    const filePath = path.join(file.f_path, file.f_name);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found on the server');
    }

    return { filePath, fileName: file.f_name };
  }

  private async findFileById(fileId: number): Promise<FileEntity | null> {
    return this.fileRepository.findOne({ where: { f_id: fileId } });
  }

  private async saveCustomerData(
    filePath: string,
    fileId: number,
  ): Promise<void> {
    const workbook = readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = utils.sheet_to_json(sheet);

    const fileEntity = await this.fileRepository.findOne({
      where: { f_id: fileId },
    });

    if (!fileEntity) {
      throw new Error(`File with ID ${fileId} not found`);
    }

    for (const row of rows) {
      const customerEntity = this.customerRepository.create({
        c_name: row['Name'],
        c_email: row['Email'],
        c_israeli_id: row['Israeli ID'],
        c_phone: row['Phone'],
        file: fileEntity,
      });

      await this.customerRepository.save(customerEntity);
    }
  }

  private async validateExcelFile(filePath: string): Promise<boolean> {
    try {
      const workbook = readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(sheet, { raw: false });

      const requiredColumns = ['Name', 'Email', 'Israeli ID', 'Phone'];

      const firstRow = jsonData[0];
      for (const column of requiredColumns) {
        if (!firstRow.hasOwnProperty(column)) {
          console.error(`Missing required column: ${column}`);
          return false;
        }
      }

      for (const row of jsonData) {
        if (!row['Name'] || typeof row['Name'] !== 'string') {
          console.error(`Invalid or missing Name: ${JSON.stringify(row)}`);
          return false;
        }
        if (!row['Email'] || !this.validateEmail(row['Email'])) {
          console.error(`Invalid or missing Email: ${JSON.stringify(row)}`);
          return false;
        }
        if (!row['Israeli ID'] || typeof row['Israeli ID'] !== 'string') {
          console.error(
            `Invalid or missing Israeli ID: ${JSON.stringify(row)}`,
          );
          return false;
        }
        if (!row['Phone'] || typeof row['Phone'] !== 'string') {
          console.error(`Invalid or missing Phone: ${JSON.stringify(row)}`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error(`Error validating file ${filePath}:`, error);
      return false;
    }
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public async listFiles(
    userId: number,
    folder: 'uploads' | 'pending',
  ): Promise<{ id: number; name: string }[]> {
    const { userPendingDir, userUploadDir } = this.getUserDirectory(userId);

    if (folder === 'pending') {
      const pendingFiles = await fsp.readdir(userPendingDir);
      return pendingFiles.map((filename) => ({
        id: this.generateRandomId(),
        name: filename,
      }));
    } else if (folder === 'uploads') {
      console.log(userUploadDir);
      const uploadedFiles = await this.fileRepository.find({
        where: { f_path: userUploadDir },
      });

      return uploadedFiles.map((file) => ({
        id: file.f_id,
        name: file.f_name,
      }));
    }

    return [];
  }

  public readFile(userId: number, filename: string): string {
    const { userUploadDir } = this.getUserDirectory(userId);
    const filePath = path.join(userUploadDir, filename);
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      throw error;
    }
  }

  public async deleteFile(userId: number, fileId: number): Promise<void> {
    const file = await this.findFileById(fileId);

    console.log('FileId:', fileId);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const { userUploadDir } = this.getUserDirectory(userId);

    const filePath = path.join(userUploadDir, file.f_name);
    if (file.f_path !== userUploadDir || !fs.existsSync(filePath)) {
      throw new NotFoundException("File not found in the user's directory");
    }

    try {
      fs.unlinkSync(filePath);
      console.log(`Deleted file from filesystem: ${filePath}`);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
      throw new Error('Failed to delete the file from the server');
    }

    await this.fileRepository.delete(fileId);
    console.log(`Deleted file record from database: ${fileId}`);
  }
  private async moveFile(source: string, destination: string): Promise<void> {
    try {
      await fsp.copyFile(source, destination);
      await fsp.unlink(source);
    } catch (error) {
      console.error(
        `Failed to move file from ${source} to ${destination}:`,
        error,
      );
      throw error;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private generateRandomId(): number {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }
}
