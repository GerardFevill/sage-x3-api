import { IsInt, IsPositive, IsString, IsNotEmpty, Length, IsDateString, IsNumber, IsOptional, IsIn, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty({ example: 1, description: 'Company ID' })
  @IsInt()
  @IsPositive()
  companyId: number;

  @ApiProperty({ example: 'INV-2025-001', description: 'Invoice number' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  invoiceNumber: string;

  @ApiProperty({ example: 'SALES', description: 'Invoice type (SALES, PURCHASE, CREDIT_NOTE, DEBIT_NOTE)' })
  @IsString()
  @IsIn(['SALES', 'PURCHASE', 'CREDIT_NOTE', 'DEBIT_NOTE'])
  invoiceType: string;

  @ApiProperty({ example: 1, description: 'Business partner ID' })
  @IsInt()
  @IsPositive()
  businessPartnerId: number;

  @ApiProperty({ example: '2025-01-15', description: 'Invoice date (ISO 8601)' })
  @IsDateString()
  invoiceDate: string;

  @ApiProperty({ example: '2025-02-15', description: 'Due date (ISO 8601)' })
  @IsDateString()
  dueDate: string;

  @ApiProperty({ example: 1, description: 'Currency ID' })
  @IsInt()
  @IsPositive()
  currencyId: number;

  @ApiProperty({ example: 1.0, description: 'Exchange rate', required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  exchangeRate?: number;

  @ApiProperty({ example: 1000.00, description: 'Total amount before tax' })
  @IsNumber()
  @Min(0)
  totalBeforeTax: number;

  @ApiProperty({ example: 200.00, description: 'Total tax amount', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalTax?: number;

  @ApiProperty({ example: 1200.00, description: 'Total amount including tax' })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({ example: 1, description: 'Fiscal year ID' })
  @IsInt()
  @IsPositive()
  fiscalYearId: number;

  @ApiProperty({ example: 'Invoice for services', description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'PO-12345', description: 'Purchase order reference', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  poReference?: string;
}
