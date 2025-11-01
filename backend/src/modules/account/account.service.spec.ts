import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountRepository } from './account.repository';
import { Account } from './account.entity';

describe('AccountService', () => {
  let service: AccountService;
  let repository: AccountRepository;

  const mockAccount: Account = {
    id: 1,
    companyId: 1,
    chartOfAccountsId: 1,
    accountCode: '401000',
    accountName: 'Revenue - Sales',
    accountType: 'REVENUE',
    accountCategory: 'SALES',
    parentAccountId: null,
    normalBalance: 'CREDIT',
    isControlAccount: false,
    allowPosting: true,
    requireReconciliation: false,
    isActive: true,
    description: 'Revenue from sales',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: null,
    updatedBy: null,
    company: null,
    parentAccount: null,
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findByCompany: jest.fn(),
    findActiveByCompany: jest.fn(),
    findByCompanyAndCode: jest.fn(),
    findByType: jest.fn(),
    findByCategory: jest.fn(),
    findPostableAccounts: jest.fn(),
    findByParent: jest.fn(),
    codeExistsForCompany: jest.fn(),
    search: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        { provide: AccountRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    repository = module.get<AccountRepository>(AccountRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new account', async () => {
      mockRepository.codeExistsForCompany.mockResolvedValue(false);
      mockRepository.create.mockReturnValue(mockAccount);
      mockRepository.save.mockResolvedValue(mockAccount);

      const result = await service.create({
        companyId: 1,
        accountCode: '401000',
        accountName: 'Revenue - Sales',
        accountType: 'REVENUE',
        normalBalance: 'CREDIT',
      });

      expect(result).toEqual(mockAccount);
      expect(mockRepository.codeExistsForCompany).toHaveBeenCalled();
    });

    it('should throw ConflictException if code exists', async () => {
      mockRepository.codeExistsForCompany.mockResolvedValue(true);

      await expect(
        service.create({
          companyId: 1,
          accountCode: '401000',
          accountName: 'Revenue - Sales',
          accountType: 'REVENUE',
          normalBalance: 'CREDIT',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return an account by ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockAccount);
      const result = await service.findOne(1);
      expect(result).toEqual(mockAccount);
    });

    it('should throw NotFoundException when not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('search', () => {
    it('should search accounts', async () => {
      mockRepository.search.mockResolvedValue([mockAccount]);
      const result = await service.search(1, 'Revenue');
      expect(result).toEqual([mockAccount]);
    });

    it('should throw BadRequestException for short query', async () => {
      await expect(service.search(1, 'R')).rejects.toThrow(BadRequestException);
    });
  });
});
