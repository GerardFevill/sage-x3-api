import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { InvoiceRepository } from './invoice.repository';
import { Invoice } from './invoice.entity';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    // Validate invoice number uniqueness
    const numberExists = await this.invoiceRepository.numberExistsForCompany(
      createInvoiceDto.companyId,
      createInvoiceDto.invoiceNumber,
    );
    if (numberExists) {
      throw new ConflictException(
        `Invoice with number ${createInvoiceDto.invoiceNumber} already exists for this company`,
      );
    }

    // Validate dates
    const invoiceDate = new Date(createInvoiceDto.invoiceDate);
    const dueDate = new Date(createInvoiceDto.dueDate);
    if (dueDate < invoiceDate) {
      throw new BadRequestException('Due date cannot be before invoice date');
    }

    // Calculate balance
    const totalAmount = createInvoiceDto.totalAmount;
    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      exchangeRate: createInvoiceDto.exchangeRate || 1.0,
      totalTax: createInvoiceDto.totalTax || 0,
      paidAmount: 0,
      balance: totalAmount,
      status: 'DRAFT',
    });

    return this.invoiceRepository.save(invoice);
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceRepository.find({ order: { invoiceDate: 'DESC', invoiceNumber: 'DESC' } });
  }

  async findByCompany(companyId: number): Promise<Invoice[]> {
    return this.invoiceRepository.findByCompany(companyId);
  }

  async findByBusinessPartner(businessPartnerId: number): Promise<Invoice[]> {
    return this.invoiceRepository.findByBusinessPartner(businessPartnerId);
  }

  async findByCompanyAndType(companyId: number, invoiceType: string): Promise<Invoice[]> {
    return this.invoiceRepository.findByCompanyAndType(companyId, invoiceType);
  }

  async findByCompanyAndStatus(companyId: number, status: string): Promise<Invoice[]> {
    return this.invoiceRepository.findByCompanyAndStatus(companyId, status);
  }

  async findByCompanyAndDateRange(
    companyId: number,
    startDate: string,
    endDate: string,
  ): Promise<Invoice[]> {
    return this.invoiceRepository.findByCompanyAndDateRange(
      companyId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  async findOverdueByCompany(companyId: number): Promise<Invoice[]> {
    return this.invoiceRepository.findOverdueByCompany(companyId);
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async findByCompanyAndNumber(companyId: number, invoiceNumber: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findByCompanyAndNumber(companyId, invoiceNumber);
    if (!invoice) {
      throw new NotFoundException(
        `Invoice with number ${invoiceNumber} not found for company ${companyId}`,
      );
    }
    return invoice;
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);

    // Validate invoice number uniqueness if being updated
    if (updateInvoiceDto.invoiceNumber) {
      const numberExists = await this.invoiceRepository.numberExistsForCompany(
        invoice.companyId,
        updateInvoiceDto.invoiceNumber,
        id,
      );
      if (numberExists) {
        throw new ConflictException(
          `Invoice with number ${updateInvoiceDto.invoiceNumber} already exists for this company`,
        );
      }
    }

    // Validate dates if provided
    if (updateInvoiceDto.invoiceDate || updateInvoiceDto.dueDate) {
      const invoiceDate = updateInvoiceDto.invoiceDate
        ? new Date(updateInvoiceDto.invoiceDate)
        : invoice.invoiceDate;
      const dueDate = updateInvoiceDto.dueDate
        ? new Date(updateInvoiceDto.dueDate)
        : invoice.dueDate;
      if (dueDate < invoiceDate) {
        throw new BadRequestException('Due date cannot be before invoice date');
      }
    }

    // Recalculate balance if totalAmount is updated
    if (updateInvoiceDto.totalAmount !== undefined) {
      updateInvoiceDto['balance'] = updateInvoiceDto.totalAmount - invoice.paidAmount;
    }

    Object.assign(invoice, updateInvoiceDto);
    return this.invoiceRepository.save(invoice);
  }

  async updateStatus(id: number, status: string): Promise<Invoice> {
    const invoice = await this.findOne(id);
    invoice.status = status;
    return this.invoiceRepository.save(invoice);
  }

  async recordPayment(id: number, paymentAmount: number): Promise<Invoice> {
    const invoice = await this.findOne(id);

    if (paymentAmount <= 0) {
      throw new BadRequestException('Payment amount must be positive');
    }

    const newPaidAmount = Number(invoice.paidAmount) + paymentAmount;
    const totalAmount = Number(invoice.totalAmount);

    if (newPaidAmount > totalAmount) {
      throw new BadRequestException('Payment amount exceeds invoice total');
    }

    await this.invoiceRepository.updateBalance(id, newPaidAmount);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.invoiceRepository.softDelete(id);
  }
}
