import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { Account } from './account.entity';
import { CreateAccountDto, UpdateAccountDto } from './dto';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(private readonly accountRepository: AccountRepository) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    this.logger.log(
      `Creating account with code: ${createAccountDto.accountCode} for company: ${createAccountDto.companyId}`,
    );

    const codeExists = await this.accountRepository.codeExistsForCompany(
      createAccountDto.companyId,
      createAccountDto.accountCode,
    );
    if (codeExists) {
      throw new ConflictException(
        `Account with code ${createAccountDto.accountCode} already exists for this company`,
      );
    }

    // Validate parent account if provided
    if (createAccountDto.parentAccountId) {
      const parentAccount = await this.accountRepository.findOne({
        where: { id: createAccountDto.parentAccountId, companyId: createAccountDto.companyId },
      });
      if (!parentAccount) {
        throw new BadRequestException('Parent account not found or belongs to different company');
      }
    }

    const account = this.accountRepository.create(createAccountDto);
    const savedAccount = await this.accountRepository.save(account);

    this.logger.log(`Account created with ID: ${savedAccount.id}`);
    return savedAccount;
  }

  async findAll(): Promise<Account[]> {
    this.logger.log('Retrieving all accounts');
    return this.accountRepository.find({
      order: { companyId: 'ASC', accountCode: 'ASC' },
    });
  }

  async findByCompany(companyId: number): Promise<Account[]> {
    this.logger.log(`Retrieving accounts for company: ${companyId}`);
    return this.accountRepository.findByCompany(companyId);
  }

  async findActiveByCompany(companyId: number): Promise<Account[]> {
    this.logger.log(`Retrieving active accounts for company: ${companyId}`);
    return this.accountRepository.findActiveByCompany(companyId);
  }

  async findOne(id: number): Promise<Account> {
    this.logger.log(`Retrieving account with ID: ${id}`);

    const account = await this.accountRepository.findOne({ where: { id } });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return account;
  }

  async findByCompanyAndCode(
    companyId: number,
    accountCode: string,
  ): Promise<Account> {
    this.logger.log(
      `Retrieving account with code: ${accountCode} for company: ${companyId}`,
    );

    const account = await this.accountRepository.findByCompanyAndCode(
      companyId,
      accountCode,
    );

    if (!account) {
      throw new NotFoundException(
        `Account with code ${accountCode} not found for company ${companyId}`,
      );
    }

    return account;
  }

  async findByType(companyId: number, accountType: string): Promise<Account[]> {
    this.logger.log(
      `Retrieving ${accountType} accounts for company: ${companyId}`,
    );
    return this.accountRepository.findByType(companyId, accountType);
  }

  async findByCategory(
    companyId: number,
    accountCategory: string,
  ): Promise<Account[]> {
    this.logger.log(
      `Retrieving accounts in category ${accountCategory} for company: ${companyId}`,
    );
    return this.accountRepository.findByCategory(companyId, accountCategory);
  }

  async search(companyId: number, query: string): Promise<Account[]> {
    if (!query || query.trim().length < 2) {
      throw new BadRequestException(
        'Search query must be at least 2 characters',
      );
    }

    this.logger.log(
      `Searching accounts for company ${companyId} with query: ${query}`,
    );
    return this.accountRepository.search(companyId, query.trim());
  }

  async findPostableAccounts(companyId: number): Promise<Account[]> {
    this.logger.log(`Retrieving postable accounts for company: ${companyId}`);
    return this.accountRepository.findPostableAccounts(companyId);
  }

  async findByParent(
    companyId: number,
    parentAccountId: number,
  ): Promise<Account[]> {
    this.logger.log(
      `Retrieving child accounts of parent ${parentAccountId} for company: ${companyId}`,
    );
    return this.accountRepository.findByParent(companyId, parentAccountId);
  }

  async update(id: number, updateAccountDto: UpdateAccountDto): Promise<Account> {
    this.logger.log(`Updating account with ID: ${id}`);

    const account = await this.findOne(id);

    if (updateAccountDto.accountCode) {
      const codeExists = await this.accountRepository.codeExistsForCompany(
        account.companyId,
        updateAccountDto.accountCode,
        id,
      );
      if (codeExists) {
        throw new ConflictException(
          `Account with code ${updateAccountDto.accountCode} already exists for this company`,
        );
      }
    }

    // Validate parent account if being updated
    if (updateAccountDto.parentAccountId) {
      if (updateAccountDto.parentAccountId === id) {
        throw new BadRequestException('Account cannot be its own parent');
      }
      const parentAccount = await this.accountRepository.findOne({
        where: { id: updateAccountDto.parentAccountId, companyId: account.companyId },
      });
      if (!parentAccount) {
        throw new BadRequestException('Parent account not found or belongs to different company');
      }
    }

    Object.assign(account, updateAccountDto);
    const updatedAccount = await this.accountRepository.save(account);

    this.logger.log(`Account with ID ${id} updated successfully`);
    return updatedAccount;
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Soft deleting account with ID: ${id}`);

    await this.findOne(id);

    // TODO: Check if account has transactions
    // TODO: Check if account has child accounts

    await this.accountRepository.softDelete(id);

    this.logger.log(`Account with ID ${id} soft deleted successfully`);
  }
}
