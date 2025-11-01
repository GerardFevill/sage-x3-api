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
import { BusinessPartnerService } from './business-partner.service';
import { BusinessPartner } from './business-partner.entity';
import { CreateBusinessPartnerDto, UpdateBusinessPartnerDto } from './dto';

@ApiTags('business-partner')
@Controller('business-partner')
export class BusinessPartnerController {
  constructor(private readonly businessPartnerService: BusinessPartnerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new business partner' })
  @ApiResponse({ status: 201, type: BusinessPartner })
  create(@Body() createBusinessPartnerDto: CreateBusinessPartnerDto): Promise<BusinessPartner> {
    return this.businessPartnerService.create(createBusinessPartnerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all business partners' })
  @ApiResponse({ status: 200, type: [BusinessPartner] })
  findAll(): Promise<BusinessPartner[]> {
    return this.businessPartnerService.findAll();
  }

  @Get('by-company/:companyId')
  @ApiOperation({ summary: 'Get business partners by company' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [BusinessPartner] })
  findByCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query('active') active?: string,
  ): Promise<BusinessPartner[]> {
    if (active === 'true') {
      return this.businessPartnerService.findActiveByCompany(companyId);
    }
    return this.businessPartnerService.findByCompany(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a business partner by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: BusinessPartner })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<BusinessPartner> {
    return this.businessPartnerService.findOne(id);
  }

  @Get('by-company/:companyId/by-code/:code')
  @ApiOperation({ summary: 'Get business partner by company and code' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiParam({ name: 'code', type: String })
  @ApiResponse({ status: 200, type: BusinessPartner })
  findByCompanyAndCode(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('code') code: string,
  ): Promise<BusinessPartner> {
    return this.businessPartnerService.findByCompanyAndCode(companyId, code);
  }

  @Get('by-company/:companyId/by-type/:type')
  @ApiOperation({ summary: 'Get business partners by type' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiParam({ name: 'type', enum: ['CUSTOMER', 'SUPPLIER', 'BOTH'] })
  @ApiResponse({ status: 200, type: [BusinessPartner] })
  findByType(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('type') type: string,
  ): Promise<BusinessPartner[]> {
    return this.businessPartnerService.findByType(companyId, type);
  }

  @Get('by-company/:companyId/search')
  @ApiOperation({ summary: 'Search business partners' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiQuery({ name: 'q', type: String })
  @ApiResponse({ status: 200, type: [BusinessPartner] })
  search(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query('q') query: string,
  ): Promise<BusinessPartner[]> {
    return this.businessPartnerService.search(companyId, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a business partner' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: BusinessPartner })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBusinessPartnerDto: UpdateBusinessPartnerDto,
  ): Promise<BusinessPartner> {
    return this.businessPartnerService.update(id, updateBusinessPartnerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a business partner' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204 })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.businessPartnerService.remove(id);
  }
}
