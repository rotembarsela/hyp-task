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

  @OneToMany(() => CustomerEntity, (customer) => customer.file)
  customers: Relation<CustomerEntity[]>;
}
