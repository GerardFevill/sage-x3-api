import { IsInt, IsPositive, IsString, IsNotEmpty, Length, IsDateString, IsNumber, IsOptional, IsIn, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 1, description: 'Company ID' })
  @IsInt()
  @IsPositive()
  companyId: number;

  @ApiProperty({ example: 'PAY-2025-001', description: 'Payment number' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  paymentNumber: string;

  @ApiProperty({ example: 'RECEIVED', description: 'Payment type (RECEIVED, SENT)' })
  @IsString()
  @IsIn(['RECEIVED', 'SENT'])
  paymentType: string;

  @ApiProperty({ example: 1, description: 'Business partner ID' })
  @IsInt()
  @IsPositive()
  businessPartnerId: number;

  @ApiProperty({ example: 1, description: 'Invoice ID', required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  invoiceId?: number;

  @ApiProperty({ example: '2025-01-20', description: 'Payment date (ISO 8601)' })
  @IsDateString()
  paymentDate: string;

  @ApiProperty({ example: 1, description: 'Currency ID' })
  @IsInt()
  @IsPositive()
  currencyId: number;

  @ApiProperty({ example: 1.0, description: 'Exchange rate', required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  exchangeRate?: number;

  @ApiProperty({ example: 500.00, description: 'Payment amount' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'BANK_TRANSFER', description: 'Payment method (CASH, BANK_TRANSFER, CHECK, CREDIT_CARD, OTHER)' })
  @IsString()
  @IsIn(['CASH', 'BANK_TRANSFER', 'CHECK', 'CREDIT_CARD', 'OTHER'])
  paymentMethod: string;

  @ApiProperty({ example: 'REF123456', description: 'Payment reference', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  reference?: string;

  @ApiProperty({ example: 'Payment received for invoice INV-2025-001', description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
