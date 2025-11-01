import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceRepository } from './invoice.repository';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let repository: InvoiceRepository;

  const mockInvoice = {
    id: 1,
    companyId: 1,
    invoiceNumber: 'INV-2025-001',
    invoiceType: 'SALES',
    businessPartnerId: 1,
    invoiceDate: new Date('2025-01-15'),
    dueDate: new Date('2025-02-15'),
    currencyId: 1,
    exchangeRate: 1.0,
    totalBeforeTax: 1000,
    totalTax: 200,
    totalAmount: 1200,
    paidAmount: 0,
    balance: 1200,
    status: 'DRAFT',
    fiscalYearId: 1,
    notes: null,
    poReference: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: null,
    updatedBy: null,
    company: null,
    businessPartner: null,
    currency: null,
    fiscalYear: null,
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findByCompany: jest.fn(),
    findByBusinessPartner: jest.fn(),
    findByCompanyAndType: jest.fn(),
    findByCompanyAndStatus: jest.fn(),
    findByCompanyAndDateRange: jest.fn(),
    findOverdueByCompany: jest.fn(),
    findByCompanyAndNumber: jest.fn(),
    numberExistsForCompany: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
    updateBalance: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        { provide: InvoiceRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    repository = module.get<InvoiceRepository>(InvoiceRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an invoice', async () => {
    mockRepository.numberExistsForCompany.mockResolvedValue(false);
    mockRepository.create.mockReturnValue(mockInvoice);
    mockRepository.save.mockResolvedValue(mockInvoice);

    const result = await service.create({
      companyId: 1,
      invoiceNumber: 'INV-2025-001',
      invoiceType: 'SALES',
      businessPartnerId: 1,
      invoiceDate: '2025-01-15',
      dueDate: '2025-02-15',
      currencyId: 1,
      totalBeforeTax: 1000,
      totalAmount: 1200,
      fiscalYearId: 1,
    });

    expect(result).toEqual(mockInvoice);
  });

  it('should throw ConflictException if invoice number exists', async () => {
    mockRepository.numberExistsForCompany.mockResolvedValue(true);

    await expect(
      service.create({
        companyId: 1,
        invoiceNumber: 'INV-2025-001',
        invoiceType: 'SALES',
        businessPartnerId: 1,
        invoiceDate: '2025-01-15',
        dueDate: '2025-02-15',
        currencyId: 1,
        totalBeforeTax: 1000,
        totalAmount: 1200,
        fiscalYearId: 1,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw BadRequestException if due date is before invoice date', async () => {
    mockRepository.numberExistsForCompany.mockResolvedValue(false);

    await expect(
      service.create({
        companyId: 1,
        invoiceNumber: 'INV-2025-001',
        invoiceType: 'SALES',
        businessPartnerId: 1,
        invoiceDate: '2025-02-15',
        dueDate: '2025-01-15',
        currencyId: 1,
        totalBeforeTax: 1000,
        totalAmount: 1200,
        fiscalYearId: 1,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should record a payment', async () => {
    const invoiceWithPayment = { ...mockInvoice, paidAmount: 500, balance: 700, status: 'PARTIALLY_PAID' };
    mockRepository.findOne.mockResolvedValue(mockInvoice);
    mockRepository.updateBalance.mockResolvedValue(undefined);
    mockRepository.findOne.mockResolvedValueOnce(mockInvoice).mockResolvedValueOnce(invoiceWithPayment);

    const result = await service.recordPayment(1, 500);

    expect(mockRepository.updateBalance).toHaveBeenCalledWith(1, 500);
    expect(result.paidAmount).toBe(500);
  });

  it('should throw BadRequestException if payment exceeds total', async () => {
    mockRepository.findOne.mockResolvedValue(mockInvoice);

    await expect(service.recordPayment(1, 1500)).rejects.toThrow(BadRequestException);
  });
});
