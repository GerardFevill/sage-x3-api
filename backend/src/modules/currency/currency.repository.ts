import { Injectable } from '@nestjs/common';
import { DataSource, Repository, Like } from 'typeorm';
import { Currency } from './currency.entity';

/**
 * Custom repository for Currency entity
 * Extends TypeORM Repository with domain-specific methods
 */
@Injectable()
export class CurrencyRepository extends Repository<Currency> {
  constructor(private dataSource: DataSource) {
    super(Currency, dataSource.createEntityManager());
  }

  /**
   * Find all active currencies
   * @returns Array of active currencies ordered by code
   */
  async findActive(): Promise<Currency[]> {
    return this.find({
      where: { isActive: true },
      order: { code: 'ASC' },
    });
  }

  /**
   * Find a currency by its ISO 4217 code
   * @param code - Currency code (e.g., 'EUR', 'USD')
   * @returns Currency if found, null otherwise
   */
  async findByCode(code: string): Promise<Currency | null> {
    return this.findOne({
      where: { code: code.toUpperCase() },
    });
  }

  /**
   * Check if a currency code already exists
   * @param code - Currency code to check
   * @param excludeId - Optional ID to exclude from check (for updates)
   * @returns True if code exists, false otherwise
   */
  async codeExists(code: string, excludeId?: number): Promise<boolean> {
    const query = this.createQueryBuilder('currency').where(
      'UPPER(currency.code) = UPPER(:code)',
      { code },
    );

    if (excludeId) {
      query.andWhere('currency.id != :excludeId', { excludeId });
    }

    const count = await query.getCount();
    return count > 0;
  }

  /**
   * Search currencies by code or name
   * @param query - Search string (min 2 characters)
   * @returns Array of matching currencies
   */
  async search(query: string): Promise<Currency[]> {
    return this.find({
      where: [
        { code: Like(`%${query.toUpperCase()}%`) },
        { name: Like(`%${query}%`) },
      ],
      order: { code: 'ASC' },
    });
  }

  /**
   * Soft delete a currency by setting isActive to false
   * @param id - Currency ID
   */
  async softDelete(id: number): Promise<void> {
    await this.update(id, { isActive: false });
  }

  /**
   * Get currencies by decimal places
   * @param decimalPlaces - Number of decimal places (0-4)
   * @returns Array of currencies with specified decimal places
   */
  async findByDecimalPlaces(decimalPlaces: number): Promise<Currency[]> {
    return this.find({
      where: { decimalPlaces },
      order: { code: 'ASC' },
    });
  }

  /**
   * Find a currency with all its relations
   * @param id - Currency ID
   * @returns Currency with relations if found, null otherwise
   */
  async findOneWithRelations(id: number): Promise<Currency | null> {
    return this.findOne({
      where: { id },
      // Relations can be added when ExchangeRate and Company modules are created:
      // relations: ['exchangeRatesFrom', 'exchangeRatesTo', 'companies'],
    });
  }
}
