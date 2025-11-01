import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FiscalYearRepository } from './fiscal-year.repository';
import { FiscalYear } from './fiscal-year.entity';
import { CreateFiscalYearDto, UpdateFiscalYearDto } from './dto';

/**
 * Service handling business logic for fiscal years
 * Implements CRUD operations and domain-specific logic
 */
@Injectable()
export class FiscalYearService {
  private readonly logger = new Logger(FiscalYearService.name);

  constructor(
    private readonly fiscalYearRepository: FiscalYearRepository,
  ) {}

  /**
   * Create a new fiscal year
   * @param createFiscalYearDto - Fiscal year creation data
   * @returns Created fiscal year
   * @throws ConflictException if fiscal year code already exists for company
   * @throws BadRequestException if dates are invalid or overlap with existing fiscal years
   */
  async create(createFiscalYearDto: CreateFiscalYearDto): Promise<FiscalYear> {
    this.logger.log(
      `Creating fiscal year with code: ${createFiscalYearDto.code} for company: ${createFiscalYearDto.companyId}`,
    );

    // Validate dates
    const startDate = new Date(createFiscalYearDto.startDate);
    const endDate = new Date(createFiscalYearDto.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    // Check if code already exists for this company
    const codeExists = await this.fiscalYearRepository.codeExistsForCompany(
      createFiscalYearDto.companyId,
      createFiscalYearDto.code,
    );
    if (codeExists) {
      throw new ConflictException(
        `Fiscal year with code ${createFiscalYearDto.code} already exists for this company`,
      );
    }

    // Check for overlapping fiscal years
    const overlapping = await this.fiscalYearRepository.findOverlapping(
      createFiscalYearDto.companyId,
      startDate,
      endDate,
    );
    if (overlapping.length > 0) {
      throw new ConflictException(
        `Fiscal year dates overlap with existing fiscal year: ${overlapping[0].code}`,
      );
    }

    const fiscalYear = this.fiscalYearRepository.create(createFiscalYearDto);
    const savedFiscalYear = await this.fiscalYearRepository.save(fiscalYear);

    this.logger.log(`Fiscal year created with ID: ${savedFiscalYear.id}`);
    return savedFiscalYear;
  }

  /**
   * Get all fiscal years
   * @returns Array of all fiscal years
   */
  async findAll(): Promise<FiscalYear[]> {
    this.logger.log('Retrieving all fiscal years');
    return this.fiscalYearRepository.find({
      order: { companyId: 'ASC', startDate: 'DESC' },
    });
  }

  /**
   * Get all fiscal years for a company
   * @param companyId - Company ID
   * @returns Array of fiscal years for the company
   */
  async findByCompany(companyId: number): Promise<FiscalYear[]> {
    this.logger.log(`Retrieving fiscal years for company: ${companyId}`);
    return this.fiscalYearRepository.findByCompany(companyId);
  }

  /**
   * Get active fiscal years for a company
   * @param companyId - Company ID
   * @returns Array of active fiscal years
   */
  async findActiveByCompany(companyId: number): Promise<FiscalYear[]> {
    this.logger.log(`Retrieving active fiscal years for company: ${companyId}`);
    return this.fiscalYearRepository.findActiveByCompany(companyId);
  }

  /**
   * Get a fiscal year by ID
   * @param id - Fiscal year ID
   * @returns Fiscal year
   * @throws NotFoundException if fiscal year not found
   */
  async findOne(id: number): Promise<FiscalYear> {
    this.logger.log(`Retrieving fiscal year with ID: ${id}`);

    const fiscalYear = await this.fiscalYearRepository.findOne({
      where: { id },
    });

    if (!fiscalYear) {
      throw new NotFoundException(`Fiscal year with ID ${id} not found`);
    }

    return fiscalYear;
  }

  /**
   * Get a fiscal year by company and code
   * @param companyId - Company ID
   * @param code - Fiscal year code
   * @returns Fiscal year
   * @throws NotFoundException if fiscal year not found
   */
  async findByCompanyAndCode(
    companyId: number,
    code: string,
  ): Promise<FiscalYear> {
    this.logger.log(
      `Retrieving fiscal year with code: ${code} for company: ${companyId}`,
    );

    const fiscalYear =
      await this.fiscalYearRepository.findByCompanyAndCode(companyId, code);

    if (!fiscalYear) {
      throw new NotFoundException(
        `Fiscal year with code ${code} not found for company ${companyId}`,
      );
    }

    return fiscalYear;
  }

  /**
   * Get fiscal year for a specific date
   * @param companyId - Company ID
   * @param date - Date to check (ISO string or Date object)
   * @returns Fiscal year
   * @throws NotFoundException if no fiscal year found for date
   */
  async findByCompanyAndDate(
    companyId: number,
    date: string | Date,
  ): Promise<FiscalYear> {
    const checkDate = typeof date === 'string' ? new Date(date) : date;

    this.logger.log(
      `Finding fiscal year for company ${companyId} at date ${checkDate.toISOString()}`,
    );

    const fiscalYear = await this.fiscalYearRepository.findByCompanyAndDate(
      companyId,
      checkDate,
    );

    if (!fiscalYear) {
      throw new NotFoundException(
        `No fiscal year found for company ${companyId} at date ${checkDate.toISOString()}`,
      );
    }

    return fiscalYear;
  }

  /**
   * Update a fiscal year
   * @param id - Fiscal year ID
   * @param updateFiscalYearDto - Fiscal year update data
   * @returns Updated fiscal year
   * @throws NotFoundException if fiscal year not found
   * @throws ConflictException if new code already exists or dates overlap
   * @throws BadRequestException if trying to update a closed fiscal year or dates are invalid
   */
  async update(
    id: number,
    updateFiscalYearDto: UpdateFiscalYearDto,
  ): Promise<FiscalYear> {
    this.logger.log(`Updating fiscal year with ID: ${id}`);

    const fiscalYear = await this.findOne(id);

    // Prevent updates to closed fiscal years (except reopening)
    if (fiscalYear.isClosed && Object.keys(updateFiscalYearDto).length > 0) {
      throw new BadRequestException(
        'Cannot update a closed fiscal year. Reopen it first.',
      );
    }

    // Check if code is being updated and if it already exists
    if (updateFiscalYearDto.code) {
      const codeExists = await this.fiscalYearRepository.codeExistsForCompany(
        fiscalYear.companyId,
        updateFiscalYearDto.code,
        id,
      );
      if (codeExists) {
        throw new ConflictException(
          `Fiscal year with code ${updateFiscalYearDto.code} already exists for this company`,
        );
      }
    }

    // Validate and check for overlapping dates if dates are being updated
    if (updateFiscalYearDto.startDate || updateFiscalYearDto.endDate) {
      const startDate = updateFiscalYearDto.startDate
        ? new Date(updateFiscalYearDto.startDate)
        : fiscalYear.startDate;
      const endDate = updateFiscalYearDto.endDate
        ? new Date(updateFiscalYearDto.endDate)
        : fiscalYear.endDate;

      if (startDate >= endDate) {
        throw new BadRequestException('Start date must be before end date');
      }

      const overlapping = await this.fiscalYearRepository.findOverlapping(
        fiscalYear.companyId,
        startDate,
        endDate,
        id,
      );
      if (overlapping.length > 0) {
        throw new ConflictException(
          `Fiscal year dates overlap with existing fiscal year: ${overlapping[0].code}`,
        );
      }
    }

    Object.assign(fiscalYear, updateFiscalYearDto);
    const updatedFiscalYear = await this.fiscalYearRepository.save(fiscalYear);

    this.logger.log(`Fiscal year with ID ${id} updated successfully`);
    return updatedFiscalYear;
  }

  /**
   * Soft delete a fiscal year (set isActive to false)
   * @param id - Fiscal year ID
   * @throws NotFoundException if fiscal year not found
   * @throws BadRequestException if fiscal year is closed or has transactions
   */
  async remove(id: number): Promise<void> {
    this.logger.log(`Soft deleting fiscal year with ID: ${id}`);

    const fiscalYear = await this.findOne(id);

    if (fiscalYear.isClosed) {
      throw new BadRequestException('Cannot delete a closed fiscal year');
    }

    // TODO: Check if fiscal year has transactions
    // if (fiscalYear.transactions && fiscalYear.transactions.length > 0) {
    //   throw new BadRequestException('Cannot delete a fiscal year with transactions');
    // }

    await this.fiscalYearRepository.softDelete(id);

    this.logger.log(`Fiscal year with ID ${id} soft deleted successfully`);
  }

  /**
   * Close a fiscal year
   * @param id - Fiscal year ID
   * @returns Updated fiscal year
   * @throws NotFoundException if fiscal year not found
   * @throws BadRequestException if fiscal year is already closed
   */
  async close(id: number): Promise<FiscalYear> {
    this.logger.log(`Closing fiscal year with ID: ${id}`);

    const fiscalYear = await this.findOne(id);

    if (fiscalYear.isClosed) {
      throw new BadRequestException('Fiscal year is already closed');
    }

    // TODO: Additional validation before closing
    // - Check all periods are closed
    // - Verify balances
    // - etc.

    const closedDate = new Date();
    await this.fiscalYearRepository.closeFiscalYear(id, closedDate);

    this.logger.log(`Fiscal year with ID ${id} closed successfully`);
    return this.findOne(id);
  }

  /**
   * Reopen a fiscal year
   * @param id - Fiscal year ID
   * @returns Updated fiscal year
   * @throws NotFoundException if fiscal year not found
   * @throws BadRequestException if fiscal year is not closed
   */
  async reopen(id: number): Promise<FiscalYear> {
    this.logger.log(`Reopening fiscal year with ID: ${id}`);

    const fiscalYear = await this.findOne(id);

    if (!fiscalYear.isClosed) {
      throw new BadRequestException('Fiscal year is not closed');
    }

    await this.fiscalYearRepository.reopenFiscalYear(id);

    this.logger.log(`Fiscal year with ID ${id} reopened successfully`);
    return this.findOne(id);
  }

  /**
   * Get closed fiscal years for a company
   * @param companyId - Company ID
   * @returns Array of closed fiscal years
   */
  async findClosedByCompany(companyId: number): Promise<FiscalYear[]> {
    this.logger.log(`Retrieving closed fiscal years for company: ${companyId}`);
    return this.fiscalYearRepository.findClosedByCompany(companyId);
  }

  /**
   * Get open fiscal years for a company
   * @param companyId - Company ID
   * @returns Array of open fiscal years
   */
  async findOpenByCompany(companyId: number): Promise<FiscalYear[]> {
    this.logger.log(`Retrieving open fiscal years for company: ${companyId}`);
    return this.fiscalYearRepository.findOpenByCompany(companyId);
  }
}
