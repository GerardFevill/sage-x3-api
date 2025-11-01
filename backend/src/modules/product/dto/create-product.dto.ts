import { IsString, IsNotEmpty, Length, IsInt, IsPositive, IsOptional, IsBoolean, IsIn, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Company ID', example: 1 })
  @IsInt()
  @IsPositive()
  companyId: number;

  @ApiProperty({ description: 'Product code', example: 'PROD001', minLength: 1, maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  productCode: string;

  @ApiProperty({ description: 'Product name', example: 'Laptop Pro', minLength: 2, maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  productName: string;

  @ApiProperty({ description: 'Product type', example: 'GOODS', enum: ['GOODS', 'SERVICE'] })
  @IsString()
  @IsIn(['GOODS', 'SERVICE'])
  productType: string;

  @ApiPropertyOptional({ description: 'Product category', maxLength: 50 })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  productCategory?: string;

  @ApiProperty({ description: 'Unit price', example: 999.99, minimum: 0 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({ description: 'Cost price', example: 600.00, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costPrice?: number;

  @ApiProperty({ description: 'Unit of measure', example: 'EA', minLength: 1, maxLength: 10 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  unitOfMeasure: string;

  @ApiPropertyOptional({ description: 'Track inventory', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;

  @ApiPropertyOptional({ description: 'Active status', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;
}
