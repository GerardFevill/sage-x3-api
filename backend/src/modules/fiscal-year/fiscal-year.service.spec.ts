import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { FiscalYearService } from './fiscal-year.service';
import { FiscalYearRepository } from './fiscal-year.repository';
import { FiscalYear } from './fiscal-year.entity';
import { CreateFiscalYearDto, UpdateFiscalYearDto } from './dto';

describe('FiscalYearService', () => {
  let service: FiscalYearService;
  let repository: FiscalYearRepository;

  // Mock data
  const mockFiscalYear: FiscalYear = {
    id: 1,
    companyId: 1,
    code: 'FY2024',
    name: 'Fiscal Year 2024',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    isClosed: false,
    closedDate: null,
    numberOfPeriods: 12,
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
    findByCompanyAndDate: jest.fn(),
    findOverlapping: jest.fn(),
    findClosedByCompany: jest.fn(),
    findOpenByCompany: jest.fn(),
    codeExistsForCompany: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
    closeFiscalYear: jest.fn(),
    reopenFiscalYear: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FiscalYearService,
        {
          provide: FiscalYearRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FiscalYearService>(FiscalYearService);
    repository = module.get<FiscalYearRepository>(FiscalYearRepository);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of fiscal years', async () => {
      const fiscalYears = [mockFiscalYear];
      mockRepository.find.mockResolvedValue(fiscalYears);

      const result = await service.findAll();

      expect(result).toEqual(fiscalYears);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { companyId: 'ASC', startDate: 'DESC' },
      });
    });
  });

  describe('findByCompany', () => {
    it('should return fiscal years for a company', async () => {
      const fiscalYears = [mockFiscalYear];
      mockRepository.findByCompany.mockResolvedValue(fiscalYears);

      const result = await service.findByCompany(1);

      expect(result).toEqual(fiscalYears);
      expect(mockRepository.findByCompany).toHaveBeenCalledWith(1);
    });
  });

  describe('findActiveByCompany', () => {
    it('should return active fiscal years for a company', async () => {
      const fiscalYears = [mockFiscalYear];
      mockRepository.findActiveByCompany.mockResolvedValue(fiscalYears);

      const result = await service.findActiveByCompany(1);

      expect(result).toEqual(fiscalYears);
      expect(mockRepository.findActiveByCompany).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('should return a fiscal year by ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockFiscalYear);

      const result = await service.findOne(1);

      expect(result).toEqual(mockFiscalYear);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when fiscal year not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Fiscal year with ID 999 not found',
      );
    });
  });

  describe('findByCompanyAndCode', () => {
    it('should return a fiscal year by company and code', async () => {
      mockRepository.findByCompanyAndCode.mockResolvedValue(mockFiscalYear);

      const result = await service.findByCompanyAndCode(1, 'FY2024');

      expect(result).toEqual(mockFiscalYear);
      expect(mockRepository.findByCompanyAndCode).toHaveBeenCalledWith(
        1,
        'FY2024',
      );
    });

    it('should throw NotFoundException when fiscal year not found', async () => {
      mockRepository.findByCompanyAndCode.mockResolvedValue(null);

      await expect(service.findByCompanyAndCode(1, 'FY9999')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findByCompanyAndCode(1, 'FY9999')).rejects.toThrow(
        'Fiscal year with code FY9999 not found for company 1',
      );
    });
  });

  describe('findByCompanyAndDate', () => {
    it('should find fiscal year containing a date', async () => {
      mockRepository.findByCompanyAndDate.mockResolvedValue(mockFiscalYear);

      const result = await service.findByCompanyAndDate(1, '2024-06-15');

      expect(result).toEqual(mockFiscalYear);
      expect(mockRepository.findByCompanyAndDate).toHaveBeenCalledWith(
        1,
        new Date('2024-06-15'),
      );
    });

    it('should throw NotFoundException when no fiscal year found for date', async () => {
      mockRepository.findByCompanyAndDate.mockResolvedValue(null);

      await expect(
        service.findByCompanyAndDate(1, '2099-01-01'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createDto: CreateFiscalYearDto = {
      companyId: 1,
      code: 'FY2024',
      name: 'Fiscal Year 2024',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      numberOfPeriods: 12,
      isActive: true,
    };

    it('should create a new fiscal year', async () => {
      mockRepository.codeExistsForCompany.mockResolvedValue(false);
      mockRepository.findOverlapping.mockResolvedValue([]);
      mockRepository.create.mockReturnValue(mockFiscalYear);
      mockRepository.save.mockResolvedValue(mockFiscalYear);

      const result = await service.create(createDto);

      expect(result).toEqual(mockFiscalYear);
      expect(mockRepository.codeExistsForCompany).toHaveBeenCalledWith(
        1,
        'FY2024',
      );
      expect(mockRepository.findOverlapping).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith(mockFiscalYear);
    });

    it('should throw BadRequestException if start date is after end date', async () => {
      const invalidDto = { ...createDto, endDate: '2023-12-31' };

      await expect(service.create(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(invalidDto)).rejects.toThrow(
        'Start date must be before end date',
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if code already exists', async () => {
      mockRepository.codeExistsForCompany.mockResolvedValue(true);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createDto)).rejects.toThrow(
        'Fiscal year with code FY2024 already exists for this company',
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if dates overlap', async () => {
      mockRepository.codeExistsForCompany.mockResolvedValue(false);
      mockRepository.findOverlapping.mockResolvedValue([
        { ...mockFiscalYear, code: 'FY2023' },
      ]);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createDto)).rejects.toThrow(
        'Fiscal year dates overlap with existing fiscal year: FY2023',
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateDto: UpdateFiscalYearDto = {
      name: 'Updated Fiscal Year 2024',
    };

    it('should update a fiscal year', async () => {
      mockRepository.findOne.mockResolvedValue(mockFiscalYear);
      mockRepository.save.mockResolvedValue({
        ...mockFiscalYear,
        ...updateDto,
      });

      const result = await service.update(1, updateDto);

      expect(result.name).toBe('Updated Fiscal Year 2024');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when fiscal year not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when updating a closed fiscal year', async () => {
      mockRepository.findOne.mockResolvedValue({
        ...mockFiscalYear,
        isClosed: true,
      });

      await expect(service.update(1, updateDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.update(1, updateDto)).rejects.toThrow(
        'Cannot update a closed fiscal year. Reopen it first.',
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when updating to existing code', async () => {
      const updateWithCode: UpdateFiscalYearDto = { code: 'FY2025' };
      mockRepository.findOne.mockResolvedValue(mockFiscalYear);
      mockRepository.codeExistsForCompany.mockResolvedValue(true);

      await expect(service.update(1, updateWithCode)).rejects.toThrow(
        ConflictException,
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if new dates are invalid', async () => {
      const updateWithDates: UpdateFiscalYearDto = {
        startDate: '2024-12-31',
        endDate: '2024-01-01',
      };
      mockRepository.findOne.mockResolvedValue(mockFiscalYear);

      await expect(service.update(1, updateWithDates)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.update(1, updateWithDates)).rejects.toThrow(
        'Start date must be before end date',
      );
    });

    it('should throw ConflictException if new dates overlap', async () => {
      const updateWithDates: UpdateFiscalYearDto = {
        startDate: '2024-06-01',
        endDate: '2025-05-31',
      };
      mockRepository.findOne.mockResolvedValue(mockFiscalYear);
      mockRepository.findOverlapping.mockResolvedValue([
        { ...mockFiscalYear, code: 'FY2025', id: 2 },
      ]);

      await expect(service.update(1, updateWithDates)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a fiscal year', async () => {
      mockRepository.findOne.mockResolvedValue(mockFiscalYear);
      mockRepository.softDelete.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when fiscal year not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.softDelete).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when deleting closed fiscal year', async () => {
      mockRepository.findOne.mockResolvedValue({
        ...mockFiscalYear,
        isClosed: true,
      });

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
      await expect(service.remove(1)).rejects.toThrow(
        'Cannot delete a closed fiscal year',
      );
      expect(mockRepository.softDelete).not.toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should close a fiscal year', async () => {
      mockRepository.findOne.mockResolvedValue(mockFiscalYear);
      mockRepository.closeFiscalYear.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValueOnce(mockFiscalYear); // First call in close()
      mockRepository.findOne.mockResolvedValueOnce({
        // Second call to return updated
        ...mockFiscalYear,
        isClosed: true,
        closedDate: new Date(),
      });

      const result = await service.close(1);

      expect(mockRepository.closeFiscalYear).toHaveBeenCalledWith(
        1,
        expect.any(Date),
      );
      expect(result.isClosed).toBe(true);
    });

    it('should throw BadRequestException if already closed', async () => {
      mockRepository.findOne.mockResolvedValue({
        ...mockFiscalYear,
        isClosed: true,
      });

      await expect(service.close(1)).rejects.toThrow(BadRequestException);
      await expect(service.close(1)).rejects.toThrow(
        'Fiscal year is already closed',
      );
      expect(mockRepository.closeFiscalYear).not.toHaveBeenCalled();
    });
  });

  describe('reopen', () => {
    it('should reopen a fiscal year', async () => {
      mockRepository.findOne.mockResolvedValue({
        ...mockFiscalYear,
        isClosed: true,
      });
      mockRepository.reopenFiscalYear.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValueOnce({
        ...mockFiscalYear,
        isClosed: true,
      }); // First call
      mockRepository.findOne.mockResolvedValueOnce(mockFiscalYear); // Second call to return updated

      const result = await service.reopen(1);

      expect(mockRepository.reopenFiscalYear).toHaveBeenCalledWith(1);
      expect(result.isClosed).toBe(false);
    });

    it('should throw BadRequestException if not closed', async () => {
      mockRepository.findOne.mockResolvedValue(mockFiscalYear);

      await expect(service.reopen(1)).rejects.toThrow(BadRequestException);
      await expect(service.reopen(1)).rejects.toThrow(
        'Fiscal year is not closed',
      );
      expect(mockRepository.reopenFiscalYear).not.toHaveBeenCalled();
    });
  });

  describe('findClosedByCompany', () => {
    it('should return closed fiscal years', async () => {
      const closedFiscalYears = [{ ...mockFiscalYear, isClosed: true }];
      mockRepository.findClosedByCompany.mockResolvedValue(closedFiscalYears);

      const result = await service.findClosedByCompany(1);

      expect(result).toEqual(closedFiscalYears);
      expect(mockRepository.findClosedByCompany).toHaveBeenCalledWith(1);
    });
  });

  describe('findOpenByCompany', () => {
    it('should return open fiscal years', async () => {
      const openFiscalYears = [mockFiscalYear];
      mockRepository.findOpenByCompany.mockResolvedValue(openFiscalYears);

      const result = await service.findOpenByCompany(1);

      expect(result).toEqual(openFiscalYears);
      expect(mockRepository.findOpenByCompany).toHaveBeenCalledWith(1);
    });
  });
});
