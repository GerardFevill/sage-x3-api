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
import { PaymentService } from './payment.service';
import { Payment } from './payment.entity';
import { CreatePaymentDto, UpdatePaymentDto } from './dto';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, type: Payment })
  create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, type: [Payment] })
  findAll(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Get('by-company/:companyId')
  @ApiOperation({ summary: 'Get payments by company' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'method', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, type: [Payment] })
  findByCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('method') method?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Payment[]> {
    if (type) {
      return this.paymentService.findByCompanyAndType(companyId, type);
    }
    if (status) {
      return this.paymentService.findByCompanyAndStatus(companyId, status);
    }
    if (method) {
      return this.paymentService.findByCompanyAndMethod(companyId, method);
    }
    if (startDate && endDate) {
      return this.paymentService.findByCompanyAndDateRange(companyId, startDate, endDate);
    }
    return this.paymentService.findByCompany(companyId);
  }

  @Get('by-business-partner/:businessPartnerId')
  @ApiOperation({ summary: 'Get payments by business partner' })
  @ApiParam({ name: 'businessPartnerId', type: Number })
  @ApiResponse({ status: 200, type: [Payment] })
  findByBusinessPartner(
    @Param('businessPartnerId', ParseIntPipe) businessPartnerId: number,
  ): Promise<Payment[]> {
    return this.paymentService.findByBusinessPartner(businessPartnerId);
  }

  @Get('by-invoice/:invoiceId')
  @ApiOperation({ summary: 'Get payments by invoice' })
  @ApiParam({ name: 'invoiceId', type: Number })
  @ApiResponse({ status: 200, type: [Payment] })
  findByInvoice(@Param('invoiceId', ParseIntPipe) invoiceId: number): Promise<Payment[]> {
    return this.paymentService.findByInvoice(invoiceId);
  }

  @Get('total/by-company/:companyId/by-type/:type')
  @ApiOperation({ summary: 'Get total payment amount by company and type' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiParam({ name: 'type', type: String })
  @ApiResponse({ status: 200, schema: { type: 'object', properties: { total: { type: 'number' } } } })
  async getTotalByCompanyAndType(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('type') type: string,
  ): Promise<{ total: number }> {
    const total = await this.paymentService.getTotalByCompanyAndType(companyId, type);
    return { total };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payment by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Payment })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Payment> {
    return this.paymentService.findOne(id);
  }

  @Get('by-company/:companyId/by-number/:number')
  @ApiOperation({ summary: 'Get payment by company and number' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiParam({ name: 'number', type: String })
  @ApiResponse({ status: 200, type: Payment })
  findByCompanyAndNumber(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('number') paymentNumber: string,
  ): Promise<Payment> {
    return this.paymentService.findByCompanyAndNumber(companyId, paymentNumber);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a payment' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Payment })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'Update payment status' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'status', type: String })
  @ApiResponse({ status: 200, type: Payment })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: string,
  ): Promise<Payment> {
    return this.paymentService.updateStatus(id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a payment' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204 })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.paymentService.remove(id);
  }
}
