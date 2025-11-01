import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { JournalRepository } from './journal.repository';
import { Journal } from './journal.entity';
import { CreateJournalDto, UpdateJournalDto } from './dto';

@Injectable()
export class JournalService {
  private readonly logger = new Logger(JournalService.name);

  constructor(private readonly journalRepository: JournalRepository) {}

  async create(createJournalDto: CreateJournalDto): Promise<Journal> {
    const codeExists = await this.journalRepository.codeExistsForCompany(
      createJournalDto.companyId,
      createJournalDto.journalCode,
    );
    if (codeExists) {
      throw new ConflictException(
        `Journal with code ${createJournalDto.journalCode} already exists for this company`,
      );
    }
    const journal = this.journalRepository.create(createJournalDto);
    return this.journalRepository.save(journal);
  }

  async findAll(): Promise<Journal[]> {
    return this.journalRepository.find({ order: { companyId: 'ASC', journalCode: 'ASC' } });
  }

  async findByCompany(companyId: number): Promise<Journal[]> {
    return this.journalRepository.findByCompany(companyId);
  }

  async findActiveByCompany(companyId: number): Promise<Journal[]> {
    return this.journalRepository.findActiveByCompany(companyId);
  }

  async findOne(id: number): Promise<Journal> {
    const journal = await this.journalRepository.findOne({ where: { id } });
    if (!journal) {
      throw new NotFoundException(`Journal with ID ${id} not found`);
    }
    return journal;
  }

  async findByCompanyAndCode(companyId: number, journalCode: string): Promise<Journal> {
    const journal = await this.journalRepository.findByCompanyAndCode(companyId, journalCode);
    if (!journal) {
      throw new NotFoundException(
        `Journal with code ${journalCode} not found for company ${companyId}`,
      );
    }
    return journal;
  }

  async findByType(companyId: number, journalType: string): Promise<Journal[]> {
    return this.journalRepository.findByType(companyId, journalType);
  }

  async update(id: number, updateJournalDto: UpdateJournalDto): Promise<Journal> {
    const journal = await this.findOne(id);

    if (updateJournalDto.journalCode) {
      const codeExists = await this.journalRepository.codeExistsForCompany(
        journal.companyId,
        updateJournalDto.journalCode,
        id,
      );
      if (codeExists) {
        throw new ConflictException(
          `Journal with code ${updateJournalDto.journalCode} already exists for this company`,
        );
      }
    }

    Object.assign(journal, updateJournalDto);
    return this.journalRepository.save(journal);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.journalRepository.softDelete(id);
  }
}
