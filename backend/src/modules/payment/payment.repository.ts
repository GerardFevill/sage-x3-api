import { Injectable } from '@nestjs/common';
import { DataSource, Repository, Between } from 'typeorm';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentRepository extends Repository<Payment> {
  constructor(private dataSource: DataSource) {
    super(Payment, dataSource.createEntityManager());
  }

  async findByCompany(companyId: number): Promise<Payment[]> {
    return this.find({
      where: { companyId },
      order: { paymentDate: 'DESC', paymentNumber: 'DESC' },
    });
  }

  async findByBusinessPartner(businessPartnerId: number): Promise<Payment[]> {
    return this.find({
      where: { businessPartnerId },
      order: { paymentDate: 'DESC' },
    });
  }

  async findByInvoice(invoiceId: number): Promise<Payment[]> {
    return this.find({
      where: { invoiceId },
      order: { paymentDate: 'DESC' },
    });
  }

  async findByCompanyAndType(companyId: number, paymentType: string): Promise<Payment[]> {
    return this.find({
      where: { companyId, paymentType },
      order: { paymentDate: 'DESC', paymentNumber: 'DESC' },
    });
  }

  async findByCompanyAndStatus(companyId: number, status: string): Promise<Payment[]> {
    return this.find({
      where: { companyId, status },
      order: { paymentDate: 'DESC', paymentNumber: 'DESC' },
    });
  }

  async findByCompanyAndDateRange(
    companyId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Payment[]> {
    return this.find({
      where: {
        companyId,
        paymentDate: Between(startDate, endDate),
      },
      order: { paymentDate: 'DESC', paymentNumber: 'DESC' },
    });
  }

  async findByCompanyAndMethod(companyId: number, paymentMethod: string): Promise<Payment[]> {
    return this.find({
      where: { companyId, paymentMethod },
      order: { paymentDate: 'DESC' },
    });
  }

  async findByCompanyAndNumber(companyId: number, paymentNumber: string): Promise<Payment | null> {
    return this.findOne({ where: { companyId, paymentNumber } });
  }

  async numberExistsForCompany(
    companyId: number,
    paymentNumber: string,
    excludeId?: number,
  ): Promise<boolean> {
    const query = this.createQueryBuilder('payment')
      .where('payment.companyId = :companyId', { companyId })
      .andWhere('payment.paymentNumber = :paymentNumber', { paymentNumber });
    if (excludeId) {
      query.andWhere('payment.id != :excludeId', { excludeId });
    }
    return (await query.getCount()) > 0;
  }

  async softDelete(id: number): Promise<void> {
    await this.update(id, { isActive: false });
  }

  async getTotalByCompanyAndType(companyId: number, paymentType: string): Promise<number> {
    const result = await this.createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.companyId = :companyId', { companyId })
      .andWhere('payment.paymentType = :paymentType', { paymentType })
      .andWhere('payment.status = :status', { status: 'COMPLETED' })
      .andWhere('payment.isActive = :isActive', { isActive: true })
      .getRawOne();
    return result?.total || 0;
  }
}
