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
import { BusinessPartner } from '../business-partner/business-partner.entity';
import { Currency } from '../currency/currency.entity';
import { FiscalYear } from '../fiscal-year/fiscal-year.entity';

@Entity('invoice')
export class Invoice {
  @ApiProperty({ example: 1, description: 'Unique invoice ID' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ example: 1, description: 'Company ID' })
  @Column({ type: 'bigint', name: 'company_id' })
  companyId: number;

  @ApiProperty({ example: 'INV-2025-001', description: 'Invoice number' })
  @Column({ type: 'varchar', length: 50, name: 'invoice_number' })
  invoiceNumber: string;

  @ApiProperty({ example: 'SALES', description: 'Invoice type' })
  @Column({ type: 'varchar', length: 20, name: 'invoice_type' })
  invoiceType: string;

  @ApiProperty({ example: 1, description: 'Business partner ID' })
  @Column({ type: 'bigint', name: 'business_partner_id' })
  businessPartnerId: number;

  @ApiProperty({ example: '2025-01-15', description: 'Invoice date' })
  @Column({ type: 'date', name: 'invoice_date' })
  invoiceDate: Date;

  @ApiProperty({ example: '2025-02-15', description: 'Due date' })
  @Column({ type: 'date', name: 'due_date' })
  dueDate: Date;

  @ApiProperty({ example: 1, description: 'Currency ID' })
  @Column({ type: 'bigint', name: 'currency_id' })
  currencyId: number;

  @ApiProperty({ example: 1.0, description: 'Exchange rate' })
  @Column({ type: 'decimal', precision: 15, scale: 6, name: 'exchange_rate', default: 1.0 })
  exchangeRate: number;

  @ApiProperty({ example: 1000.00, description: 'Total amount before tax' })
  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'total_before_tax' })
  totalBeforeTax: number;

  @ApiProperty({ example: 200.00, description: 'Total tax amount' })
  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'total_tax', default: 0 })
  totalTax: number;

  @ApiProperty({ example: 1200.00, description: 'Total amount including tax' })
  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @ApiProperty({ example: 0.00, description: 'Amount already paid' })
  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'paid_amount', default: 0 })
  paidAmount: number;

  @ApiProperty({ example: 1200.00, description: 'Remaining balance' })
  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'balance', default: 0 })
  balance: number;

  @ApiProperty({ example: 'DRAFT', description: 'Invoice status' })
  @Column({ type: 'varchar', length: 20, name: 'status', default: 'DRAFT' })
  status: string;

  @ApiProperty({ example: 1, description: 'Fiscal year ID' })
  @Column({ type: 'bigint', name: 'fiscal_year_id' })
  fiscalYearId: number;

  @ApiProperty({ example: 'Invoice for services', description: 'Notes' })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty({ example: 'PO-12345', description: 'Purchase order reference' })
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'po_reference' })
  poReference: string;

  @ApiProperty({ example: true, description: 'Is active flag' })
  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00Z', description: 'Creation timestamp' })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-15T10:30:00Z', description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'bigint', nullable: true, name: 'created_by' })
  createdBy: number;

  @Column({ type: 'bigint', nullable: true, name: 'updated_by' })
  updatedBy: number;

  @ManyToOne(() => Company, { nullable: false })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => BusinessPartner, { nullable: false })
  @JoinColumn({ name: 'business_partner_id' })
  businessPartner: BusinessPartner;

  @ManyToOne(() => Currency, { nullable: false })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @ManyToOne(() => FiscalYear, { nullable: false })
  @JoinColumn({ name: 'fiscal_year_id' })
  fiscalYear: FiscalYear;
}
