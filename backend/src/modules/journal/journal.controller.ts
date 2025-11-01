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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JournalService } from './journal.service';
import { Journal } from './journal.entity';
import { CreateJournalDto, UpdateJournalDto } from './dto';

@ApiTags('journal')
@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new journal' })
  @ApiResponse({ status: 201, type: Journal })
  create(@Body() createJournalDto: CreateJournalDto): Promise<Journal> {
    return this.journalService.create(createJournalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all journals' })
  @ApiResponse({ status: 200, type: [Journal] })
  findAll(): Promise<Journal[]> {
    return this.journalService.findAll();
  }

  @Get('by-company/:companyId')
  @ApiOperation({ summary: 'Get journals by company' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [Journal] })
  findByCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query('active') active?: string,
  ): Promise<Journal[]> {
    if (active === 'true') {
      return this.journalService.findActiveByCompany(companyId);
    }
    return this.journalService.findByCompany(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a journal by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Journal })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Journal> {
    return this.journalService.findOne(id);
  }

  @Get('by-company/:companyId/by-code/:code')
  @ApiOperation({ summary: 'Get journal by company and code' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiParam({ name: 'code', type: String })
  @ApiResponse({ status: 200, type: Journal })
  findByCompanyAndCode(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('code') code: string,
  ): Promise<Journal> {
    return this.journalService.findByCompanyAndCode(companyId, code);
  }

  @Get('by-company/:companyId/by-type/:type')
  @ApiOperation({ summary: 'Get journals by type' })
  @ApiParam({ name: 'companyId', type: Number })
  @ApiParam({ name: 'type', enum: ['SALES', 'PURCHASE', 'GENERAL', 'CASH', 'BANK'] })
  @ApiResponse({ status: 200, type: [Journal] })
  findByType(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('type') type: string,
  ): Promise<Journal[]> {
    return this.journalService.findByType(companyId, type);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a journal' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Journal })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJournalDto: UpdateJournalDto,
  ): Promise<Journal> {
    return this.journalService.update(id, updateJournalDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a journal' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204 })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.journalService.remove(id);
  }
}
