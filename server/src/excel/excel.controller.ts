import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  UseInterceptors,
  UploadedFiles,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { ExcelService } from './excel.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

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

  @Get('download/:userId/:fileId')
  async downloadFile(
    @Param('userId') userId: number,
    @Param('fileId') fileId: number,
    @Res() res: Response,
  ) {
    try {
      const { filePath, fileName } = await this.excelService.getFileForDownload(
        userId,
        fileId,
      );

      console.log('before download');
      console.log(filePath);
      console.log(fileName);

      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error('Error downloading the file:', err);
          throw new NotFoundException(
            'Error occurred while downloading the file',
          );
        }
      });
    } catch (error) {
      throw error;
    }
  }
}
