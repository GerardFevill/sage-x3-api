import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiscalYear } from './fiscal-year.entity';
import { FiscalYearController } from './fiscal-year.controller';
import { FiscalYearService } from './fiscal-year.service';
import { FiscalYearRepository } from './fiscal-year.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FiscalYear])],
  controllers: [FiscalYearController],
  providers: [FiscalYearService, FiscalYearRepository],
  exports: [FiscalYearService, FiscalYearRepository],
})
export class FiscalYearModule {}
