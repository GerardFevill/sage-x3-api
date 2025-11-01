import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { BusinessPartnerService } from './business-partner.service';
import { BusinessPartnerRepository } from './business-partner.repository';

describe('BusinessPartnerService', () => {
  let service: BusinessPartnerService;
  let repository: BusinessPartnerRepository;

  const mockPartner = {
    id: 1,
    companyId: 1,
    partnerCode: 'CLI001',
    partnerName: 'ACME Corp',
    partnerType: 'CUSTOMER',
    taxId: null,
    email: 'contact@acme.com',
    phone: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: null,
    updatedBy: null,
    company: null,
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findByCompany: jest.fn(),
    findActiveByCompany: jest.fn(),
    findByCompanyAndCode: jest.fn(),
    findByType: jest.fn(),
    codeExistsForCompany: jest.fn(),
    search: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessPartnerService,
        { provide: BusinessPartnerRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<BusinessPartnerService>(BusinessPartnerService);
    repository = module.get<BusinessPartnerRepository>(BusinessPartnerRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a business partner', async () => {
    mockRepository.codeExistsForCompany.mockResolvedValue(false);
    mockRepository.create.mockReturnValue(mockPartner);
    mockRepository.save.mockResolvedValue(mockPartner);

    const result = await service.create({
      companyId: 1,
      partnerCode: 'CLI001',
      partnerName: 'ACME Corp',
      partnerType: 'CUSTOMER',
    });

    expect(result).toEqual(mockPartner);
  });

  it('should throw ConflictException if code exists', async () => {
    mockRepository.codeExistsForCompany.mockResolvedValue(true);

    await expect(
      service.create({
        companyId: 1,
        partnerCode: 'CLI001',
        partnerName: 'ACME Corp',
        partnerType: 'CUSTOMER',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
