import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Warehouse } from './warehouse.entity';

@Injectable()
export class WarehouseRepository extends Repository<Warehouse> {
  constructor(private dataSource: DataSource) {
    super(Warehouse, dataSource.createEntityManager());
  }

  async findByCompany(companyId: number): Promise<Warehouse[]> {
    return this.find({ where: { companyId }, order: { warehouseCode: 'ASC' } });
  }

  async findActiveByCompany(companyId: number): Promise<Warehouse[]> {
    return this.find({ where: { companyId, isActive: true }, order: { warehouseCode: 'ASC' } });
  }

  async findByCompanyAndCode(companyId: number, warehouseCode: string): Promise<Warehouse | null> {
    return this.findOne({ where: { companyId, warehouseCode } });
  }

  async codeExistsForCompany(companyId: number, warehouseCode: string, excludeId?: number): Promise<boolean> {
    const query = this.createQueryBuilder('warehouse')
      .where('warehouse.companyId = :companyId', { companyId })
      .andWhere('warehouse.warehouseCode = :warehouseCode', { warehouseCode });
    if (excludeId) {
      query.andWhere('warehouse.id != :excludeId', { excludeId });
    }
    return (await query.getCount()) > 0;
  }

  async softDelete(id: number): Promise<void> {
    await this.update(id, { isActive: false });
  }
}
