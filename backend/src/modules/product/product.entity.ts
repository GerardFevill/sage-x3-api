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

@Entity('product')
export class Product {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ description: 'Company ID', example: 1 })
  @Column({ type: 'bigint', name: 'company_id' })
  companyId: number;

  @ApiProperty({ description: 'Product code', example: 'PROD001', maxLength: 50 })
  @Column({ type: 'varchar', length: 50, name: 'product_code' })
  productCode: string;

  @ApiProperty({ description: 'Product name', example: 'Laptop Pro', maxLength: 200 })
  @Column({ type: 'varchar', length: 200, name: 'product_name' })
  productName: string;

  @ApiProperty({ description: 'Product type', example: 'GOODS', enum: ['GOODS', 'SERVICE'] })
  @Column({ type: 'varchar', length: 20, name: 'product_type' })
  productType: string;

  @ApiProperty({ description: 'Product category', maxLength: 50, required: false })
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'product_category' })
  productCategory: string | null;

  @ApiProperty({ description: 'Unit price', example: 999.99 })
  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'unit_price' })
  unitPrice: number;

  @ApiProperty({ description: 'Cost price', example: 600.00, required: false })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'cost_price' })
  costPrice: number | null;

  @ApiProperty({ description: 'Unit of measure', example: 'EA', maxLength: 10 })
  @Column({ type: 'varchar', length: 10, name: 'unit_of_measure' })
  unitOfMeasure: string;

  @ApiProperty({ description: 'Track inventory', example: true, default: true })
  @Column({ type: 'boolean', default: true, name: 'track_inventory' })
  trackInventory: boolean;

  @ApiProperty({ description: 'Active status', example: true, default: true })
  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ApiProperty({ description: 'Description', required: false })
  @Column({ type: 'text', nullable: true })
  description: string | null;

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
