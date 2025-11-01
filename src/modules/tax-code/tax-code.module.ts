import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxCode } from './tax-code.entity';
import { TaxCodeController } from './tax-code.controller';
import { TaxCodeService } from './tax-code.service';
import { TaxCodeRepository } from './tax-code.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TaxCode])],
  controllers: [TaxCodeController],
  providers: [TaxCodeService, TaxCodeRepository],
  exports: [TaxCodeService, TaxCodeRepository],
})
export class TaxCodeModule {}
