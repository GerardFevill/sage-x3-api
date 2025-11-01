import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { WarehouseRepository } from './warehouse.repository';
import { Warehouse } from './warehouse.entity';
import { CreateWarehouseDto, UpdateWarehouseDto } from './dto';

@Injectable()
export class WarehouseService {
  private readonly logger = new Logger(WarehouseService.name);

  constructor(private readonly warehouseRepository: WarehouseRepository) {}

  async create(createWarehouseDto: CreateWarehouseDto): Promise<Warehouse> {
    const codeExists = await this.warehouseRepository.codeExistsForCompany(
      createWarehouseDto.companyId,
      createWarehouseDto.warehouseCode,
    );
    if (codeExists) {
      throw new ConflictException(
        `Warehouse with code ${createWarehouseDto.warehouseCode} already exists for this company`,
      );
    }
    const warehouse = this.warehouseRepository.create(createWarehouseDto);
    return this.warehouseRepository.save(warehouse);
  }

  async findAll(): Promise<Warehouse[]> {
    return this.warehouseRepository.find({ order: { companyId: 'ASC', warehouseCode: 'ASC' } });
  }

  async findByCompany(companyId: number): Promise<Warehouse[]> {
    return this.warehouseRepository.findByCompany(companyId);
  }

  async findActiveByCompany(companyId: number): Promise<Warehouse[]> {
    return this.warehouseRepository.findActiveByCompany(companyId);
  }

  async findOne(id: number): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findOne({ where: { id } });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    return warehouse;
  }

  async findByCompanyAndCode(companyId: number, warehouseCode: string): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findByCompanyAndCode(companyId, warehouseCode);
    if (!warehouse) {
      throw new NotFoundException(
        `Warehouse with code ${warehouseCode} not found for company ${companyId}`,
      );
    }
    return warehouse;
  }

  async update(id: number, updateWarehouseDto: UpdateWarehouseDto): Promise<Warehouse> {
    const warehouse = await this.findOne(id);

    if (updateWarehouseDto.warehouseCode) {
      const codeExists = await this.warehouseRepository.codeExistsForCompany(
        warehouse.companyId,
        updateWarehouseDto.warehouseCode,
        id,
      );
      if (codeExists) {
        throw new ConflictException(
          `Warehouse with code ${updateWarehouseDto.warehouseCode} already exists for this company`,
        );
      }
    }

    Object.assign(warehouse, updateWarehouseDto);
    return this.warehouseRepository.save(warehouse);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.warehouseRepository.customSoftDelete(id);
  }
}
