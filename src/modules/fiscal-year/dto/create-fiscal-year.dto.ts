import {
  IsString,
  IsNotEmpty,
  Length,
  IsInt,
  IsPositive,
  IsOptional,
  IsBoolean,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating a new fiscal year
 * Validates all required fields with strict rules
 */
export class CreateFiscalYearDto {
  @ApiProperty({
    description: 'Company ID this fiscal year belongs to',
    example: 1,
  })
  @IsInt({ message: 'Company ID must be an integer' })
  @IsPositive({ message: 'Company ID must be positive' })
  companyId: number;

  @ApiProperty({
    description: 'Fiscal year code (unique per company)',
    example: 'FY2024',
    minLength: 2,
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty({ message: 'Fiscal year code is required' })
  @Length(2, 10, {
    message: 'Fiscal year code must be between 2 and 10 characters',
  })
  code: string;

  @ApiProperty({
    description: 'Full name of the fiscal year',
    example: 'Fiscal Year 2024',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Fiscal year name is required' })
  @Length(2, 100, {
    message: 'Fiscal year name must be between 2 and 100 characters',
  })
  name: string;

  @ApiProperty({
    description: 'Start date of the fiscal year (ISO 8601 format)',
    example: '2024-01-01',
  })
  @IsDateString(
    {},
    {
      message: 'Start date must be a valid ISO 8601 date string (YYYY-MM-DD)',
    },
  )
  startDate: string;

  @ApiProperty({
    description: 'End date of the fiscal year (ISO 8601 format)',
    example: '2024-12-31',
  })
  @IsDateString(
    {},
    {
      message: 'End date must be a valid ISO 8601 date string (YYYY-MM-DD)',
    },
  )
  endDate: string;

  @ApiPropertyOptional({
    description: 'Number of periods in this fiscal year',
    example: 12,
    minimum: 1,
    maximum: 24,
    default: 12,
  })
  @IsOptional()
  @IsInt({ message: 'Number of periods must be an integer' })
  @Min(1, { message: 'Number of periods must be at least 1' })
  @Max(24, { message: 'Number of periods must be at most 24' })
  numberOfPeriods?: number;

  @ApiPropertyOptional({
    description: 'Whether this fiscal year is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}
