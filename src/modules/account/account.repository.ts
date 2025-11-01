import { Injectable } from '@nestjs/common';
import { DataSource, Repository, Like, In } from 'typeorm';
import { Account } from './account.entity';

@Injectable()
export class AccountRepository extends Repository<Account> {
  constructor(private dataSource: DataSource) {
    super(Account, dataSource.createEntityManager());
  }

  async findByCompany(companyId: number): Promise<Account[]> {
    return this.find({
      where: { companyId },
      order: { accountCode: 'ASC' },
    });
  }

  async findActiveByCompany(companyId: number): Promise<Account[]> {
    return this.find({
      where: { companyId, isActive: true },
      order: { accountCode: 'ASC' },
    });
  }

  async findByCompanyAndCode(
    companyId: number,
    accountCode: string,
  ): Promise<Account | null> {
    return this.findOne({
      where: { companyId, accountCode },
    });
  }

  async codeExistsForCompany(
    companyId: number,
    accountCode: string,
    excludeId?: number,
  ): Promise<boolean> {
    const query = this.createQueryBuilder('account')
      .where('account.companyId = :companyId', { companyId })
      .andWhere('account.accountCode = :accountCode', { accountCode });

    if (excludeId) {
      query.andWhere('account.id != :excludeId', { excludeId });
    }

    const count = await query.getCount();
    return count > 0;
  }

  async findByType(companyId: number, accountType: string): Promise<Account[]> {
    return this.find({
      where: { companyId, accountType },
      order: { accountCode: 'ASC' },
    });
  }

  async findByCategory(
    companyId: number,
    accountCategory: string,
  ): Promise<Account[]> {
    return this.find({
      where: { companyId, accountCategory },
      order: { accountCode: 'ASC' },
    });
  }

  async search(companyId: number, query: string): Promise<Account[]> {
    return this.find({
      where: [
        { companyId, accountCode: Like(`%${query}%`) },
        { companyId, accountName: Like(`%${query}%`) },
      ],
      order: { accountCode: 'ASC' },
    });
  }

  async findPostableAccounts(companyId: number): Promise<Account[]> {
    return this.find({
      where: { companyId, allowPosting: true, isActive: true },
      order: { accountCode: 'ASC' },
    });
  }

  async findByParent(
    companyId: number,
    parentAccountId: number,
  ): Promise<Account[]> {
    return this.find({
      where: { companyId, parentAccountId },
      order: { accountCode: 'ASC' },
    });
  }

  async customSoftDelete(id: number): Promise<void> {
    await this.update(id, { isActive: false });
  }
}
