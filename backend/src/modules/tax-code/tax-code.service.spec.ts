import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { TaxCodeService } from './tax-code.service';
import { TaxCodeRepository } from './tax-code.repository';

describe('TaxCodeService', () => {
  let service: TaxCodeService;
  let repository: TaxCodeRepository;

  const mockTaxCode = {
    id: 1,
    companyId: 1,
    taxCode: 'TVA20',
    taxDescription: 'TVA 20%',
    taxRate: 20.00,
    taxType: 'VAT',
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
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaxCodeService,
        { provide: TaxCodeRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<TaxCodeService>(TaxCodeService);
    repository = module.get<TaxCodeRepository>(TaxCodeRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a tax code', async () => {
    mockRepository.codeExistsForCompany.mockResolvedValue(false);
    mockRepository.create.mockReturnValue(mockTaxCode);
    mockRepository.save.mockResolvedValue(mockTaxCode);

    const result = await service.create({
      companyId: 1,
      taxCode: 'TVA20',
      taxDescription: 'TVA 20%',
      taxRate: 20.00,
      taxType: 'VAT',
    });

    expect(result).toEqual(mockTaxCode);
  });

  it('should throw ConflictException if code exists', async () => {
    mockRepository.codeExistsForCompany.mockResolvedValue(true);

    await expect(
      service.create({
        companyId: 1,
        taxCode: 'TVA20',
        taxDescription: 'TVA 20%',
        taxRate: 20.00,
        taxType: 'VAT',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
