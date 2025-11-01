import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessPartner } from './business-partner.entity';
import { BusinessPartnerController } from './business-partner.controller';
import { BusinessPartnerService } from './business-partner.service';
import { BusinessPartnerRepository } from './business-partner.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessPartner])],
  controllers: [BusinessPartnerController],
  providers: [BusinessPartnerService, BusinessPartnerRepository],
  exports: [BusinessPartnerService, BusinessPartnerRepository],
})
export class BusinessPartnerModule {}
