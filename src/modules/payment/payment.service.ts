import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { Payment } from './payment.entity';
import { CreatePaymentDto, UpdatePaymentDto } from './dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly paymentRepository: PaymentRepository) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // Validate payment number uniqueness
    const numberExists = await this.paymentRepository.numberExistsForCompany(
      createPaymentDto.companyId,
      createPaymentDto.paymentNumber,
    );
    if (numberExists) {
      throw new ConflictException(
        `Payment with number ${createPaymentDto.paymentNumber} already exists for this company`,
      );
    }

    // Validate amount
    if (createPaymentDto.amount <= 0) {
      throw new BadRequestException('Payment amount must be positive');
    }

    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      exchangeRate: createPaymentDto.exchangeRate || 1.0,
      status: 'PENDING',
    });

    return this.paymentRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({ order: { paymentDate: 'DESC', paymentNumber: 'DESC' } });
  }

  async findByCompany(companyId: number): Promise<Payment[]> {
    return this.paymentRepository.findByCompany(companyId);
  }

  async findByBusinessPartner(businessPartnerId: number): Promise<Payment[]> {
    return this.paymentRepository.findByBusinessPartner(businessPartnerId);
  }

  async findByInvoice(invoiceId: number): Promise<Payment[]> {
    return this.paymentRepository.findByInvoice(invoiceId);
  }

  async findByCompanyAndType(companyId: number, paymentType: string): Promise<Payment[]> {
    return this.paymentRepository.findByCompanyAndType(companyId, paymentType);
  }

  async findByCompanyAndStatus(companyId: number, status: string): Promise<Payment[]> {
    return this.paymentRepository.findByCompanyAndStatus(companyId, status);
  }

  async findByCompanyAndDateRange(
    companyId: number,
    startDate: string,
    endDate: string,
  ): Promise<Payment[]> {
    return this.paymentRepository.findByCompanyAndDateRange(
      companyId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  async findByCompanyAndMethod(companyId: number, paymentMethod: string): Promise<Payment[]> {
    return this.paymentRepository.findByCompanyAndMethod(companyId, paymentMethod);
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async findByCompanyAndNumber(companyId: number, paymentNumber: string): Promise<Payment> {
    const payment = await this.paymentRepository.findByCompanyAndNumber(companyId, paymentNumber);
    if (!payment) {
      throw new NotFoundException(
        `Payment with number ${paymentNumber} not found for company ${companyId}`,
      );
    }
    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);

    // Validate payment number uniqueness if being updated
    if (updatePaymentDto.paymentNumber) {
      const numberExists = await this.paymentRepository.numberExistsForCompany(
        payment.companyId,
        updatePaymentDto.paymentNumber,
        id,
      );
      if (numberExists) {
        throw new ConflictException(
          `Payment with number ${updatePaymentDto.paymentNumber} already exists for this company`,
        );
      }
    }

    // Validate amount if provided
    if (updatePaymentDto.amount !== undefined && updatePaymentDto.amount <= 0) {
      throw new BadRequestException('Payment amount must be positive');
    }

    Object.assign(payment, updatePaymentDto);
    return this.paymentRepository.save(payment);
  }

  async updateStatus(id: number, status: string): Promise<Payment> {
    const payment = await this.findOne(id);
    payment.status = status;
    return this.paymentRepository.save(payment);
  }

  async getTotalByCompanyAndType(companyId: number, paymentType: string): Promise<number> {
    return this.paymentRepository.getTotalByCompanyAndType(companyId, paymentType);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.paymentRepository.customSoftDelete(id);
  }
}
