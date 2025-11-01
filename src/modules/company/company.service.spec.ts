import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyRepository } from './company.repository';
import { Company } from './company.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';

describe('CompanyService', () => {
  let service: CompanyService;
  let repository: CompanyRepository;

  // Mock data
  const mockCompany: Company = {
    id: 1,
    code: 'FR01',
    name: 'ACME France',
    legalName: 'ACME France SAS',
    taxId: '12345678901234',
    registrationNumber: '123 456 789 RCS Paris',
    addressLine1: '123 Avenue des Champs-Élysées',
    addressLine2: null,
    city: 'Paris',
    stateProvince: 'Île-de-France',
    postalCode: '75008',
    countryCode: 'FR',
    defaultCurrencyId: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: null,
    updatedBy: null,
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findActive: jest.fn(),
    findByCode: jest.fn(),
    findByCountry: jest.fn(),
    codeExists: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: CompanyRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    repository = module.get<CompanyRepository>(CompanyRepository);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of companies', async () => {
      const companies = [mockCompany];
      mockRepository.find.mockResolvedValue(companies);

      const result = await service.findAll();

      expect(result).toEqual(companies);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { code: 'ASC' },
      });
    });
  });

  describe('findActive', () => {
    it('should return only active companies', async () => {
      const companies = [mockCompany];
      mockRepository.findActive.mockResolvedValue(companies);

      const result = await service.findActive();

      expect(result).toEqual(companies);
      expect(mockRepository.findActive).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a company by ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockCompany);

      const result = await service.findOne(1);

      expect(result).toEqual(mockCompany);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when company not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Company with ID 999 not found');
    });
  });

  describe('findByCode', () => {
    it('should return a company by code', async () => {
      mockRepository.findByCode.mockResolvedValue(mockCompany);

      const result = await service.findByCode('FR01');

      expect(result).toEqual(mockCompany);
      expect(mockRepository.findByCode).toHaveBeenCalledWith('FR01');
    });

    it('should throw NotFoundException when company code not found', async () => {
      mockRepository.findByCode.mockResolvedValue(null);

      await expect(service.findByCode('XX99')).rejects.toThrow(NotFoundException);
      await expect(service.findByCode('XX99')).rejects.toThrow('Company with code XX99 not found');
    });
  });

  describe('create', () => {
    const createDto: CreateCompanyDto = {
      code: 'FR01',
      name: 'ACME France',
      legalName: 'ACME France SAS',
      isActive: true,
    };

    it('should create a new company', async () => {
      mockRepository.codeExists.mockResolvedValue(false);
      mockRepository.create.mockReturnValue(mockCompany);
      mockRepository.save.mockResolvedValue(mockCompany);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCompany);
      expect(mockRepository.codeExists).toHaveBeenCalledWith('FR01');
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCompany);
    });

    it('should throw ConflictException if code already exists', async () => {
      mockRepository.codeExists.mockResolvedValue(true);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createDto)).rejects.toThrow('Company with code FR01 already exists');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateDto: UpdateCompanyDto = {
      name: 'ACME France Updated',
    };

    it('should update a company', async () => {
      mockRepository.findOne.mockResolvedValue(mockCompany);
      mockRepository.save.mockResolvedValue({ ...mockCompany, ...updateDto });

      const result = await service.update(1, updateDto);

      expect(result.name).toBe('ACME France Updated');
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when company not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when updating to existing code', async () => {
      const updateWithCode: UpdateCompanyDto = { code: 'US01' };
      mockRepository.findOne.mockResolvedValue(mockCompany);
      mockRepository.codeExists.mockResolvedValue(true);

      await expect(service.update(1, updateWithCode)).rejects.toThrow(ConflictException);
      await expect(service.update(1, updateWithCode)).rejects.toThrow('Company with code US01 already exists');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should soft delete a company', async () => {
      mockRepository.findOne.mockResolvedValue(mockCompany);
      mockRepository.softDelete.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when company not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.softDelete).not.toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('should search companies by query', async () => {
      const companies = [mockCompany];
      mockRepository.search.mockResolvedValue(companies);

      const result = await service.search('ACME');

      expect(result).toEqual(companies);
      expect(mockRepository.search).toHaveBeenCalledWith('ACME');
    });

    it('should throw BadRequestException for short query', async () => {
      await expect(service.search('A')).rejects.toThrow('Search query must be at least 2 characters');
      expect(mockRepository.search).not.toHaveBeenCalled();
    });
  });

  describe('findByCountry', () => {
    it('should find companies by country code', async () => {
      const companies = [mockCompany];
      mockRepository.findByCountry.mockResolvedValue(companies);

      const result = await service.findByCountry('FR');

      expect(result).toEqual(companies);
      expect(mockRepository.findByCountry).toHaveBeenCalledWith('FR');
    });

    it('should throw BadRequestException for invalid country code', async () => {
      await expect(service.findByCountry('FRA')).rejects.toThrow('Invalid country code format');
      await expect(service.findByCountry('F1')).rejects.toThrow('Invalid country code format');
      expect(mockRepository.findByCountry).not.toHaveBeenCalled();
    });
  });
});
