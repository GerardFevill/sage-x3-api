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
import { FiscalYearService } from './fiscal-year.service';
import { FiscalYear } from './fiscal-year.entity';
import { CreateFiscalYearDto, UpdateFiscalYearDto } from './dto';

/**
 * Controller handling HTTP requests for fiscal year management
 * All endpoints are prefixed with /api/fiscal-year
 */
@ApiTags('fiscal-year')
@Controller('fiscal-year')
export class FiscalYearController {
  constructor(private readonly fiscalYearService: FiscalYearService) {}

  /**
   * Create a new fiscal year
   */
  @Post()
  @ApiOperation({
    summary: 'Create a new fiscal year',
    description: 'Creates a new fiscal year for a company with date validation',
  })
  @ApiResponse({
    status: 201,
    description: 'Fiscal year successfully created',
    type: FiscalYear,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or date validation error',
  })
  @ApiResponse({
    status: 409,
    description: 'Fiscal year code already exists or dates overlap',
  })
  create(
    @Body() createFiscalYearDto: CreateFiscalYearDto,
  ): Promise<FiscalYear> {
    return this.fiscalYearService.create(createFiscalYearDto);
  }

  /**
   * Get all fiscal years
   */
  @Get()
  @ApiOperation({
    summary: 'Get all fiscal years',
    description: 'Retrieves all fiscal years across all companies',
  })
  @ApiResponse({
    status: 200,
    description: 'List of fiscal years',
    type: [FiscalYear],
  })
  findAll(): Promise<FiscalYear[]> {
    return this.fiscalYearService.findAll();
  }

  /**
   * Get fiscal years by company
   */
  @Get('by-company/:companyId')
  @ApiOperation({
    summary: 'Get fiscal years by company',
    description: 'Retrieves all fiscal years for a specific company',
  })
  @ApiParam({
    name: 'companyId',
    type: Number,
    description: 'Company ID',
  })
  @ApiQuery({
    name: 'active',
    required: false,
    type: Boolean,
    description: 'Filter by active status',
  })
  @ApiQuery({
    name: 'closed',
    required: false,
    type: Boolean,
    description: 'Filter by closed status (true=closed, false=open)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of fiscal years for the company',
    type: [FiscalYear],
  })
  async findByCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query('active') active?: string,
    @Query('closed') closed?: string,
  ): Promise<FiscalYear[]> {
    if (active === 'true') {
      return this.fiscalYearService.findActiveByCompany(companyId);
    }
    if (closed === 'true') {
      return this.fiscalYearService.findClosedByCompany(companyId);
    }
    if (closed === 'false') {
      return this.fiscalYearService.findOpenByCompany(companyId);
    }
    return this.fiscalYearService.findByCompany(companyId);
  }

  /**
   * Get a fiscal year by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get a fiscal year by ID',
    description: 'Retrieves a specific fiscal year by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Fiscal year ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Fiscal year found',
    type: FiscalYear,
  })
  @ApiResponse({
    status: 404,
    description: 'Fiscal year not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<FiscalYear> {
    return this.fiscalYearService.findOne(id);
  }

  /**
   * Get fiscal year by company and code
   */
  @Get('by-company/:companyId/by-code/:code')
  @ApiOperation({
    summary: 'Get fiscal year by company and code',
    description: 'Retrieves a fiscal year by company ID and code',
  })
  @ApiParam({
    name: 'companyId',
    type: Number,
    description: 'Company ID',
  })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'Fiscal year code',
    example: 'FY2024',
  })
  @ApiResponse({
    status: 200,
    description: 'Fiscal year found',
    type: FiscalYear,
  })
  @ApiResponse({
    status: 404,
    description: 'Fiscal year not found',
  })
  findByCompanyAndCode(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('code') code: string,
  ): Promise<FiscalYear> {
    return this.fiscalYearService.findByCompanyAndCode(companyId, code);
  }

  /**
   * Get fiscal year by company and date
   */
  @Get('by-company/:companyId/by-date/:date')
  @ApiOperation({
    summary: 'Get fiscal year by company and date',
    description: 'Finds the fiscal year that contains a specific date',
  })
  @ApiParam({
    name: 'companyId',
    type: Number,
    description: 'Company ID',
  })
  @ApiParam({
    name: 'date',
    type: String,
    description: 'Date in ISO format (YYYY-MM-DD)',
    example: '2024-06-15',
  })
  @ApiResponse({
    status: 200,
    description: 'Fiscal year found',
    type: FiscalYear,
  })
  @ApiResponse({
    status: 404,
    description: 'No fiscal year found for this date',
  })
  findByCompanyAndDate(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('date') date: string,
  ): Promise<FiscalYear> {
    return this.fiscalYearService.findByCompanyAndDate(companyId, date);
  }

  /**
   * Update a fiscal year
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a fiscal year',
    description: 'Updates an existing fiscal year with partial data',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Fiscal year ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Fiscal year successfully updated',
    type: FiscalYear,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or fiscal year is closed',
  })
  @ApiResponse({
    status: 404,
    description: 'Fiscal year not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Fiscal year code already exists or dates overlap',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFiscalYearDto: UpdateFiscalYearDto,
  ): Promise<FiscalYear> {
    return this.fiscalYearService.update(id, updateFiscalYearDto);
  }

  /**
   * Close a fiscal year
   */
  @Post(':id/close')
  @ApiOperation({
    summary: 'Close a fiscal year',
    description: 'Closes a fiscal year, preventing further modifications',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Fiscal year ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Fiscal year successfully closed',
    type: FiscalYear,
  })
  @ApiResponse({
    status: 400,
    description: 'Fiscal year is already closed',
  })
  @ApiResponse({
    status: 404,
    description: 'Fiscal year not found',
  })
  close(@Param('id', ParseIntPipe) id: number): Promise<FiscalYear> {
    return this.fiscalYearService.close(id);
  }

  /**
   * Reopen a fiscal year
   */
  @Post(':id/reopen')
  @ApiOperation({
    summary: 'Reopen a fiscal year',
    description: 'Reopens a closed fiscal year, allowing modifications again',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Fiscal year ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Fiscal year successfully reopened',
    type: FiscalYear,
  })
  @ApiResponse({
    status: 400,
    description: 'Fiscal year is not closed',
  })
  @ApiResponse({
    status: 404,
    description: 'Fiscal year not found',
  })
  reopen(@Param('id', ParseIntPipe) id: number): Promise<FiscalYear> {
    return this.fiscalYearService.reopen(id);
  }

  /**
   * Soft delete a fiscal year
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a fiscal year',
    description:
      'Soft deletes a fiscal year by setting isActive to false (does not physically delete)',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Fiscal year ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Fiscal year successfully soft deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete a closed fiscal year',
  })
  @ApiResponse({
    status: 404,
    description: 'Fiscal year not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.fiscalYearService.remove(id);
  }
}
