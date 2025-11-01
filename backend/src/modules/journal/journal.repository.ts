import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Journal } from './journal.entity';

@Injectable()
export class JournalRepository extends Repository<Journal> {
  constructor(private dataSource: DataSource) {
    super(Journal, dataSource.createEntityManager());
  }

  async findByCompany(companyId: number): Promise<Journal[]> {
    return this.find({ where: { companyId }, order: { journalCode: 'ASC' } });
  }

  async findActiveByCompany(companyId: number): Promise<Journal[]> {
    return this.find({ where: { companyId, isActive: true }, order: { journalCode: 'ASC' } });
  }

  async findByCompanyAndCode(companyId: number, journalCode: string): Promise<Journal | null> {
    return this.findOne({ where: { companyId, journalCode } });
  }

  async codeExistsForCompany(companyId: number, journalCode: string, excludeId?: number): Promise<boolean> {
    const query = this.createQueryBuilder('journal')
      .where('journal.companyId = :companyId', { companyId })
      .andWhere('journal.journalCode = :journalCode', { journalCode });
    if (excludeId) {
      query.andWhere('journal.id != :excludeId', { excludeId });
    }
    return (await query.getCount()) > 0;
  }

  async findByType(companyId: number, journalType: string): Promise<Journal[]> {
    return this.find({ where: { companyId, journalType }, order: { journalCode: 'ASC' } });
  }

  async softDelete(id: number): Promise<void> {
    await this.update(id, { isActive: false });
  }
}
