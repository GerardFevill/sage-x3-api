import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';

describe('PaymentService', () => {
  let service: PaymentService;
  let repository: PaymentRepository;

  const mockPayment = {
    id: 1,
    companyId: 1,
    paymentNumber: 'PAY-2025-001',
    paymentType: 'RECEIVED',
    businessPartnerId: 1,
    invoiceId: 1,
    paymentDate: new Date('2025-01-20'),
    currencyId: 1,
    exchangeRate: 1.0,
    amount: 500,
    paymentMethod: 'BANK_TRANSFER',
    reference: 'REF123456',
    notes: null,
    status: 'PENDING',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: null,
    updatedBy: null,
    company: null,
    businessPartner: null,
    currency: null,
    invoice: null,
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findByCompany: jest.fn(),
    findByBusinessPartner: jest.fn(),
    findByInvoice: jest.fn(),
    findByCompanyAndType: jest.fn(),
    findByCompanyAndStatus: jest.fn(),
    findByCompanyAndDateRange: jest.fn(),
    findByCompanyAndMethod: jest.fn(),
    findByCompanyAndNumber: jest.fn(),
    numberExistsForCompany: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
    getTotalByCompanyAndType: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: PaymentRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    repository = module.get<PaymentRepository>(PaymentRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a payment', async () => {
    mockRepository.numberExistsForCompany.mockResolvedValue(false);
    mockRepository.create.mockReturnValue(mockPayment);
    mockRepository.save.mockResolvedValue(mockPayment);

    const result = await service.create({
      companyId: 1,
      paymentNumber: 'PAY-2025-001',
      paymentType: 'RECEIVED',
      businessPartnerId: 1,
      invoiceId: 1,
      paymentDate: '2025-01-20',
      currencyId: 1,
      amount: 500,
      paymentMethod: 'BANK_TRANSFER',
    });

    expect(result).toEqual(mockPayment);
  });

  it('should throw ConflictException if payment number exists', async () => {
    mockRepository.numberExistsForCompany.mockResolvedValue(true);

    await expect(
      service.create({
        companyId: 1,
        paymentNumber: 'PAY-2025-001',
        paymentType: 'RECEIVED',
        businessPartnerId: 1,
        paymentDate: '2025-01-20',
        currencyId: 1,
        amount: 500,
        paymentMethod: 'BANK_TRANSFER',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw BadRequestException if amount is zero or negative', async () => {
    mockRepository.numberExistsForCompany.mockResolvedValue(false);

    await expect(
      service.create({
        companyId: 1,
        paymentNumber: 'PAY-2025-001',
        paymentType: 'RECEIVED',
        businessPartnerId: 1,
        paymentDate: '2025-01-20',
        currencyId: 1,
        amount: 0,
        paymentMethod: 'BANK_TRANSFER',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should get total payments by company and type', async () => {
    mockRepository.getTotalByCompanyAndType.mockResolvedValue(5000);

    const result = await service.getTotalByCompanyAndType(1, 'RECEIVED');

    expect(result).toBe(5000);
    expect(mockRepository.getTotalByCompanyAndType).toHaveBeenCalledWith(1, 'RECEIVED');
  });
});
