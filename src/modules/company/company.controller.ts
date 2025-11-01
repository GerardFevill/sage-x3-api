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
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Company created successfully',
    type: Company,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Company with this code already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  @ApiQuery({
    name: 'active',
    required: false,
    type: Boolean,
    description: 'Filter by active status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of companies',
    type: [Company],
  })
  findAll(@Query('active') active?: string): Promise<Company[]> {
    if (active === 'true') {
      return this.companyService.findActive();
    }
    return this.companyService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search companies by name or code' })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Search query (min 2 characters)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of matching companies',
    type: [Company],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid search query',
  })
  search(@Query('q') query: string): Promise<Company[]> {
    return this.companyService.search(query);
  }

  @Get('by-country/:countryCode')
  @ApiOperation({ summary: 'Get companies by country code' })
  @ApiParam({
    name: 'countryCode',
    description: 'ISO 3166-1 alpha-2 country code (e.g., FR, US)',
    example: 'FR',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of companies in the specified country',
    type: [Company],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid country code',
  })
  findByCountry(@Param('countryCode') countryCode: string): Promise<Company[]> {
    return this.companyService.findByCountry(countryCode.toUpperCase());
  }

  @Get('by-code/:code')
  @ApiOperation({ summary: 'Get company by code' })
  @ApiParam({
    name: 'code',
    description: 'Company code',
    example: 'FR01',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Company found',
    type: Company,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Company not found',
  })
  findByCode(@Param('code') code: string): Promise<Company> {
    return this.companyService.findByCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiParam({
    name: 'id',
    description: 'Company ID',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Company found',
    type: Company,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Company not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Company> {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a company' })
  @ApiParam({
    name: 'id',
    description: 'Company ID',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Company updated successfully',
    type: Company,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Company not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Company code already exists',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a company (soft delete)' })
  @ApiParam({
    name: 'id',
    description: 'Company ID',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Company deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Company not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.companyService.remove(id);
  }
}
