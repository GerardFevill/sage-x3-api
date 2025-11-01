import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating a new currency
 * Validates all required fields with strict rules
 */
export class CreateCurrencyDto {
  @ApiProperty({
    description: 'ISO 4217 currency code (3 uppercase letters)',
    example: 'EUR',
    minLength: 3,
    maxLength: 3,
    pattern: '^[A-Z]{3}$',
  })
  @IsString()
  @IsNotEmpty({ message: 'Currency code is required' })
  @Length(3, 3, { message: 'Currency code must be exactly 3 characters' })
  @Matches(/^[A-Z]{3}$/, {
    message: 'Currency code must be 3 uppercase letters (ISO 4217 format)',
  })
  code: string;

  @ApiProperty({
    description: 'Full name of the currency',
    example: 'Euro',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Currency name is required' })
  @Length(2, 100, {
    message: 'Currency name must be between 2 and 100 characters',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Currency symbol',
    example: '€',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @Length(1, 10, {
    message: 'Currency symbol must be between 1 and 10 characters',
  })
  symbol?: string;

  @ApiPropertyOptional({
    description: 'Number of decimal places for the currency (0-4)',
    example: 2,
    minimum: 0,
    maximum: 4,
    default: 2,
  })
  @IsOptional()
  @IsInt({ message: 'Decimal places must be an integer' })
  @Min(0, { message: 'Decimal places must be at least 0' })
  @Max(4, { message: 'Decimal places must be at most 4' })
  decimalPlaces?: number;

  @ApiPropertyOptional({
    description: 'Whether this currency is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}
