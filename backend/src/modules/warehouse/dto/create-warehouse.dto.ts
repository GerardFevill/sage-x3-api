import { IsString, IsNotEmpty, Length, IsInt, IsPositive, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWarehouseDto {
  @ApiProperty({ description: 'Company ID', example: 1 })
  @IsInt()
  @IsPositive()
  companyId: number;

  @ApiProperty({ description: 'Warehouse code', example: 'WH001', minLength: 1, maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  warehouseCode: string;

  @ApiProperty({ description: 'Warehouse name', example: 'Main Warehouse', minLength: 2, maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  warehouseName: string;

  @ApiPropertyOptional({ description: 'Address', maxLength: 200 })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  address?: string;

  @ApiPropertyOptional({ description: 'City', maxLength: 100 })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  city?: string;

  @ApiPropertyOptional({ description: 'Active status', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
