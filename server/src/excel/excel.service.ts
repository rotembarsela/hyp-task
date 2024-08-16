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

  private async validateUser(userId: number): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

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
    await this.validateUser(userId);

    const { userPendingDir } = this.getUserDirectory(userId);

    for (const file of files) {
      const pendingFilePath = path.join(userPendingDir, file.originalname);
      await fsp.writeFile(pendingFilePath, file.buffer);

      this.pendingQueue.push(pendingFilePath);

      const fileEntity = this.fileRepository.create({
        f_name: file.originalname,
        f_path: pendingFilePath,
      });
      await this.fileRepository.save(fileEntity);
    }

    await this.processPendingFiles(userId);
  }

  public async processPendingFiles(userId: number): Promise<void> {
    await this.validateUser(userId);

    const { userUploadDir } = this.getUserDirectory(userId);

    while (this.pendingQueue.length > 0) {
      if (this.canProcessMoreFiles(userUploadDir)) {
        const filePath = this.pendingQueue.shift();
        if (await this.validateExcelFile(filePath)) {
          await this.processFile(filePath, userUploadDir);
        } else {
          console.error(`File validation failed for ${filePath}`);
          await fsp.unlink(filePath); // Remove invalid file
        }
      } else {
        await this.sleep(1000);
      }
    }
  }

  private canProcessMoreFiles(userUploadDir: string): boolean {
    const filesInUploadDir = fs.readdirSync(userUploadDir);
    return filesInUploadDir.length < 5;
  }

  private async processFile(
    filePath: string,
    userUploadDir: string,
  ): Promise<void> {
    const filename = path.basename(filePath);
    const targetPath = path.join(userUploadDir, filename);

    await this.moveFile(filePath, targetPath);

    const fileEntity = this.fileRepository.create({
      f_name: filename,
      f_path: targetPath,
    });
    const savedFile = await this.fileRepository.save(fileEntity);

    await this.saveCustomerData(targetPath, savedFile.f_id);
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
      const jsonData = utils.sheet_to_json(sheet);

      const requiredColumns = ['Name', 'Email', 'Israeli ID', 'Phone'];

      // Check if the required columns exist
      const firstRow = jsonData[0];
      for (const column of requiredColumns) {
        if (!firstRow.hasOwnProperty(column)) {
          console.error(`Missing required column: ${column}`);
          return false;
        }
      }

      // Validate each row
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

  public listFiles(userId: number, folder: 'uploads' | 'pending'): string[] {
    const { userUploadDir, userPendingDir } = this.getUserDirectory(userId);
    const directoryPath = folder === 'uploads' ? userUploadDir : userPendingDir;
    try {
      return fs.readdirSync(directoryPath);
    } catch (error) {
      console.error(`Error reading directory ${directoryPath}:`, error);
      throw error;
    }
  }

  public readFile(
    userId: number,
    folder: 'uploads' | 'pending',
    filename: string,
  ): string {
    const { userUploadDir, userPendingDir } = this.getUserDirectory(userId);
    const directoryPath = folder === 'uploads' ? userUploadDir : userPendingDir;
    const filePath = path.join(directoryPath, filename);
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      throw error;
    }
  }

  public deleteFile(
    userId: number,
    folder: 'uploads' | 'pending',
    filename: string,
  ): void {
    const { userUploadDir, userPendingDir } = this.getUserDirectory(userId);
    const directoryPath = folder === 'uploads' ? userUploadDir : userPendingDir;
    const filePath = path.join(directoryPath, filename);
    try {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
      throw error;
    }
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
}
