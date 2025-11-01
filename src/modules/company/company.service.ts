import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CompanyRepository } from './company.repository';
import { Company } from './company.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';

/**
 * Company Service
 * Business logic layer for company management
 * Handles validation, error handling, and business rules
 */
@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(private readonly companyRepository: CompanyRepository) {}

  /**
   * Find all companies
   */
  async findAll(): Promise<Company[]> {
    this.logger.log('Finding all companies');
    return this.companyRepository.find({
      order: { code: 'ASC' },
    });
  }

  /**
   * Find all active companies only
   */
  async findActive(): Promise<Company[]> {
    this.logger.log('Finding active companies');
    return this.companyRepository.findActive();
  }

  /**
   * Find one company by ID
   */
  async findOne(id: number): Promise<Company> {
    this.logger.log(`Finding company with ID: ${id}`);

    const company = await this.companyRepository.findOne({ where: { id } });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  /**
   * Find company by code
   */
  async findByCode(code: string): Promise<Company> {
    this.logger.log(`Finding company with code: ${code}`);

    const company = await this.companyRepository.findByCode(code);

    if (!company) {
      throw new NotFoundException(`Company with code ${code} not found`);
    }

    return company;
  }

  /**
   * Create a new company
   */
  async create(dto: CreateCompanyDto): Promise<Company> {
    this.logger.log(`Creating new company: ${dto.code}`);

    // Check if code already exists
    const codeExists = await this.companyRepository.codeExists(dto.code);
    if (codeExists) {
      throw new ConflictException(
        `Company with code ${dto.code} already exists`,
      );
    }

    // Create and save company
    const company = this.companyRepository.create(dto);

    try {
      const savedCompany = await this.companyRepository.save(company);
      this.logger.log(`Company created successfully: ${savedCompany.code}`);
      return savedCompany;
    } catch (error) {
      this.logger.error(`Failed to create company: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to create company: ${error.message}`);
    }
  }

  /**
   * Update an existing company
   */
  async update(id: number, dto: UpdateCompanyDto): Promise<Company> {
    this.logger.log(`Updating company with ID: ${id}`);

    // Find existing company
    const company = await this.findOne(id);

    // If updating code, check it doesn't conflict
    if (dto.code && dto.code !== company.code) {
      const codeExists = await this.companyRepository.codeExists(dto.code, id);
      if (codeExists) {
        throw new ConflictException(
          `Company with code ${dto.code} already exists`,
        );
      }
    }

    // Merge changes
    Object.assign(company, dto);

    try {
      const updatedCompany = await this.companyRepository.save(company);
      this.logger.log(`Company updated successfully: ${updatedCompany.code}`);
      return updatedCompany;
    } catch (error) {
      this.logger.error(`Failed to update company: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to update company: ${error.message}`);
    }
  }

  /**
   * Delete a company (soft delete - sets isActive to false)
   */
  async remove(id: number): Promise<void> {
    this.logger.log(`Soft deleting company with ID: ${id}`);

    // Verify company exists
    await this.findOne(id);

    // TODO: Add business rule checks
    // - Cannot delete if has active fiscal years
    // - Cannot delete if has transactions
    // - etc.

    try {
      await this.companyRepository.customSoftDelete(id);
      this.logger.log(`Company soft deleted successfully: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete company: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to delete company: ${error.message}`);
    }
  }

  /**
   * Search companies by query string
   */
  async search(query: string): Promise<Company[]> {
    this.logger.log(`Searching companies with query: ${query}`);

    if (!query || query.trim().length < 2) {
      throw new BadRequestException('Search query must be at least 2 characters');
    }

    return this.companyRepository.search(query);
  }

  /**
   * Find companies by country
   */
  async findByCountry(countryCode: string): Promise<Company[]> {
    this.logger.log(`Finding companies in country: ${countryCode}`);

    if (!/^[A-Z]{2}$/.test(countryCode)) {
      throw new BadRequestException('Invalid country code format (must be 2 uppercase letters)');
    }

    return this.companyRepository.findByCountry(countryCode);
  }
}
