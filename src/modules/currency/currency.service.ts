import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CurrencyRepository } from './currency.repository';
import { Currency } from './currency.entity';
import { CreateCurrencyDto, UpdateCurrencyDto } from './dto';

/**
 * Service handling business logic for currencies
 * Implements CRUD operations and domain-specific logic
 */
@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(private readonly currencyRepository: CurrencyRepository) {}

  /**
   * Create a new currency
   * @param createCurrencyDto - Currency creation data
   * @returns Created currency
   * @throws ConflictException if currency code already exists
   */
  async create(createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
    this.logger.log(`Creating currency with code: ${createCurrencyDto.code}`);

    // Check if code already exists
    const codeExists = await this.currencyRepository.codeExists(
      createCurrencyDto.code,
    );
    if (codeExists) {
      throw new ConflictException(
        `Currency with code ${createCurrencyDto.code} already exists`,
      );
    }

    // Convert code to uppercase for consistency
    const currencyData = {
      ...createCurrencyDto,
      code: createCurrencyDto.code.toUpperCase(),
    };

    const currency = this.currencyRepository.create(currencyData);
    const savedCurrency = await this.currencyRepository.save(currency);

    this.logger.log(`Currency created with ID: ${savedCurrency.id}`);
    return savedCurrency;
  }

  /**
   * Get all currencies
   * @returns Array of all currencies ordered by code
   */
  async findAll(): Promise<Currency[]> {
    this.logger.log('Retrieving all currencies');
    return this.currencyRepository.find({
      order: { code: 'ASC' },
    });
  }

  /**
   * Get all active currencies
   * @returns Array of active currencies
   */
  async findActive(): Promise<Currency[]> {
    this.logger.log('Retrieving active currencies');
    return this.currencyRepository.findActive();
  }

  /**
   * Get a currency by ID
   * @param id - Currency ID
   * @returns Currency
   * @throws NotFoundException if currency not found
   */
  async findOne(id: number): Promise<Currency> {
    this.logger.log(`Retrieving currency with ID: ${id}`);

    const currency = await this.currencyRepository.findOne({ where: { id } });

    if (!currency) {
      throw new NotFoundException(`Currency with ID ${id} not found`);
    }

    return currency;
  }

  /**
   * Get a currency by ISO 4217 code
   * @param code - Currency code (e.g., 'EUR', 'USD')
   * @returns Currency
   * @throws NotFoundException if currency not found
   */
  async findByCode(code: string): Promise<Currency> {
    this.logger.log(`Retrieving currency with code: ${code}`);

    const currency = await this.currencyRepository.findByCode(code);

    if (!currency) {
      throw new NotFoundException(`Currency with code ${code} not found`);
    }

    return currency;
  }

  /**
   * Update a currency
   * @param id - Currency ID
   * @param updateCurrencyDto - Currency update data
   * @returns Updated currency
   * @throws NotFoundException if currency not found
   * @throws ConflictException if new code already exists
   */
  async update(
    id: number,
    updateCurrencyDto: UpdateCurrencyDto,
  ): Promise<Currency> {
    this.logger.log(`Updating currency with ID: ${id}`);

    const currency = await this.findOne(id);

    // Check if code is being updated and if it already exists
    if (updateCurrencyDto.code) {
      const codeExists = await this.currencyRepository.codeExists(
        updateCurrencyDto.code,
        id,
      );
      if (codeExists) {
        throw new ConflictException(
          `Currency with code ${updateCurrencyDto.code} already exists`,
        );
      }
      // Convert code to uppercase
      updateCurrencyDto.code = updateCurrencyDto.code.toUpperCase();
    }

    Object.assign(currency, updateCurrencyDto);
    const updatedCurrency = await this.currencyRepository.save(currency);

    this.logger.log(`Currency with ID ${id} updated successfully`);
    return updatedCurrency;
  }

  /**
   * Soft delete a currency (set isActive to false)
   * @param id - Currency ID
   * @throws NotFoundException if currency not found
   */
  async remove(id: number): Promise<void> {
    this.logger.log(`Soft deleting currency with ID: ${id}`);

    // Verify currency exists
    await this.findOne(id);

    await this.currencyRepository.customSoftDelete(id);

    this.logger.log(`Currency with ID ${id} soft deleted successfully`);
  }

  /**
   * Search currencies by code or name
   * @param query - Search string
   * @returns Array of matching currencies
   * @throws BadRequestException if query is too short
   */
  async search(query: string): Promise<Currency[]> {
    if (!query || query.trim().length < 2) {
      throw new BadRequestException(
        'Search query must be at least 2 characters',
      );
    }

    this.logger.log(`Searching currencies with query: ${query}`);
    return this.currencyRepository.search(query.trim());
  }

  /**
   * Get currencies by decimal places
   * @param decimalPlaces - Number of decimal places (0-4)
   * @returns Array of currencies
   * @throws BadRequestException if decimal places is invalid
   */
  async findByDecimalPlaces(decimalPlaces: number): Promise<Currency[]> {
    if (decimalPlaces < 0 || decimalPlaces > 4) {
      throw new BadRequestException('Decimal places must be between 0 and 4');
    }

    this.logger.log(
      `Retrieving currencies with ${decimalPlaces} decimal places`,
    );
    return this.currencyRepository.findByDecimalPlaces(decimalPlaces);
  }
}
