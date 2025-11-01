import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Currency Entity
 * Represents a currency in the multi-currency ERP system
 * Mapped to the 'currency' table created by Liquibase
 */
@Entity('currency')
export class Currency {
  @ApiProperty({
    description: 'Unique identifier for the currency',
    example: 1,
  })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({
    description: 'ISO 4217 currency code (3 uppercase letters)',
    example: 'EUR',
    maxLength: 3,
  })
  @Column({ type: 'varchar', length: 3, unique: true })
  code: string;

  @ApiProperty({
    description: 'Full name of the currency',
    example: 'Euro',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({
    description: 'Currency symbol',
    example: '€',
    maxLength: 10,
    required: false,
  })
  @Column({ type: 'varchar', length: 10, nullable: true })
  symbol: string | null;

  @ApiProperty({
    description: 'Number of decimal places for the currency',
    example: 2,
    minimum: 0,
    maximum: 4,
  })
  @Column({ type: 'smallint', default: 2, name: 'decimal_places' })
  decimalPlaces: number;

  @ApiProperty({
    description: 'Whether this currency is active in the system',
    example: true,
    default: true,
  })
  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ApiProperty({
    description: 'Timestamp when the currency was created',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the currency was last updated',
    example: '2024-01-15T10:30:00Z',
  })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    description: 'ID of user who created this currency',
    example: 1,
    required: false,
  })
  @Column({ type: 'bigint', nullable: true, name: 'created_by' })
  createdBy: number | null;

  @ApiProperty({
    description: 'ID of user who last updated this currency',
    example: 1,
    required: false,
  })
  @Column({ type: 'bigint', nullable: true, name: 'updated_by' })
  updatedBy: number | null;

  // Relations can be added later:
  // @OneToMany(() => ExchangeRate, exchangeRate => exchangeRate.fromCurrency)
  // exchangeRatesFrom: ExchangeRate[];
  //
  // @OneToMany(() => ExchangeRate, exchangeRate => exchangeRate.toCurrency)
  // exchangeRatesTo: ExchangeRate[];
  //
  // @OneToMany(() => Company, company => company.defaultCurrency)
  // companies: Company[];
}
