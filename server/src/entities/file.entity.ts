import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn()
  f_id: number;

  @Column()
  f_name: string;

  @Column()
  f_path: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  f_upload_date: Date;

  @Column({ nullable: true })
  f_last_author: string;

  @Column({ nullable: true })
  f_author: string;

  @Column({ type: 'datetime', nullable: true })
  f_created_date: Date;

  @Column({ type: 'datetime', nullable: true })
  f_modified_date: Date;

  @Column({ nullable: true })
  f_application: string;

  @Column({ nullable: true })
  f_app_version: string;

  @Column({ nullable: true })
  f_doc_security: number;

  @Column({ nullable: true, default: false })
  f_scale_crop: boolean;

  @Column({ nullable: true })
  f_worksheets: number;

  @OneToMany(() => CustomerEntity, (customer) => customer.file)
  f_customers: Relation<CustomerEntity[]>;
}
