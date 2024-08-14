import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('excel_files')
export class ExcelFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  folder: string; // 'uploads' or 'pending'

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;
}
