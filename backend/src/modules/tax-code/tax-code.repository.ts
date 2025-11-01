import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TaxCode } from './tax-code.entity';

@Injectable()
export class TaxCodeRepository extends Repository<TaxCode> {
  constructor(private dataSource: DataSource) {
    super(TaxCode, dataSource.createEntityManager());
  }

  async findByCompany(companyId: number): Promise<TaxCode[]> {
    return this.find({ where: { companyId }, order: { taxCode: 'ASC' } });
  }

  async findActiveByCompany(companyId: number): Promise<TaxCode[]> {
    return this.find({ where: { companyId, isActive: true }, order: { taxCode: 'ASC' } });
  }

  async findByCompanyAndCode(companyId: number, taxCode: string): Promise<TaxCode | null> {
    return this.findOne({ where: { companyId, taxCode } });
  }

  async codeExistsForCompany(companyId: number, taxCode: string, excludeId?: number): Promise<boolean> {
    const query = this.createQueryBuilder('taxCode')
      .where('taxCode.companyId = :companyId', { companyId })
      .andWhere('taxCode.taxCode = :taxCode', { taxCode });
    if (excludeId) {
      query.andWhere('taxCode.id != :excludeId', { excludeId });
    }
    return (await query.getCount()) > 0;
  }

  async findByType(companyId: number, taxType: string): Promise<TaxCode[]> {
    return this.find({ where: { companyId, taxType }, order: { taxCode: 'ASC' } });
  }

  async customSoftDelete(id: number): Promise<void> {
    await this.update(id, { isActive: false });
  }
}
