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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TaxCodeService } from './tax-code.service';
import { TaxCode } from './tax-code.entity';
import { CreateTaxCodeDto, UpdateTaxCodeDto } from './dto';

@ApiTags('tax-code')
@Controller('tax-code')
export class TaxCodeController {
  constructor(private readonly taxCodeService: TaxCodeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tax code' })
  @ApiResponse({ status: 201, type: TaxCode })
  create(@Body() createTaxCodeDto: CreateTaxCodeDto): Promise<TaxCode> {
    return this.taxCodeService.create(createTaxCodeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tax codes' })
  @ApiResponse({ status: 200, type: [TaxCode] })
  findAll(): Promise<TaxCode[]> {
    return this.taxCodeService.findAll();
  }

  @Get('by-company/:companyId')
  @ApiOperation({ summary: 'Get tax codes by company' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [TaxCode] })
  findByCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query('active') active?: string,
  ): Promise<TaxCode[]> {
    if (active === 'true') {
      return this.taxCodeService.findActiveByCompany(companyId);
    }
    return this.taxCodeService.findByCompany(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tax code by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: TaxCode })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TaxCode> {
    return this.taxCodeService.findOne(id);
  }

  @Get('by-company/:companyId/by-code/:code')
  @ApiOperation({ summary: 'Get tax code by company and code' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiParam({ name: 'code', type: String })
  @ApiResponse({ status: 200, type: TaxCode })
  findByCompanyAndCode(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('code') code: string,
  ): Promise<TaxCode> {
    return this.taxCodeService.findByCompanyAndCode(companyId, code);
  }

  @Get('by-company/:companyId/by-type/:type')
  @ApiOperation({ summary: 'Get tax codes by type' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiParam({ name: 'type', enum: ['VAT', 'SALES_TAX', 'EXCISE', 'OTHER'] })
  @ApiResponse({ status: 200, type: [TaxCode] })
  findByType(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('type') type: string,
  ): Promise<TaxCode[]> {
    return this.taxCodeService.findByType(companyId, type);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tax code' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: TaxCode })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaxCodeDto: UpdateTaxCodeDto,
  ): Promise<TaxCode> {
    return this.taxCodeService.update(id, updateTaxCodeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a tax code' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204 })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.taxCodeService.remove(id);
  }
}
