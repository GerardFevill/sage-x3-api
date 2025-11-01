import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { TaxCodeRepository } from './tax-code.repository';
import { TaxCode } from './tax-code.entity';
import { CreateTaxCodeDto, UpdateTaxCodeDto } from './dto';

@Injectable()
export class TaxCodeService {
  private readonly logger = new Logger(TaxCodeService.name);

  constructor(private readonly taxCodeRepository: TaxCodeRepository) {}

  async create(createTaxCodeDto: CreateTaxCodeDto): Promise<TaxCode> {
    const codeExists = await this.taxCodeRepository.codeExistsForCompany(
      createTaxCodeDto.companyId,
      createTaxCodeDto.taxCode,
    );
    if (codeExists) {
      throw new ConflictException(
        `Tax code ${createTaxCodeDto.taxCode} already exists for this company`,
      );
    }
    const taxCode = this.taxCodeRepository.create(createTaxCodeDto);
    return this.taxCodeRepository.save(taxCode);
  }

  async findAll(): Promise<TaxCode[]> {
    return this.taxCodeRepository.find({ order: { companyId: 'ASC', taxCode: 'ASC' } });
  }

  async findByCompany(companyId: number): Promise<TaxCode[]> {
    return this.taxCodeRepository.findByCompany(companyId);
  }

  async findActiveByCompany(companyId: number): Promise<TaxCode[]> {
    return this.taxCodeRepository.findActiveByCompany(companyId);
  }

  async findOne(id: number): Promise<TaxCode> {
    const taxCode = await this.taxCodeRepository.findOne({ where: { id } });
    if (!taxCode) {
      throw new NotFoundException(`Tax code with ID ${id} not found`);
    }
    return taxCode;
  }

  async findByCompanyAndCode(companyId: number, taxCode: string): Promise<TaxCode> {
    const tax = await this.taxCodeRepository.findByCompanyAndCode(companyId, taxCode);
    if (!tax) {
      throw new NotFoundException(
        `Tax code ${taxCode} not found for company ${companyId}`,
      );
    }
    return tax;
  }

  async findByType(companyId: number, taxType: string): Promise<TaxCode[]> {
    return this.taxCodeRepository.findByType(companyId, taxType);
  }

  async update(id: number, updateTaxCodeDto: UpdateTaxCodeDto): Promise<TaxCode> {
    const taxCode = await this.findOne(id);

    if (updateTaxCodeDto.taxCode) {
      const codeExists = await this.taxCodeRepository.codeExistsForCompany(
        taxCode.companyId,
        updateTaxCodeDto.taxCode,
        id,
      );
      if (codeExists) {
        throw new ConflictException(
          `Tax code ${updateTaxCodeDto.taxCode} already exists for this company`,
        );
      }
    }

    Object.assign(taxCode, updateTaxCodeDto);
    return this.taxCodeRepository.save(taxCode);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.taxCodeRepository.customSoftDelete(id);
  }
}
