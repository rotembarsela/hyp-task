import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'u_id' })
  id: number;

  @Column({ name: 'u_token', type: 'varchar', length: 255 })
  token: string;

  @Column({ name: 'u_name', type: 'varchar', length: 255 })
  name: string;
}
