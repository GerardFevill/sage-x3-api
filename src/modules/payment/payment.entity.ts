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
import { Invoice } from '../invoice/invoice.entity';

@Entity('payment')
export class Payment {
  @ApiProperty({ example: 1, description: 'Unique payment ID' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ example: 1, description: 'Company ID' })
  @Column({ type: 'bigint', name: 'company_id' })
  companyId: number;

  @ApiProperty({ example: 'PAY-2025-001', description: 'Payment number' })
  @Column({ type: 'varchar', length: 50, name: 'payment_number' })
  paymentNumber: string;

  @ApiProperty({ example: 'RECEIVED', description: 'Payment type' })
  @Column({ type: 'varchar', length: 20, name: 'payment_type' })
  paymentType: string;

  @ApiProperty({ example: 1, description: 'Business partner ID' })
  @Column({ type: 'bigint', name: 'business_partner_id' })
  businessPartnerId: number;

  @ApiProperty({ example: 1, description: 'Invoice ID', required: false })
  @Column({ type: 'bigint', nullable: true, name: 'invoice_id' })
  invoiceId: number;

  @ApiProperty({ example: '2025-01-20', description: 'Payment date' })
  @Column({ type: 'date', name: 'payment_date' })
  paymentDate: Date;

  @ApiProperty({ example: 1, description: 'Currency ID' })
  @Column({ type: 'bigint', name: 'currency_id' })
  currencyId: number;

  @ApiProperty({ example: 1.0, description: 'Exchange rate' })
  @Column({ type: 'decimal', precision: 15, scale: 6, name: 'exchange_rate', default: 1.0 })
  exchangeRate: number;

  @ApiProperty({ example: 500.00, description: 'Payment amount' })
  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'amount' })
  amount: number;

  @ApiProperty({ example: 'BANK_TRANSFER', description: 'Payment method' })
  @Column({ type: 'varchar', length: 50, name: 'payment_method' })
  paymentMethod: string;

  @ApiProperty({ example: 'REF123456', description: 'Payment reference' })
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'reference' })
  reference: string;

  @ApiProperty({ example: 'Payment received', description: 'Notes' })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty({ example: 'COMPLETED', description: 'Payment status' })
  @Column({ type: 'varchar', length: 20, name: 'status', default: 'PENDING' })
  status: string;

  @ApiProperty({ example: true, description: 'Is active flag' })
  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00Z', description: 'Creation timestamp' })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-20T10:30:00Z', description: 'Last update timestamp' })
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

  @ManyToOne(() => Invoice, { nullable: true })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;
}
