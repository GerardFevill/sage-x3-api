import { IsString, IsNotEmpty, Length, IsInt, IsPositive, IsOptional, IsBoolean, IsIn, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBusinessPartnerDto {
  @ApiProperty({ description: 'Company ID', example: 1 })
  @IsInt()
  @IsPositive()
  companyId: number;

  @ApiProperty({ description: 'Partner code', example: 'CLI001', minLength: 1, maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  partnerCode: string;

  @ApiProperty({ description: 'Partner name', example: 'ACME Corp', minLength: 2, maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  partnerName: string;

  @ApiProperty({ description: 'Partner type', example: 'CUSTOMER', enum: ['CUSTOMER', 'SUPPLIER', 'BOTH'] })
  @IsString()
  @IsIn(['CUSTOMER', 'SUPPLIER', 'BOTH'])
  partnerType: string;

  @ApiPropertyOptional({ description: 'Tax ID', maxLength: 50 })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  taxId?: string;

  @ApiPropertyOptional({ description: 'Email', maxLength: 100 })
  @IsOptional()
  @IsEmail()
  @Length(0, 100)
  email?: string;

  @ApiPropertyOptional({ description: 'Phone', maxLength: 20 })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  phone?: string;

  @ApiPropertyOptional({ description: 'Active status', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
