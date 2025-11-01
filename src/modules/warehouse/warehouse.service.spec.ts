import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseRepository } from './warehouse.repository';

describe('WarehouseService', () => {
  let service: WarehouseService;
  let repository: WarehouseRepository;

  const mockWarehouse = {
    id: 1,
    companyId: 1,
    warehouseCode: 'WH001',
    warehouseName: 'Main Warehouse',
    address: '123 Street',
    city: 'Paris',
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
    codeExistsForCompany: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehouseService,
        { provide: WarehouseRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<WarehouseService>(WarehouseService);
    repository = module.get<WarehouseRepository>(WarehouseRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a warehouse', async () => {
    mockRepository.codeExistsForCompany.mockResolvedValue(false);
    mockRepository.create.mockReturnValue(mockWarehouse);
    mockRepository.save.mockResolvedValue(mockWarehouse);

    const result = await service.create({
      companyId: 1,
      warehouseCode: 'WH001',
      warehouseName: 'Main Warehouse',
    });

    expect(result).toEqual(mockWarehouse);
  });

  it('should throw ConflictException if code exists', async () => {
    mockRepository.codeExistsForCompany.mockResolvedValue(true);

    await expect(
      service.create({
        companyId: 1,
        warehouseCode: 'WH001',
        warehouseName: 'Main Warehouse',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
