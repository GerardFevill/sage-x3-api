import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { BusinessPartnerRepository } from './business-partner.repository';
import { BusinessPartner } from './business-partner.entity';
import { CreateBusinessPartnerDto, UpdateBusinessPartnerDto } from './dto';

@Injectable()
export class BusinessPartnerService {
  private readonly logger = new Logger(BusinessPartnerService.name);

  constructor(private readonly businessPartnerRepository: BusinessPartnerRepository) {}

  async create(createBusinessPartnerDto: CreateBusinessPartnerDto): Promise<BusinessPartner> {
    const codeExists = await this.businessPartnerRepository.codeExistsForCompany(
      createBusinessPartnerDto.companyId,
      createBusinessPartnerDto.partnerCode,
    );
    if (codeExists) {
      throw new ConflictException(
        `Business partner with code ${createBusinessPartnerDto.partnerCode} already exists for this company`,
      );
    }
    const partner = this.businessPartnerRepository.create(createBusinessPartnerDto);
    return this.businessPartnerRepository.save(partner);
  }

  async findAll(): Promise<BusinessPartner[]> {
    return this.businessPartnerRepository.find({ order: { companyId: 'ASC', partnerCode: 'ASC' } });
  }

  async findByCompany(companyId: number): Promise<BusinessPartner[]> {
    return this.businessPartnerRepository.findByCompany(companyId);
  }

  async findActiveByCompany(companyId: number): Promise<BusinessPartner[]> {
    return this.businessPartnerRepository.findActiveByCompany(companyId);
  }

  async findOne(id: number): Promise<BusinessPartner> {
    const partner = await this.businessPartnerRepository.findOne({ where: { id } });
    if (!partner) {
      throw new NotFoundException(`Business partner with ID ${id} not found`);
    }
    return partner;
  }

  async findByCompanyAndCode(companyId: number, partnerCode: string): Promise<BusinessPartner> {
    const partner = await this.businessPartnerRepository.findByCompanyAndCode(companyId, partnerCode);
    if (!partner) {
      throw new NotFoundException(
        `Business partner with code ${partnerCode} not found for company ${companyId}`,
      );
    }
    return partner;
  }

  async findByType(companyId: number, partnerType: string): Promise<BusinessPartner[]> {
    return this.businessPartnerRepository.findByType(companyId, partnerType);
  }

  async search(companyId: number, query: string): Promise<BusinessPartner[]> {
    if (!query || query.trim().length < 2) {
      throw new BadRequestException('Search query must be at least 2 characters');
    }
    return this.businessPartnerRepository.search(companyId, query.trim());
  }

  async update(id: number, updateBusinessPartnerDto: UpdateBusinessPartnerDto): Promise<BusinessPartner> {
    const partner = await this.findOne(id);

    if (updateBusinessPartnerDto.partnerCode) {
      const codeExists = await this.businessPartnerRepository.codeExistsForCompany(
        partner.companyId,
        updateBusinessPartnerDto.partnerCode,
        id,
      );
      if (codeExists) {
        throw new ConflictException(
          `Business partner with code ${updateBusinessPartnerDto.partnerCode} already exists for this company`,
        );
      }
    }

    Object.assign(partner, updateBusinessPartnerDto);
    return this.businessPartnerRepository.save(partner);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.businessPartnerRepository.softDelete(id);
  }
}
