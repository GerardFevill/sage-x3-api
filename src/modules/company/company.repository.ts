import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Company } from './company.entity';

/**
 * Company Repository
 * Centralizes all database queries for Company entity
 * Extends TypeORM Repository with custom query methods
 */
@Injectable()
export class CompanyRepository extends Repository<Company> {
  constructor(private dataSource: DataSource) {
    super(Company, dataSource.createEntityManager());
  }

  /**
   * Find all active companies
   */
  async findActive(): Promise<Company[]> {
    return this.find({
      where: { isActive: true },
      order: { code: 'ASC' },
    });
  }

  /**
   * Find company by code
   */
  async findByCode(code: string): Promise<Company | null> {
    return this.findOne({ where: { code } });
  }

  /**
   * Check if company code exists
   */
  async codeExists(code: string, excludeId?: number): Promise<boolean> {
    const query = this.createQueryBuilder('company').where(
      'company.code = :code',
      { code },
    );

    if (excludeId) {
      query.andWhere('company.id != :excludeId', { excludeId });
    }

    const count = await query.getCount();
    return count > 0;
  }

  /**
   * Find companies by country
   */
  async findByCountry(countryCode: string): Promise<Company[]> {
    return this.find({
      where: { countryCode, isActive: true },
      order: { name: 'ASC' },
    });
  }

  /**
   * Find company with full details including relations
   * (will be expanded as we add Currency and other related entities)
   */
  async findOneWithRelations(id: number): Promise<Company | null> {
    return this.findOne({
      where: { id },
      // relations: ['defaultCurrency', 'fiscalYears'], // Will be added later
    });
  }

  /**
   * Soft delete (set isActive to false instead of deleting)
   */
  async customSoftDelete(id: number): Promise<void> {
    await this.update(id, { isActive: false });
  }

  /**
   * Search companies by name or code
   */
  async search(query: string): Promise<Company[]> {
    return this.createQueryBuilder('company')
      .where('company.code ILIKE :query OR company.name ILIKE :query', {
        query: `%${query}%`,
      })
      .andWhere('company.isActive = :isActive', { isActive: true })
      .orderBy('company.name', 'ASC')
      .getMany();
  }
}
