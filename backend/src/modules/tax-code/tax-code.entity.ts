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

@Entity('tax_code')
export class TaxCode {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ description: 'Company ID', example: 1 })
  @Column({ type: 'bigint', name: 'company_id' })
  companyId: number;

  @ApiProperty({ description: 'Tax code', example: 'TVA20', maxLength: 20 })
  @Column({ type: 'varchar', length: 20, name: 'tax_code' })
  taxCode: string;

  @ApiProperty({ description: 'Tax description', example: 'TVA 20%', maxLength: 200 })
  @Column({ type: 'varchar', length: 200, name: 'tax_description' })
  taxDescription: string;

  @ApiProperty({ description: 'Tax rate (percentage)', example: 20.00 })
  @Column({ type: 'decimal', precision: 10, scale: 4, name: 'tax_rate' })
  taxRate: number;

  @ApiProperty({ description: 'Tax type', example: 'VAT', enum: ['VAT', 'SALES_TAX', 'EXCISE', 'OTHER'] })
  @Column({ type: 'varchar', length: 20, name: 'tax_type' })
  taxType: string;

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
