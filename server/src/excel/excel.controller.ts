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

  // TODO: change to /:userId, GET
  @Get('list/:userId')
  async listFiles(@Param('userId') userId: number) {
    const pendingFiles = await this.excelService.listFiles(userId, 'pending');
    const uploadedFiles = await this.excelService.listFiles(userId, 'uploads');

    return {
      pendingFiles,
      uploadedFiles,
    };
  }

  @Get(':userId/uploads/:fileId')
  async readFile(
    @Param('userId') userId: number,
    @Param('fileId') fileId: number,
  ) {
    return await this.excelService.getCustomerData(userId, fileId);
  }

  // TODO: change to /:folderName/:userId, POST
  @Post('upload/:userId')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFiles(
    @Param('userId') userId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    await this.excelService.uploadFiles(userId, files);

    const pendingFiles = await this.excelService.listFiles(userId, 'pending');
    const uploadedFiles = await this.excelService.listFiles(userId, 'uploads');

    console.log(`Pending file ${pendingFiles}`);
    console.log(`Uploaded file ${uploadedFiles}`);

    return {
      message: 'Files processed successfully',
      pendingFiles,
      uploadedFiles,
    };
  }

  @Delete('delete/:userId/:fileId')
  async deleteFile(
    @Param('userId') userId: number,
    @Param('fileId') fileId: number,
  ): Promise<{ fileId: number }> {
    try {
      await this.excelService.deleteFile(userId, fileId);
      return { fileId };
    } catch (error) {
      console.error('Error deleting file:', error.message);
      throw new NotFoundException(error.message);
    }
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
