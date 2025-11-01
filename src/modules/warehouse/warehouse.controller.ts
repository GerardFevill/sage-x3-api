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
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './warehouse.entity';
import { CreateWarehouseDto, UpdateWarehouseDto } from './dto';

@ApiTags('warehouse')
@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new warehouse' })
  @ApiResponse({ status: 201, type: Warehouse })
  create(@Body() createWarehouseDto: CreateWarehouseDto): Promise<Warehouse> {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all warehouses' })
  @ApiResponse({ status: 200, type: [Warehouse] })
  findAll(): Promise<Warehouse[]> {
    return this.warehouseService.findAll();
  }

  @Get('by-company/:companyId')
  @ApiOperation({ summary: 'Get warehouses by company' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [Warehouse] })
  findByCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query('active') active?: string,
  ): Promise<Warehouse[]> {
    if (active === 'true') {
      return this.warehouseService.findActiveByCompany(companyId);
    }
    return this.warehouseService.findByCompany(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a warehouse by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Warehouse })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Warehouse> {
    return this.warehouseService.findOne(id);
  }

  @Get('by-company/:companyId/by-code/:code')
  @ApiOperation({ summary: 'Get warehouse by company and code' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiParam({ name: 'code', type: String })
  @ApiResponse({ status: 200, type: Warehouse })
  findByCompanyAndCode(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('code') code: string,
  ): Promise<Warehouse> {
    return this.warehouseService.findByCompanyAndCode(companyId, code);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a warehouse' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Warehouse })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<Warehouse> {
    return this.warehouseService.update(id, updateWarehouseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a warehouse' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204 })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.warehouseService.remove(id);
  }
}
