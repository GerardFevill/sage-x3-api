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
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './dto';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, type: Product })
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, type: [Product] })
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get('by-company/:companyId')
  @ApiOperation({ summary: 'Get products by company' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [Product] })
  findByCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query('active') active?: string,
  ): Promise<Product[]> {
    if (active === 'true') {
      return this.productService.findActiveByCompany(companyId);
    }
    return this.productService.findByCompany(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Product })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Get('by-company/:companyId/by-code/:code')
  @ApiOperation({ summary: 'Get product by company and code' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiParam({ name: 'code', type: String })
  @ApiResponse({ status: 200, type: Product })
  findByCompanyAndCode(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('code') code: string,
  ): Promise<Product> {
    return this.productService.findByCompanyAndCode(companyId, code);
  }

  @Get('by-company/:companyId/by-type/:type')
  @ApiOperation({ summary: 'Get products by type' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiParam({ name: 'type', enum: ['GOODS', 'SERVICE'] })
  @ApiResponse({ status: 200, type: [Product] })
  findByType(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('type') type: string,
  ): Promise<Product[]> {
    return this.productService.findByType(companyId, type);
  }

  @Get('by-company/:companyId/search')
  @ApiOperation({ summary: 'Search products' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiQuery({ name: 'q', type: String })
  @ApiResponse({ status: 200, type: [Product] })
  search(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query('q') query: string,
  ): Promise<Product[]> {
    return this.productService.search(companyId, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Product })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a product' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204 })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productService.remove(id);
  }
}
