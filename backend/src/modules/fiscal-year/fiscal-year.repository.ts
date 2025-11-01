import { Injectable } from '@nestjs/common';
import { DataSource, Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { FiscalYear } from './fiscal-year.entity';

/**
 * Custom repository for FiscalYear entity
 * Extends TypeORM Repository with domain-specific methods
 */
@Injectable()
export class FiscalYearRepository extends Repository<FiscalYear> {
  constructor(private dataSource: DataSource) {
    super(FiscalYear, dataSource.createEntityManager());
  }

  /**
   * Find all fiscal years for a specific company
   * @param companyId - Company ID
   * @returns Array of fiscal years ordered by start date
   */
  async findByCompany(companyId: number): Promise<FiscalYear[]> {
    return this.find({
      where: { companyId },
      order: { startDate: 'DESC' },
    });
  }

  /**
   * Find active fiscal years for a company
   * @param companyId - Company ID
   * @returns Array of active fiscal years
   */
  async findActiveByCompany(companyId: number): Promise<FiscalYear[]> {
    return this.find({
      where: { companyId, isActive: true },
      order: { startDate: 'DESC' },
    });
  }

  /**
   * Find a fiscal year by code within a company
   * @param companyId - Company ID
   * @param code - Fiscal year code
   * @returns Fiscal year if found, null otherwise
   */
  async findByCompanyAndCode(
    companyId: number,
    code: string,
  ): Promise<FiscalYear | null> {
    return this.findOne({
      where: { companyId, code },
    });
  }

  /**
   * Check if a fiscal year code already exists for a company
   * @param companyId - Company ID
   * @param code - Fiscal year code to check
   * @param excludeId - Optional ID to exclude from check (for updates)
   * @returns True if code exists, false otherwise
   */
  async codeExistsForCompany(
    companyId: number,
    code: string,
    excludeId?: number,
  ): Promise<boolean> {
    const query = this.createQueryBuilder('fiscalYear')
      .where('fiscalYear.companyId = :companyId', { companyId })
      .andWhere('UPPER(fiscalYear.code) = UPPER(:code)', { code });

    if (excludeId) {
      query.andWhere('fiscalYear.id != :excludeId', { excludeId });
    }

    const count = await query.getCount();
    return count > 0;
  }

  /**
   * Find fiscal year that contains a specific date
   * @param companyId - Company ID
   * @param date - Date to check
   * @returns Fiscal year if found, null otherwise
   */
  async findByCompanyAndDate(
    companyId: number,
    date: Date,
  ): Promise<FiscalYear | null> {
    return this.findOne({
      where: {
        companyId,
        startDate: LessThanOrEqual(date),
        endDate: MoreThanOrEqual(date),
      },
    });
  }

  /**
   * Find fiscal years that overlap with a date range
   * @param companyId - Company ID
   * @param startDate - Start date
   * @param endDate - End date
   * @param excludeId - Optional ID to exclude from check
   * @returns Array of overlapping fiscal years
   */
  async findOverlapping(
    companyId: number,
    startDate: Date,
    endDate: Date,
    excludeId?: number,
  ): Promise<FiscalYear[]> {
    const query = this.createQueryBuilder('fiscalYear')
      .where('fiscalYear.companyId = :companyId', { companyId })
      .andWhere(
        '(fiscalYear.startDate <= :endDate AND fiscalYear.endDate >= :startDate)',
        { startDate, endDate },
      );

    if (excludeId) {
      query.andWhere('fiscalYear.id != :excludeId', { excludeId });
    }

    return query.getMany();
  }

  /**
   * Find closed fiscal years for a company
   * @param companyId - Company ID
   * @returns Array of closed fiscal years
   */
  async findClosedByCompany(companyId: number): Promise<FiscalYear[]> {
    return this.find({
      where: { companyId, isClosed: true },
      order: { startDate: 'DESC' },
    });
  }

  /**
   * Find open fiscal years for a company
   * @param companyId - Company ID
   * @returns Array of open fiscal years
   */
  async findOpenByCompany(companyId: number): Promise<FiscalYear[]> {
    return this.find({
      where: { companyId, isClosed: false },
      order: { startDate: 'DESC' },
    });
  }

  /**
   * Soft delete a fiscal year by setting isActive to false
   * @param id - Fiscal year ID
   */
  async customSoftDelete(id: number): Promise<void> {
    await this.update(id, { isActive: false });
  }

  /**
   * Close a fiscal year
   * @param id - Fiscal year ID
   * @param closedDate - Date when closed
   */
  async closeFiscalYear(id: number, closedDate: Date): Promise<void> {
    await this.update(id, { isClosed: true, closedDate });
  }

  /**
   * Reopen a fiscal year
   * @param id - Fiscal year ID
   */
  async reopenFiscalYear(id: number): Promise<void> {
    await this.update(id, { isClosed: false, closedDate: null });
  }

  /**
   * Find a fiscal year with its company relation
   * @param id - Fiscal year ID
   * @returns Fiscal year with company if found, null otherwise
   */
  async findOneWithCompany(id: number): Promise<FiscalYear | null> {
    return this.findOne({
      where: { id },
      relations: ['company'],
    });
  }
}
