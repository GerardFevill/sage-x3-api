import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  IsBoolean,
  Matches,
  IsNumber,
} from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Unique company code',
    example: 'FR01',
    minLength: 2,
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 10)
  @Matches(/^[A-Z0-9]+$/, {
    message: 'Code must contain only uppercase letters and numbers',
  })
  code: string;

  @ApiProperty({
    description: 'Company name',
    example: 'ACME France SAS',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiPropertyOptional({
    description: 'Legal company name',
    example: 'ACME France Société par Actions Simplifiée',
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  @Length(2, 200)
  legalName?: string;

  @ApiPropertyOptional({
    description: 'Tax identification number (SIRET, VAT, etc.)',
    example: '12345678901234',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @Length(0, 50)
  taxId?: string;

  @ApiPropertyOptional({
    description: 'Registration number (RCS, etc.)',
    example: '123 456 789 RCS Paris',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @Length(0, 50)
  registrationNumber?: string;

  @ApiPropertyOptional({
    description: 'Address line 1',
    example: '123 Avenue des Champs-Élysées',
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  addressLine1?: string;

  @ApiPropertyOptional({
    description: 'Address line 2',
    example: 'Bâtiment A',
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  addressLine2?: string;

  @ApiPropertyOptional({
    description: 'City',
    example: 'Paris',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @Length(0, 100)
  city?: string;

  @ApiPropertyOptional({
    description: 'State or province',
    example: 'Île-de-France',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @Length(0, 100)
  stateProvince?: string;

  @ApiPropertyOptional({
    description: 'Postal code',
    example: '75008',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @Length(0, 20)
  postalCode?: string;

  @ApiPropertyOptional({
    description: 'Country code (ISO 3166-1 alpha-2)',
    example: 'FR',
    minLength: 2,
    maxLength: 2,
  })
  @IsString()
  @IsOptional()
  @Length(2, 2)
  @Matches(/^[A-Z]{2}$/, {
    message: 'Country code must be 2 uppercase letters (ISO 3166-1 alpha-2)',
  })
  countryCode?: string;

  @ApiPropertyOptional({
    description: 'Default currency ID',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  defaultCurrencyId?: number;

  @ApiPropertyOptional({
    description: 'Is company active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
