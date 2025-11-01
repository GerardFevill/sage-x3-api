import { IsString, IsNotEmpty, Length, IsInt, IsPositive, IsOptional, IsBoolean, IsIn, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaxCodeDto {
  @ApiProperty({ description: 'Company ID', example: 1 })
  @IsInt()
  @IsPositive()
  companyId: number;

  @ApiProperty({ description: 'Tax code', example: 'TVA20', minLength: 1, maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  taxCode: string;

  @ApiProperty({ description: 'Tax description', example: 'TVA 20%', minLength: 2, maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  taxDescription: string;

  @ApiProperty({ description: 'Tax rate (percentage)', example: 20.00, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0, { message: 'Tax rate must be at least 0' })
  @Max(100, { message: 'Tax rate must be at most 100' })
  taxRate: number;

  @ApiProperty({ description: 'Tax type', example: 'VAT', enum: ['VAT', 'SALES_TAX', 'EXCISE', 'OTHER'] })
  @IsString()
  @IsIn(['VAT', 'SALES_TAX', 'EXCISE', 'OTHER'])
  taxType: string;

  @ApiPropertyOptional({ description: 'Active status', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
