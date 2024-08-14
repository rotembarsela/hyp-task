import { Controller, Get, Param, Delete } from '@nestjs/common';
import { ExcelService } from './excel.service';

@Controller('excels')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Get('list/:folder')
  listFiles(@Param('folder') folder: 'uploads' | 'pending'): string[] {
    return this.excelService.listFiles(folder);
  }

  @Get('read/:folder/:filename')
  readFile(
    @Param('folder') folder: 'uploads' | 'pending',
    @Param('filename') filename: string,
  ): string {
    return this.excelService.readFile(folder, filename);
  }

  @Delete('delete/:folder/:filename')
  deleteFile(
    @Param('folder') folder: 'uploads' | 'pending',
    @Param('filename') filename: string,
  ): void {
    this.excelService.deleteFile(folder, filename);
  }
}
