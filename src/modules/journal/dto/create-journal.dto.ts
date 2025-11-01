import { IsString, IsNotEmpty, Length, IsInt, IsPositive, IsOptional, IsBoolean, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJournalDto {
  @ApiProperty({ description: 'Company ID', example: 1 })
  @IsInt()
  @IsPositive()
  companyId: number;

  @ApiProperty({ description: 'Journal code', example: 'VE', minLength: 1, maxLength: 10 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  journalCode: string;

  @ApiProperty({ description: 'Journal name', example: 'Ventes', minLength: 2, maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  journalName: string;

  @ApiProperty({
    description: 'Journal type',
    example: 'SALES',
    enum: ['SALES', 'PURCHASE', 'GENERAL', 'CASH', 'BANK'],
  })
  @IsString()
  @IsIn(['SALES', 'PURCHASE', 'GENERAL', 'CASH', 'BANK'])
  journalType: string;

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
