import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global prefix
  const globalPrefix = process.env.API_PREFIX || 'api';
  app.setGlobalPrefix(globalPrefix);

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || '*',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('ERP Sage X3 MVP API')
    .setDescription('Professional ERP REST API - Multi-company, multi-currency, double-entry accounting')
    .setVersion('1.0')
    .addTag('company', 'Company management (multi-company support)')
    .addTag('currency', 'Currency and exchange rates')
    .addTag('fiscal-year', 'Fiscal year management')
    .addTag('account', 'Chart of accounts')
    .addTag('journal', 'Accounting journals')
    .addTag('tax-code', 'VAT/Tax codes')
    .addTag('business-partner', 'Customers, suppliers, employees')
    .addTag('product', 'Product catalog')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  // Start server
  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  logger.log(`📚 Swagger documentation: http://localhost:${port}/${globalPrefix}/docs`);
}

bootstrap();
