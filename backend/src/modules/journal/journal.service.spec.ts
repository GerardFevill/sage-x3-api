import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { JournalService } from './journal.service';
import { JournalRepository } from './journal.repository';

describe('JournalService', () => {
  let service: JournalService;
  let repository: JournalRepository;

  const mockJournal = {
    id: 1,
    companyId: 1,
    journalCode: 'VE',
    journalName: 'Ventes',
    journalType: 'SALES',
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
    codeExistsForCompany: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalService,
        { provide: JournalRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<JournalService>(JournalService);
    repository = module.get<JournalRepository>(JournalRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a journal', async () => {
    mockRepository.codeExistsForCompany.mockResolvedValue(false);
    mockRepository.create.mockReturnValue(mockJournal);
    mockRepository.save.mockResolvedValue(mockJournal);

    const result = await service.create({
      companyId: 1,
      journalCode: 'VE',
      journalName: 'Ventes',
      journalType: 'SALES',
    });

    expect(result).toEqual(mockJournal);
  });

  it('should throw ConflictException if code exists', async () => {
    mockRepository.codeExistsForCompany.mockResolvedValue(true);

    await expect(
      service.create({
        companyId: 1,
        journalCode: 'VE',
        journalName: 'Ventes',
        journalType: 'SALES',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
