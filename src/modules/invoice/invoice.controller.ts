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
import { InvoiceService } from './invoice.service';
import { Invoice } from './invoice.entity';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto';

@ApiTags('invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({ status: 201, type: Invoice })
  create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiResponse({ status: 200, type: [Invoice] })
  findAll(): Promise<Invoice[]> {
    return this.invoiceService.findAll();
  }

  @Get('by-company/:companyId')
  @ApiOperation({ summary: 'Get invoices by company' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, type: [Invoice] })
  findByCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Invoice[]> {
    if (type) {
      return this.invoiceService.findByCompanyAndType(companyId, type);
    }
    if (status) {
      return this.invoiceService.findByCompanyAndStatus(companyId, status);
    }
    if (startDate && endDate) {
      return this.invoiceService.findByCompanyAndDateRange(companyId, startDate, endDate);
    }
    return this.invoiceService.findByCompany(companyId);
  }

  @Get('by-business-partner/:businessPartnerId')
  @ApiOperation({ summary: 'Get invoices by business partner' })
  @ApiParam({ name: 'businessPartnerId', type: Number })
  @ApiResponse({ status: 200, type: [Invoice] })
  findByBusinessPartner(
    @Param('businessPartnerId', ParseIntPipe) businessPartnerId: number,
  ): Promise<Invoice[]> {
    return this.invoiceService.findByBusinessPartner(businessPartnerId);
  }

  @Get('overdue/by-company/:companyId')
  @ApiOperation({ summary: 'Get overdue invoices by company' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiResponse({ status: 200, type: [Invoice] })
  findOverdueByCompany(@Param('companyId', ParseIntPipe) companyId: number): Promise<Invoice[]> {
    return this.invoiceService.findOverdueByCompany(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an invoice by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Invoice })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Invoice> {
    return this.invoiceService.findOne(id);
  }

  @Get('by-company/:companyId/by-number/:number')
  @ApiOperation({ summary: 'Get invoice by company and number' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiParam({ name: 'number', type: String })
  @ApiResponse({ status: 200, type: Invoice })
  findByCompanyAndNumber(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('number') invoiceNumber: string,
  ): Promise<Invoice> {
    return this.invoiceService.findByCompanyAndNumber(companyId, invoiceNumber);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an invoice' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Invoice })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    return this.invoiceService.update(id, updateInvoiceDto);
  }

  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'Update invoice status' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'status', type: String })
  @ApiResponse({ status: 200, type: Invoice })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: string,
  ): Promise<Invoice> {
    return this.invoiceService.updateStatus(id, status);
  }

  @Post(':id/payment')
  @ApiOperation({ summary: 'Record a payment for an invoice' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Invoice })
  recordPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body('amount') amount: number,
  ): Promise<Invoice> {
    return this.invoiceService.recordPayment(id, amount);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete an invoice' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204 })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.invoiceService.remove(id);
  }
}
