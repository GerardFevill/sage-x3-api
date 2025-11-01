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
 * Account Entity (Chart of Accounts)
 * Represents a general ledger account in the chart of accounts
 * Mapped to the 'account' table created by Liquibase
 */
@Entity('account')
export class Account {
  @ApiProperty({
    description: 'Unique identifier for the account',
    example: 1,
  })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({
    description: 'Company ID this account belongs to',
    example: 1,
  })
  @Column({ type: 'bigint', name: 'company_id' })
  companyId: number;

  @ApiProperty({
    description: 'Chart of accounts ID (optional grouping)',
    example: 1,
    required: false,
  })
  @Column({ type: 'bigint', nullable: true, name: 'chart_of_accounts_id' })
  chartOfAccountsId: number | null;

  @ApiProperty({
    description: 'Account code (unique per company)',
    example: '401000',
    maxLength: 20,
  })
  @Column({ type: 'varchar', length: 20, name: 'account_code' })
  accountCode: string;

  @ApiProperty({
    description: 'Account name',
    example: 'Revenue - Sales',
    maxLength: 200,
  })
  @Column({ type: 'varchar', length: 200, name: 'account_name' })
  accountName: string;

  @ApiProperty({
    description: 'Account type',
    example: 'REVENUE',
    enum: ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'],
  })
  @Column({ type: 'varchar', length: 20, name: 'account_type' })
  accountType: string;

  @ApiProperty({
    description: 'Account category for grouping',
    example: 'SALES',
    maxLength: 50,
    required: false,
  })
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'account_category' })
  accountCategory: string | null;

  @ApiProperty({
    description: 'Parent account ID for hierarchical structure',
    example: 2,
    required: false,
  })
  @Column({ type: 'bigint', nullable: true, name: 'parent_account_id' })
  parentAccountId: number | null;

  @ApiProperty({
    description: 'Normal balance (DEBIT or CREDIT)',
    example: 'CREDIT',
    enum: ['DEBIT', 'CREDIT'],
  })
  @Column({ type: 'varchar', length: 10, name: 'normal_balance' })
  normalBalance: string;

  @ApiProperty({
    description: 'Whether this is a control account',
    example: false,
    default: false,
  })
  @Column({ type: 'boolean', default: false, name: 'is_control_account' })
  isControlAccount: boolean;

  @ApiProperty({
    description: 'Whether posting to this account is allowed',
    example: true,
    default: true,
  })
  @Column({ type: 'boolean', default: true, name: 'allow_posting' })
  allowPosting: boolean;

  @ApiProperty({
    description: 'Whether reconciliation is required for this account',
    example: false,
    default: false,
  })
  @Column({ type: 'boolean', default: false, name: 'require_reconciliation' })
  requireReconciliation: boolean;

  @ApiProperty({
    description: 'Whether this account is active',
    example: true,
    default: true,
  })
  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ApiProperty({
    description: 'Account description',
    example: 'Revenue from product sales',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({
    description: 'Timestamp when the account was created',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the account was last updated',
    example: '2024-01-15T10:30:00Z',
  })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    description: 'ID of user who created this account',
    example: 1,
    required: false,
  })
  @Column({ type: 'bigint', nullable: true, name: 'created_by' })
  createdBy: number | null;

  @ApiProperty({
    description: 'ID of user who last updated this account',
    example: 1,
    required: false,
  })
  @Column({ type: 'bigint', nullable: true, name: 'updated_by' })
  updatedBy: number | null;

  // Relations
  @ApiProperty({
    description: 'Company this account belongs to',
    type: () => Company,
  })
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  // Self-referencing relation for parent account
  @ApiProperty({
    description: 'Parent account for hierarchical structure',
    type: () => Account,
    required: false,
  })
  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn({ name: 'parent_account_id' })
  parentAccount: Account | null;

  // Additional relations can be added later:
  // @OneToMany(() => Account, account => account.parentAccount)
  // childAccounts: Account[];
  //
  // @OneToMany(() => GLTransactionLine, line => line.account)
  // transactionLines: GLTransactionLine[];
}
