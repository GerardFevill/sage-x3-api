import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CurrencyService } from './currency.service';
import { Currency } from './currency.entity';
import { CreateCurrencyDto, UpdateCurrencyDto } from './dto';

/**
 * Controller handling HTTP requests for currency management
 * All endpoints are prefixed with /api/currency
 */
@ApiTags('currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  /**
   * Create a new currency
   */
  @Post()
  @ApiOperation({
    summary: 'Create a new currency',
    description: 'Creates a new currency with ISO 4217 code validation',
  })
  @ApiResponse({
    status: 201,
    description: 'Currency successfully created',
    type: Currency,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'Currency code already exists',
  })
  create(@Body() createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
    return this.currencyService.create(createCurrencyDto);
  }

  /**
   * Get all currencies or filter by active status
   */
  @Get()
  @ApiOperation({
    summary: 'Get all currencies',
    description:
      'Retrieves all currencies, optionally filtered by active status',
  })
  @ApiQuery({
    name: 'active',
    required: false,
    type: Boolean,
    description: 'Filter by active status (true/false)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of currencies',
    type: [Currency],
  })
  findAll(@Query('active') active?: string): Promise<Currency[]> {
    if (active === 'true') {
      return this.currencyService.findActive();
    }
    return this.currencyService.findAll();
  }

  /**
   * Get a currency by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get a currency by ID',
    description: 'Retrieves a specific currency by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Currency ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Currency found',
    type: Currency,
  })
  @ApiResponse({
    status: 404,
    description: 'Currency not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Currency> {
    return this.currencyService.findOne(id);
  }

  /**
   * Get a currency by ISO 4217 code
   */
  @Get('by-code/:code')
  @ApiOperation({
    summary: 'Get a currency by code',
    description: 'Retrieves a currency by its ISO 4217 code (e.g., EUR, USD)',
  })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'ISO 4217 currency code (3 uppercase letters)',
    example: 'EUR',
  })
  @ApiResponse({
    status: 200,
    description: 'Currency found',
    type: Currency,
  })
  @ApiResponse({
    status: 404,
    description: 'Currency not found',
  })
  findByCode(@Param('code') code: string): Promise<Currency> {
    return this.currencyService.findByCode(code);
  }

  /**
   * Search currencies by code or name
   */
  @Get('search')
  @ApiOperation({
    summary: 'Search currencies',
    description: 'Search currencies by code or name (min 2 characters)',
  })
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Search query (minimum 2 characters)',
    example: 'EUR',
  })
  @ApiResponse({
    status: 200,
    description: 'List of matching currencies',
    type: [Currency],
  })
  @ApiResponse({
    status: 400,
    description: 'Search query too short',
  })
  search(@Query('q') query: string): Promise<Currency[]> {
    return this.currencyService.search(query);
  }

  /**
   * Get currencies by decimal places
   */
  @Get('by-decimal-places/:decimalPlaces')
  @ApiOperation({
    summary: 'Get currencies by decimal places',
    description: 'Retrieves currencies with a specific number of decimal places',
  })
  @ApiParam({
    name: 'decimalPlaces',
    type: Number,
    description: 'Number of decimal places (0-4)',
    example: 2,
  })
  @ApiResponse({
    status: 200,
    description: 'List of currencies',
    type: [Currency],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid decimal places value',
  })
  findByDecimalPlaces(
    @Param('decimalPlaces', ParseIntPipe) decimalPlaces: number,
  ): Promise<Currency[]> {
    return this.currencyService.findByDecimalPlaces(decimalPlaces);
  }

  /**
   * Update a currency
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a currency',
    description: 'Updates an existing currency with partial data',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Currency ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Currency successfully updated',
    type: Currency,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Currency not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Currency code already exists',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ): Promise<Currency> {
    return this.currencyService.update(id, updateCurrencyDto);
  }

  /**
   * Soft delete a currency
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a currency',
    description:
      'Soft deletes a currency by setting isActive to false (does not physically delete)',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Currency ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Currency successfully soft deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Currency not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.currencyService.remove(id);
  }
}
