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

@Entity('business_partner')
export class BusinessPartner {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ description: 'Company ID', example: 1 })
  @Column({ type: 'bigint', name: 'company_id' })
  companyId: number;

  @ApiProperty({ description: 'Partner code', example: 'CLI001', maxLength: 20 })
  @Column({ type: 'varchar', length: 20, name: 'partner_code' })
  partnerCode: string;

  @ApiProperty({ description: 'Partner name', example: 'ACME Corp', maxLength: 200 })
  @Column({ type: 'varchar', length: 200, name: 'partner_name' })
  partnerName: string;

  @ApiProperty({ description: 'Partner type', example: 'CUSTOMER', enum: ['CUSTOMER', 'SUPPLIER', 'BOTH'] })
  @Column({ type: 'varchar', length: 20, name: 'partner_type' })
  partnerType: string;

  @ApiProperty({ description: 'Tax ID', maxLength: 50, required: false })
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'tax_id' })
  taxId: string | null;

  @ApiProperty({ description: 'Email', maxLength: 100, required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string | null;

  @ApiProperty({ description: 'Phone', maxLength: 20, required: false })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

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
