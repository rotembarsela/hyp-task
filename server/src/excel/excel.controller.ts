import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ExcelService } from './excel.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('excels')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Get('list/:userId')
  async listFiles(@Param('userId') userId: number) {
    const pendingFiles = await this.excelService.listFiles(userId, 'pending');
    const uploadedFiles = await this.excelService.listFiles(userId, 'uploads');

    return {
      pendingFiles,
      uploadedFiles,
    };
  }

  @Get('read/:userId/:folder/:filename')
  readFile(
    @Param('userId') userId: number,
    @Param('folder') folder: 'uploads' | 'pending',
    @Param('filename') filename: string,
  ): string {
    return this.excelService.readFile(userId, folder, filename);
  }

  @Post('upload/:userId')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFiles(
    @Param('userId') userId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    await this.excelService.uploadFiles(userId, files);

    const pendingFiles = await this.excelService.listFiles(userId, 'pending');
    const uploadedFiles = await this.excelService.listFiles(userId, 'uploads');

    return {
      message: 'Files processed successfully',
      pendingFiles,
      uploadedFiles,
    };
  }

  @Delete('delete/:userId/:folder/:filename')
  deleteFile(
    @Param('userId') userId: number,
    @Param('folder') folder: 'uploads' | 'pending',
    @Param('filename') filename: string,
  ): void {
    this.excelService.deleteFile(userId, folder, filename);
  }
}
