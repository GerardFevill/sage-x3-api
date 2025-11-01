import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyRepository } from './currency.repository';
import { Currency } from './currency.entity';
import { CreateCurrencyDto, UpdateCurrencyDto } from './dto';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let repository: CurrencyRepository;

  // Mock data
  const mockCurrency: Currency = {
    id: 1,
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    decimalPlaces: 2,
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
    findByDecimalPlaces: jest.fn(),
    codeExists: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyService,
        {
          provide: CurrencyRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CurrencyService>(CurrencyService);
    repository = module.get<CurrencyRepository>(CurrencyRepository);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of currencies', async () => {
      const currencies = [mockCurrency];
      mockRepository.find.mockResolvedValue(currencies);

      const result = await service.findAll();

      expect(result).toEqual(currencies);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { code: 'ASC' },
      });
    });
  });

  describe('findActive', () => {
    it('should return only active currencies', async () => {
      const currencies = [mockCurrency];
      mockRepository.findActive.mockResolvedValue(currencies);

      const result = await service.findActive();

      expect(result).toEqual(currencies);
      expect(mockRepository.findActive).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a currency by ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockCurrency);

      const result = await service.findOne(1);

      expect(result).toEqual(mockCurrency);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when currency not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Currency with ID 999 not found',
      );
    });
  });

  describe('findByCode', () => {
    it('should return a currency by code', async () => {
      mockRepository.findByCode.mockResolvedValue(mockCurrency);

      const result = await service.findByCode('EUR');

      expect(result).toEqual(mockCurrency);
      expect(mockRepository.findByCode).toHaveBeenCalledWith('EUR');
    });

    it('should throw NotFoundException when currency code not found', async () => {
      mockRepository.findByCode.mockResolvedValue(null);

      await expect(service.findByCode('XXX')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findByCode('XXX')).rejects.toThrow(
        'Currency with code XXX not found',
      );
    });
  });

  describe('create', () => {
    const createDto: CreateCurrencyDto = {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      decimalPlaces: 2,
      isActive: true,
    };

    it('should create a new currency', async () => {
      mockRepository.codeExists.mockResolvedValue(false);
      mockRepository.create.mockReturnValue(mockCurrency);
      mockRepository.save.mockResolvedValue(mockCurrency);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCurrency);
      expect(mockRepository.codeExists).toHaveBeenCalledWith('EUR');
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        code: 'EUR', // Should be uppercase
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockCurrency);
    });

    it('should convert code to uppercase', async () => {
      const lowerCaseDto = { ...createDto, code: 'eur' };
      mockRepository.codeExists.mockResolvedValue(false);
      mockRepository.create.mockReturnValue(mockCurrency);
      mockRepository.save.mockResolvedValue(mockCurrency);

      await service.create(lowerCaseDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...lowerCaseDto,
        code: 'EUR', // Converted to uppercase
      });
    });

    it('should throw ConflictException if code already exists', async () => {
      mockRepository.codeExists.mockResolvedValue(true);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createDto)).rejects.toThrow(
        'Currency with code EUR already exists',
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateDto: UpdateCurrencyDto = {
      name: 'Euro Updated',
    };

    it('should update a currency', async () => {
      mockRepository.findOne.mockResolvedValue(mockCurrency);
      mockRepository.save.mockResolvedValue({ ...mockCurrency, ...updateDto });

      const result = await service.update(1, updateDto);

      expect(result.name).toBe('Euro Updated');
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when currency not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when updating to existing code', async () => {
      const updateWithCode: UpdateCurrencyDto = { code: 'USD' };
      mockRepository.findOne.mockResolvedValue(mockCurrency);
      mockRepository.codeExists.mockResolvedValue(true);

      await expect(service.update(1, updateWithCode)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.update(1, updateWithCode)).rejects.toThrow(
        'Currency with code USD already exists',
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should convert code to uppercase when updating', async () => {
      const updateWithCode: UpdateCurrencyDto = { code: 'usd' };
      mockRepository.findOne.mockResolvedValue(mockCurrency);
      mockRepository.codeExists.mockResolvedValue(false);
      mockRepository.save.mockResolvedValue({
        ...mockCurrency,
        code: 'USD',
      });

      await service.update(1, updateWithCode);

      expect(updateWithCode.code).toBe('USD'); // Should be converted
    });
  });

  describe('remove', () => {
    it('should soft delete a currency', async () => {
      mockRepository.findOne.mockResolvedValue(mockCurrency);
      mockRepository.softDelete.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when currency not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.softDelete).not.toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('should search currencies by query', async () => {
      const currencies = [mockCurrency];
      mockRepository.search.mockResolvedValue(currencies);

      const result = await service.search('Euro');

      expect(result).toEqual(currencies);
      expect(mockRepository.search).toHaveBeenCalledWith('Euro');
    });

    it('should trim search query', async () => {
      const currencies = [mockCurrency];
      mockRepository.search.mockResolvedValue(currencies);

      await service.search('  Euro  ');

      expect(mockRepository.search).toHaveBeenCalledWith('Euro');
    });

    it('should throw BadRequestException for short query', async () => {
      await expect(service.search('E')).rejects.toThrow(
        'Search query must be at least 2 characters',
      );
      await expect(service.search('')).rejects.toThrow(
        'Search query must be at least 2 characters',
      );
      expect(mockRepository.search).not.toHaveBeenCalled();
    });
  });

  describe('findByDecimalPlaces', () => {
    it('should find currencies by decimal places', async () => {
      const currencies = [mockCurrency];
      mockRepository.findByDecimalPlaces.mockResolvedValue(currencies);

      const result = await service.findByDecimalPlaces(2);

      expect(result).toEqual(currencies);
      expect(mockRepository.findByDecimalPlaces).toHaveBeenCalledWith(2);
    });

    it('should throw BadRequestException for invalid decimal places', async () => {
      await expect(service.findByDecimalPlaces(-1)).rejects.toThrow(
        'Decimal places must be between 0 and 4',
      );
      await expect(service.findByDecimalPlaces(5)).rejects.toThrow(
        'Decimal places must be between 0 and 4',
      );
      expect(mockRepository.findByDecimalPlaces).not.toHaveBeenCalled();
    });

    it('should accept valid decimal places (0-4)', async () => {
      const currencies = [mockCurrency];
      mockRepository.findByDecimalPlaces.mockResolvedValue(currencies);

      for (let i = 0; i <= 4; i++) {
        await service.findByDecimalPlaces(i);
        expect(mockRepository.findByDecimalPlaces).toHaveBeenCalledWith(i);
      }
    });
  });
});
