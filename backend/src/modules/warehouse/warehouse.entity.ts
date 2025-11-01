import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../company/company.entity';

@Entity('warehouse')
export class Warehouse {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ description: 'Company ID', example: 1 })
  @Column({ type: 'bigint', name: 'company_id' })
  companyId: number;

  @ApiProperty({ description: 'Warehouse code', example: 'WH001', maxLength: 20 })
  @Column({ type: 'varchar', length: 20, name: 'warehouse_code' })
  warehouseCode: string;

  @ApiProperty({ description: 'Warehouse name', example: 'Main Warehouse', maxLength: 200 })
  @Column({ type: 'varchar', length: 200, name: 'warehouse_name' })
  warehouseName: string;

  @ApiProperty({ description: 'Address', maxLength: 200, required: false })
  @Column({ type: 'varchar', length: 200, nullable: true })
  address: string | null;

  @ApiProperty({ description: 'City', maxLength: 100, required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @ApiProperty({ description: 'Active status', example: true, default: true })
  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'bigint', nullable: true, name: 'created_by' })
  createdBy: number | null;

  @Column({ type: 'bigint', nullable: true, name: 'updated_by' })
  updatedBy: number | null;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
