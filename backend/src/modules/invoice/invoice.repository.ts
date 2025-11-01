import { Injectable } from '@nestjs/common';
import { DataSource, Repository, Between } from 'typeorm';
import { Invoice } from './invoice.entity';

@Injectable()
export class InvoiceRepository extends Repository<Invoice> {
  constructor(private dataSource: DataSource) {
    super(Invoice, dataSource.createEntityManager());
  }

  async findByCompany(companyId: number): Promise<Invoice[]> {
    return this.find({
      where: { companyId },
      order: { invoiceDate: 'DESC', invoiceNumber: 'DESC' },
    });
  }

  async findByBusinessPartner(businessPartnerId: number): Promise<Invoice[]> {
    return this.find({
      where: { businessPartnerId },
      order: { invoiceDate: 'DESC' },
    });
  }

  async findByCompanyAndType(companyId: number, invoiceType: string): Promise<Invoice[]> {
    return this.find({
      where: { companyId, invoiceType },
      order: { invoiceDate: 'DESC', invoiceNumber: 'DESC' },
    });
  }

  async findByCompanyAndStatus(companyId: number, status: string): Promise<Invoice[]> {
    return this.find({
      where: { companyId, status },
      order: { invoiceDate: 'DESC', invoiceNumber: 'DESC' },
    });
  }

  async findByCompanyAndDateRange(
    companyId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Invoice[]> {
    return this.find({
      where: {
        companyId,
        invoiceDate: Between(startDate, endDate),
      },
      order: { invoiceDate: 'DESC', invoiceNumber: 'DESC' },
    });
  }

  async findOverdueByCompany(companyId: number): Promise<Invoice[]> {
    const today = new Date();
    return this.createQueryBuilder('invoice')
      .where('invoice.companyId = :companyId', { companyId })
      .andWhere('invoice.dueDate < :today', { today })
      .andWhere('invoice.balance > 0')
      .andWhere('invoice.status != :status', { status: 'PAID' })
      .andWhere('invoice.isActive = :isActive', { isActive: true })
      .orderBy('invoice.dueDate', 'ASC')
      .getMany();
  }

  async findByCompanyAndNumber(companyId: number, invoiceNumber: string): Promise<Invoice | null> {
    return this.findOne({ where: { companyId, invoiceNumber } });
  }

  async numberExistsForCompany(
    companyId: number,
    invoiceNumber: string,
    excludeId?: number,
  ): Promise<boolean> {
    const query = this.createQueryBuilder('invoice')
      .where('invoice.companyId = :companyId', { companyId })
      .andWhere('invoice.invoiceNumber = :invoiceNumber', { invoiceNumber });
    if (excludeId) {
      query.andWhere('invoice.id != :excludeId', { excludeId });
    }
    return (await query.getCount()) > 0;
  }

  async customSoftDelete(id: number): Promise<void> {
    await this.update(id, { isActive: false });
  }

  async updateBalance(id: number, paidAmount: number): Promise<void> {
    const invoice = await this.findOne({ where: { id } });
    if (invoice) {
      const newBalance = invoice.totalAmount - paidAmount;
      const newStatus = newBalance <= 0 ? 'PAID' : invoice.balance > newBalance ? 'PARTIALLY_PAID' : invoice.status;
      await this.update(id, {
        paidAmount,
        balance: newBalance,
        status: newStatus,
      });
    }
  }
}
