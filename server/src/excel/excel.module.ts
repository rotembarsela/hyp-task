import { Module } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/entities/file.entity';
import { CustomerEntity } from 'src/entities/customer.entity';
import { UserModule } from 'src/user/user.module';
import { ExcelController } from './excel.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity, CustomerEntity]), UserModule],
  controllers: [ExcelController],
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule {}
