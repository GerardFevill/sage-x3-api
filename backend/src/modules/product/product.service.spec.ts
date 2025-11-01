import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';

describe('ProductService', () => {
  let service: ProductService;
  let repository: ProductRepository;

  const mockProduct = {
    id: 1,
    companyId: 1,
    productCode: 'PROD001',
    productName: 'Laptop Pro',
    productType: 'GOODS',
    productCategory: 'Electronics',
    unitPrice: 999.99,
    costPrice: 600.00,
    unitOfMeasure: 'EA',
    trackInventory: true,
    isActive: true,
    description: null,
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
    findByCategory: jest.fn(),
    codeExistsForCompany: jest.fn(),
    search: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: ProductRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<ProductRepository>(ProductRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', async () => {
    mockRepository.codeExistsForCompany.mockResolvedValue(false);
    mockRepository.create.mockReturnValue(mockProduct);
    mockRepository.save.mockResolvedValue(mockProduct);

    const result = await service.create({
      companyId: 1,
      productCode: 'PROD001',
      productName: 'Laptop Pro',
      productType: 'GOODS',
      unitPrice: 999.99,
      unitOfMeasure: 'EA',
    });

    expect(result).toEqual(mockProduct);
  });

  it('should throw ConflictException if code exists', async () => {
    mockRepository.codeExistsForCompany.mockResolvedValue(true);

    await expect(
      service.create({
        companyId: 1,
        productCode: 'PROD001',
        productName: 'Laptop Pro',
        productType: 'GOODS',
        unitPrice: 999.99,
        unitOfMeasure: 'EA',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
