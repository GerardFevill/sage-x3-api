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

@Entity('journal')
export class Journal {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ description: 'Company ID', example: 1 })
  @Column({ type: 'bigint', name: 'company_id' })
  companyId: number;

  @ApiProperty({ description: 'Journal code', example: 'VE', maxLength: 10 })
  @Column({ type: 'varchar', length: 10, name: 'journal_code' })
  journalCode: string;

  @ApiProperty({ description: 'Journal name', example: 'Ventes', maxLength: 100 })
  @Column({ type: 'varchar', length: 100, name: 'journal_name' })
  journalName: string;

  @ApiProperty({
    description: 'Journal type',
    example: 'SALES',
    enum: ['SALES', 'PURCHASE', 'GENERAL', 'CASH', 'BANK'],
  })
  @Column({ type: 'varchar', length: 20, name: 'journal_type' })
  journalType: string;

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
