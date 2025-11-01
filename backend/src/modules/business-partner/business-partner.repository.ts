import { Injectable } from '@nestjs/common';
import { DataSource, Repository, Like } from 'typeorm';
import { BusinessPartner } from './business-partner.entity';

@Injectable()
export class BusinessPartnerRepository extends Repository<BusinessPartner> {
  constructor(private dataSource: DataSource) {
    super(BusinessPartner, dataSource.createEntityManager());
  }

  async findByCompany(companyId: number): Promise<BusinessPartner[]> {
    return this.find({ where: { companyId }, order: { partnerCode: 'ASC' } });
  }

  async findActiveByCompany(companyId: number): Promise<BusinessPartner[]> {
    return this.find({ where: { companyId, isActive: true }, order: { partnerCode: 'ASC' } });
  }

  async findByCompanyAndCode(companyId: number, partnerCode: string): Promise<BusinessPartner | null> {
    return this.findOne({ where: { companyId, partnerCode } });
  }

  async codeExistsForCompany(companyId: number, partnerCode: string, excludeId?: number): Promise<boolean> {
    const query = this.createQueryBuilder('partner')
      .where('partner.companyId = :companyId', { companyId })
      .andWhere('partner.partnerCode = :partnerCode', { partnerCode });
    if (excludeId) {
      query.andWhere('partner.id != :excludeId', { excludeId });
    }
    return (await query.getCount()) > 0;
  }

  async findByType(companyId: number, partnerType: string): Promise<BusinessPartner[]> {
    return this.find({ where: { companyId, partnerType }, order: { partnerCode: 'ASC' } });
  }

  async search(companyId: number, query: string): Promise<BusinessPartner[]> {
    return this.find({
      where: [
        { companyId, partnerCode: Like(`%${query}%`) },
        { companyId, partnerName: Like(`%${query}%`) },
      ],
      order: { partnerCode: 'ASC' },
    });
  }

  async softDelete(id: number): Promise<void> {
    await this.update(id, { isActive: false });
  }
}
