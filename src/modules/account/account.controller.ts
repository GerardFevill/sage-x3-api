import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AccountService } from './account.service';
import { Account } from './account.entity';
import { CreateAccountDto, UpdateAccountDto } from './dto';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({ status: 201, type: Account })
  @ApiResponse({ status: 409, description: 'Account code already exists' })
  create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiResponse({ status: 200, type: [Account] })
  findAll(): Promise<Account[]> {
    return this.accountService.findAll();
  }

  @Get('by-company/:companyId')
  @ApiOperation({ summary: 'Get accounts by company' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  @ApiQuery({ name: 'postable', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [Account] })
  async findByCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query('active') active?: string,
    @Query('postable') postable?: string,
  ): Promise<Account[]> {
    if (active === 'true') {
      return this.accountService.findActiveByCompany(companyId);
    }
    if (postable === 'true') {
      return this.accountService.findPostableAccounts(companyId);
    }
    return this.accountService.findByCompany(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an account by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Account })
  @ApiResponse({ status: 404, description: 'Account not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Account> {
    return this.accountService.findOne(id);
  }

  @Get('by-company/:companyId/by-code/:accountCode')
  @ApiOperation({ summary: 'Get account by company and code' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiParam({ name: 'accountCode', type: String })
  @ApiResponse({ status: 200, type: Account })
  @ApiResponse({ status: 404, description: 'Account not found' })
  findByCompanyAndCode(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('accountCode') accountCode: string,
  ): Promise<Account> {
    return this.accountService.findByCompanyAndCode(companyId, accountCode);
  }

  @Get('by-company/:companyId/by-type/:accountType')
  @ApiOperation({ summary: 'Get accounts by type' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiParam({ name: 'accountType', enum: ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'] })
  @ApiResponse({ status: 200, type: [Account] })
  findByType(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('accountType') accountType: string,
  ): Promise<Account[]> {
    return this.accountService.findByType(companyId, accountType);
  }

  @Get('by-company/:companyId/search')
  @ApiOperation({ summary: 'Search accounts' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiQuery({ name: 'q', type: String })
  @ApiResponse({ status: 200, type: [Account] })
  search(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query('q') query: string,
  ): Promise<Account[]> {
    return this.accountService.search(companyId, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an account' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Account })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 409, description: 'Account code already exists' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return this.accountService.update(id, updateAccountDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete an account' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'Account not found' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.accountService.remove(id);
  }
}
