import { Injectable } from '@nestjs/common';
import { DataSource, Repository, Like } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async findByCompany(companyId: number): Promise<Product[]> {
    return this.find({ where: { companyId }, order: { productCode: 'ASC' } });
  }

  async findActiveByCompany(companyId: number): Promise<Product[]> {
    return this.find({ where: { companyId, isActive: true }, order: { productCode: 'ASC' } });
  }

  async findByCompanyAndCode(companyId: number, productCode: string): Promise<Product | null> {
    return this.findOne({ where: { companyId, productCode } });
  }

  async codeExistsForCompany(companyId: number, productCode: string, excludeId?: number): Promise<boolean> {
    const query = this.createQueryBuilder('product')
      .where('product.companyId = :companyId', { companyId })
      .andWhere('product.productCode = :productCode', { productCode });
    if (excludeId) {
      query.andWhere('product.id != :excludeId', { excludeId });
    }
    return (await query.getCount()) > 0;
  }

  async findByType(companyId: number, productType: string): Promise<Product[]> {
    return this.find({ where: { companyId, productType }, order: { productCode: 'ASC' } });
  }

  async findByCategory(companyId: number, productCategory: string): Promise<Product[]> {
    return this.find({ where: { companyId, productCategory }, order: { productCode: 'ASC' } });
  }

  async search(companyId: number, query: string): Promise<Product[]> {
    return this.find({
      where: [
        { companyId, productCode: Like(`%${query}%`) },
        { companyId, productName: Like(`%${query}%`) },
      ],
      order: { productCode: 'ASC' },
    });
  }

  async customSoftDelete(id: number): Promise<void> {
    await this.update(id, { isActive: false });
  }
}
