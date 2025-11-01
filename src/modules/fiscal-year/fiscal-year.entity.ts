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

/**
 * Fiscal Year Entity
 * Represents an accounting period for a company
 * Mapped to the 'fiscal_year' table created by Liquibase
 */
@Entity('fiscal_year')
export class FiscalYear {
  @ApiProperty({
    description: 'Unique identifier for the fiscal year',
    example: 1,
  })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({
    description: 'Company ID this fiscal year belongs to',
    example: 1,
  })
  @Column({ type: 'bigint', name: 'company_id' })
  companyId: number;

  @ApiProperty({
    description: 'Fiscal year code (unique per company)',
    example: 'FY2024',
    maxLength: 10,
  })
  @Column({ type: 'varchar', length: 10 })
  code: string;

  @ApiProperty({
    description: 'Full name of the fiscal year',
    example: 'Fiscal Year 2024',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({
    description: 'Start date of the fiscal year',
    example: '2024-01-01',
  })
  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @ApiProperty({
    description: 'End date of the fiscal year',
    example: '2024-12-31',
  })
  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @ApiProperty({
    description: 'Whether this fiscal year is currently active',
    example: true,
    default: true,
  })
  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether this fiscal year is closed (no more entries allowed)',
    example: false,
    default: false,
  })
  @Column({ type: 'boolean', default: false, name: 'is_closed' })
  isClosed: boolean;

  @ApiProperty({
    description: 'Date when the fiscal year was closed',
    example: '2025-01-31',
    required: false,
  })
  @Column({ type: 'date', nullable: true, name: 'closed_date' })
  closedDate: Date | null;

  @ApiProperty({
    description: 'Number of periods in this fiscal year',
    example: 12,
  })
  @Column({ type: 'smallint', default: 12, name: 'number_of_periods' })
  numberOfPeriods: number;

  @ApiProperty({
    description: 'Timestamp when the fiscal year was created',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the fiscal year was last updated',
    example: '2024-01-15T10:30:00Z',
  })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    description: 'ID of user who created this fiscal year',
    example: 1,
    required: false,
  })
  @Column({ type: 'bigint', nullable: true, name: 'created_by' })
  createdBy: number | null;

  @ApiProperty({
    description: 'ID of user who last updated this fiscal year',
    example: 1,
    required: false,
  })
  @Column({ type: 'bigint', nullable: true, name: 'updated_by' })
  updatedBy: number | null;

  // Relations
  @ApiProperty({
    description: 'Company this fiscal year belongs to',
    type: () => Company,
  })
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  // Additional relations can be added later:
  // @OneToMany(() => GLTransaction, transaction => transaction.fiscalYear)
  // transactions: GLTransaction[];
}
