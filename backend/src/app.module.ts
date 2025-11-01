import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import { CompanyModule } from './modules/company/company.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { FiscalYearModule } from './modules/fiscal-year/fiscal-year.module';
import { AccountModule } from './modules/account/account.module';
import { JournalModule } from './modules/journal/journal.module';
import { TaxCodeModule } from './modules/tax-code/tax-code.module';
import { BusinessPartnerModule } from './modules/business-partner/business-partner.module';
import { ProductModule } from './modules/product/product.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: ['.env.local', '.env'],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database')!,
      inject: [ConfigService],
    }),

    // Feature modules
    CompanyModule,
    CurrencyModule,
    FiscalYearModule,
    AccountModule,
    JournalModule,
    TaxCodeModule,
    BusinessPartnerModule,
    ProductModule,
    WarehouseModule,
    InvoiceModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
