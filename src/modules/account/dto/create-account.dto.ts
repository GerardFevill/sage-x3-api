import {
  IsString,
  IsNotEmpty,
  Length,
  IsInt,
  IsPositive,
  IsOptional,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating a new account
 * Validates all required fields with strict rules
 */
export class CreateAccountDto {
  @ApiProperty({
    description: 'Company ID this account belongs to',
    example: 1,
  })
  @IsInt({ message: 'Company ID must be an integer' })
  @IsPositive({ message: 'Company ID must be positive' })
  companyId: number;

  @ApiPropertyOptional({
    description: 'Chart of accounts ID',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Chart of accounts ID must be an integer' })
  @IsPositive({ message: 'Chart of accounts ID must be positive' })
  chartOfAccountsId?: number;

  @ApiProperty({
    description: 'Account code (unique per company)',
    example: '401000',
    minLength: 1,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty({ message: 'Account code is required' })
  @Length(1, 20, {
    message: 'Account code must be between 1 and 20 characters',
  })
  accountCode: string;

  @ApiProperty({
    description: 'Account name',
    example: 'Revenue - Sales',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty({ message: 'Account name is required' })
  @Length(2, 200, {
    message: 'Account name must be between 2 and 200 characters',
  })
  accountName: string;

  @ApiProperty({
    description: 'Account type',
    example: 'REVENUE',
    enum: ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'],
  })
  @IsString()
  @IsIn(['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'], {
    message:
      'Account type must be one of: ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE',
  })
  accountType: string;

  @ApiPropertyOptional({
    description: 'Account category for grouping',
    example: 'SALES',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50, {
    message: 'Account category must be between 1 and 50 characters',
  })
  accountCategory?: string;

  @ApiPropertyOptional({
    description: 'Parent account ID for hierarchical structure',
    example: 2,
  })
  @IsOptional()
  @IsInt({ message: 'Parent account ID must be an integer' })
  @IsPositive({ message: 'Parent account ID must be positive' })
  parentAccountId?: number;

  @ApiProperty({
    description: 'Normal balance (DEBIT or CREDIT)',
    example: 'CREDIT',
    enum: ['DEBIT', 'CREDIT'],
  })
  @IsString()
  @IsIn(['DEBIT', 'CREDIT'], {
    message: 'Normal balance must be either DEBIT or CREDIT',
  })
  normalBalance: string;

  @ApiPropertyOptional({
    description: 'Whether this is a control account',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isControlAccount must be a boolean' })
  isControlAccount?: boolean;

  @ApiPropertyOptional({
    description: 'Whether posting to this account is allowed',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'allowPosting must be a boolean' })
  allowPosting?: boolean;

  @ApiPropertyOptional({
    description: 'Whether reconciliation is required for this account',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'requireReconciliation must be a boolean' })
  requireReconciliation?: boolean;

  @ApiPropertyOptional({
    description: 'Whether this account is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Account description',
    example: 'Revenue from product sales',
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000, {
    message: 'Description must be at most 1000 characters',
  })
  description?: string;
}
