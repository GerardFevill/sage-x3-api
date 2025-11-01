# ERP Sage X3 MVP - Backend API

## 🚀 Overview

Professional REST API backend for an ERP system inspired by Sage X3, built with:
- **NestJS 10+** (TypeScript)
- **TypeORM** for database ORM
- **PostgreSQL** as database
- **Swagger/OpenAPI** for documentation
- **Jest** for testing

## 📦 Features

✅ **Multi-company support** - Isolated data per company
✅ **Multi-currency** - Support for multiple currencies with exchange rates
✅ **Multi-fiscal year** - Multiple accounting periods per company
✅ **Double-entry accounting** - Full general ledger with validation
✅ **REST API** - Clean, RESTful endpoints
✅ **Swagger documentation** - Interactive API docs
✅ **Validation** - Request validation with class-validator
✅ **Error handling** - Comprehensive error responses
✅ **Logging** - Request/response logging
✅ **Unit tests** - Full test coverage

## 🏗️ Architecture

```
src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module
├── config/
│   └── database.config.ts     # Database configuration
├── common/
│   ├── filters/               # Exception filters
│   ├── interceptors/          # Logging interceptors
│   └── pipes/                 # Validation pipes
└── modules/
    ├── company/               # ✅ Company module (COMPLETE)
    │   ├── company.entity.ts
    │   ├── dto/
    │   │   ├── create-company.dto.ts
    │   │   └── update-company.dto.ts
    │   ├── company.repository.ts
    │   ├── company.service.ts
    │   ├── company.controller.ts
    │   ├── company.service.spec.ts
    │   ├── company.module.ts
    │   └── README.md
    ├── currency/              # ✅ Currency module (COMPLETE)
    │   ├── currency.entity.ts
    │   ├── dto/
    │   │   ├── create-currency.dto.ts
    │   │   └── update-currency.dto.ts
    │   ├── currency.repository.ts
    │   ├── currency.service.ts
    │   ├── currency.controller.ts
    │   ├── currency.service.spec.ts
    │   ├── currency.module.ts
    │   └── README.md
    ├── fiscal-year/           # ✅ Fiscal Year module (COMPLETE)
    │   ├── fiscal-year.entity.ts
    │   ├── dto/
    │   │   ├── create-fiscal-year.dto.ts
    │   │   └── update-fiscal-year.dto.ts
    │   ├── fiscal-year.repository.ts
    │   ├── fiscal-year.service.ts
    │   ├── fiscal-year.controller.ts
    │   ├── fiscal-year.service.spec.ts
    │   ├── fiscal-year.module.ts
    │   └── README.md
    ├── account/               # ✅ Account module (COMPLETE)
    ├── journal/               # ✅ Journal module (COMPLETE)
    ├── tax-code/              # ✅ Tax Code module (COMPLETE)
    ├── business-partner/      # ✅ Business Partner module (COMPLETE)
    ├── product/               # ✅ Product module (COMPLETE)
    ├── warehouse/             # ✅ Warehouse module (COMPLETE)
    ├── invoice/               # ✅ Invoice module (COMPLETE)
    └── payment/               # ✅ Payment module (COMPLETE)
```

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 14+
- Database created with Liquibase (see ../liquibase/)

### Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=postgres
# DB_DATABASE=erp_sage_x3_mvp

# IMPORTANT: Database schema must be created first using Liquibase
# See ../liquibase/README.md for instructions
```

## 🚀 Running the App

```bash
# Development mode with auto-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at:
- **API**: http://localhost:3000/api
- **Swagger Docs**: http://localhost:3000/api/docs

## 🧪 Testing

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 📚 API Documentation

Once the application is running, visit http://localhost:3000/api/docs for interactive Swagger documentation.

### Available Modules

#### ✅ Company Module (COMPLETE)

**Endpoints:**
- `POST /api/company` - Create company
- `GET /api/company` - List companies
- `GET /api/company/:id` - Get company by ID
- `GET /api/company/by-code/:code` - Get company by code
- `GET /api/company/search?q=query` - Search companies
- `GET /api/company/by-country/:code` - Companies by country
- `PATCH /api/company/:id` - Update company
- `DELETE /api/company/:id` - Soft delete company

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/company \
  -H "Content-Type: application/json" \
  -d '{
    "code": "FR01",
    "name": "ACME France",
    "countryCode": "FR",
    "isActive": true
  }'
```

**Example Response:**
```json
{
  "id": 1,
  "code": "FR01",
  "name": "ACME France",
  "countryCode": "FR",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### ✅ Currency Module (COMPLETE)

**Endpoints:**
- `POST /api/currency` - Create currency
- `GET /api/currency` - List currencies
- `GET /api/currency/:id` - Get currency by ID
- `GET /api/currency/by-code/:code` - Get currency by ISO code
- `GET /api/currency/search?q=query` - Search currencies
- `GET /api/currency/by-decimal-places/:n` - Currencies by decimal places
- `PATCH /api/currency/:id` - Update currency
- `DELETE /api/currency/:id` - Soft delete currency

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/currency \
  -H "Content-Type: application/json" \
  -d '{
    "code": "EUR",
    "name": "Euro",
    "symbol": "€",
    "decimalPlaces": 2,
    "isActive": true
  }'
```

**Example Response:**
```json
{
  "id": 1,
  "code": "EUR",
  "name": "Euro",
  "symbol": "€",
  "decimalPlaces": 2,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### ✅ Fiscal Year Module (COMPLETE)

**Endpoints:**
- `POST /api/fiscal-year` - Create fiscal year
- `GET /api/fiscal-year` - List fiscal years
- `GET /api/fiscal-year/:id` - Get fiscal year by ID
- `GET /api/fiscal-year/by-company/:companyId` - Fiscal years by company
- `GET /api/fiscal-year/by-company/:companyId/by-code/:code` - By company and code
- `GET /api/fiscal-year/by-company/:companyId/by-date/:date` - Find by date
- `POST /api/fiscal-year/:id/close` - Close fiscal year
- `POST /api/fiscal-year/:id/reopen` - Reopen fiscal year
- `PATCH /api/fiscal-year/:id` - Update fiscal year
- `DELETE /api/fiscal-year/:id` - Soft delete fiscal year

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/fiscal-year \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": 1,
    "code": "FY2024",
    "name": "Fiscal Year 2024",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "numberOfPeriods": 12
  }'
```

**Example Response:**
```json
{
  "id": 1,
  "companyId": 1,
  "code": "FY2024",
  "name": "Fiscal Year 2024",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "isActive": true,
  "isClosed": false,
  "closedDate": null,
  "numberOfPeriods": 12,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### ✅ Account Module (COMPLETE)

**Endpoints:**
- `POST /api/account` - Create account
- `GET /api/account` - List accounts
- `GET /api/account/:id` - Get account by ID
- `GET /api/account/by-company/:companyId` - Accounts by company
- `GET /api/account/by-company/:companyId/by-type/:type` - Filter by type
- `GET /api/account/by-company/:companyId/by-code/:code` - By company and code
- `PATCH /api/account/:id` - Update account
- `DELETE /api/account/:id` - Soft delete account

**Account Types:** ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE

#### ✅ Journal Module (COMPLETE)

**Endpoints:**
- `POST /api/journal` - Create journal
- `GET /api/journal` - List journals
- `GET /api/journal/:id` - Get journal by ID
- `GET /api/journal/by-company/:companyId` - Journals by company
- `GET /api/journal/by-company/:companyId/by-type/:type` - Filter by type
- `GET /api/journal/by-company/:companyId/by-code/:code` - By company and code
- `PATCH /api/journal/:id` - Update journal
- `DELETE /api/journal/:id` - Soft delete journal

**Journal Types:** SALES, PURCHASE, BANK, CASH, GENERAL

#### ✅ Tax Code Module (COMPLETE)

**Endpoints:**
- `POST /api/tax-code` - Create tax code
- `GET /api/tax-code` - List tax codes
- `GET /api/tax-code/:id` - Get tax code by ID
- `GET /api/tax-code/by-company/:companyId` - Tax codes by company
- `GET /api/tax-code/by-company/:companyId/by-code/:code` - By company and code
- `PATCH /api/tax-code/:id` - Update tax code
- `DELETE /api/tax-code/:id` - Soft delete tax code

#### ✅ Business Partner Module (COMPLETE)

**Endpoints:**
- `POST /api/business-partner` - Create business partner
- `GET /api/business-partner` - List business partners
- `GET /api/business-partner/:id` - Get business partner by ID
- `GET /api/business-partner/by-company/:companyId` - Business partners by company
- `GET /api/business-partner/by-company/:companyId/by-type/:type` - Filter by type
- `GET /api/business-partner/by-company/:companyId/by-code/:code` - By company and code
- `GET /api/business-partner/search?q=query` - Search business partners
- `PATCH /api/business-partner/:id` - Update business partner
- `DELETE /api/business-partner/:id` - Soft delete business partner

**Partner Types:** CUSTOMER, SUPPLIER, BOTH

#### ✅ Product Module (COMPLETE)

**Endpoints:**
- `POST /api/product` - Create product
- `GET /api/product` - List products
- `GET /api/product/:id` - Get product by ID
- `GET /api/product/by-company/:companyId` - Products by company
- `GET /api/product/by-company/:companyId/by-type/:type` - Filter by type
- `GET /api/product/by-company/:companyId/by-code/:code` - By company and code
- `GET /api/product/search?q=query` - Search products
- `PATCH /api/product/:id` - Update product
- `DELETE /api/product/:id` - Soft delete product

**Product Types:** GOODS, SERVICE, CONSUMABLE

#### ✅ Warehouse Module (COMPLETE)

**Endpoints:**
- `POST /api/warehouse` - Create warehouse
- `GET /api/warehouse` - List warehouses
- `GET /api/warehouse/:id` - Get warehouse by ID
- `GET /api/warehouse/by-company/:companyId` - Warehouses by company
- `GET /api/warehouse/by-company/:companyId?active=true` - Active warehouses
- `GET /api/warehouse/by-company/:companyId/by-code/:code` - By company and code
- `PATCH /api/warehouse/:id` - Update warehouse
- `DELETE /api/warehouse/:id` - Soft delete warehouse

#### ✅ Invoice Module (COMPLETE)

**Endpoints:**
- `POST /api/invoice` - Create invoice
- `GET /api/invoice` - List invoices
- `GET /api/invoice/:id` - Get invoice by ID
- `GET /api/invoice/by-company/:companyId` - Invoices by company
- `GET /api/invoice/by-company/:companyId?type=SALES` - Filter by type
- `GET /api/invoice/by-company/:companyId?status=DRAFT` - Filter by status
- `GET /api/invoice/by-business-partner/:businessPartnerId` - By business partner
- `GET /api/invoice/overdue/by-company/:companyId` - Overdue invoices
- `POST /api/invoice/:id/payment` - Record payment
- `PATCH /api/invoice/:id/status/:status` - Update status
- `PATCH /api/invoice/:id` - Update invoice
- `DELETE /api/invoice/:id` - Soft delete invoice

**Invoice Types:** SALES, PURCHASE, CREDIT_NOTE, DEBIT_NOTE

#### ✅ Payment Module (COMPLETE)

**Endpoints:**
- `POST /api/payment` - Create payment
- `GET /api/payment` - List payments
- `GET /api/payment/:id` - Get payment by ID
- `GET /api/payment/by-company/:companyId` - Payments by company
- `GET /api/payment/by-company/:companyId?type=RECEIVED` - Filter by type
- `GET /api/payment/by-company/:companyId?method=BANK_TRANSFER` - Filter by method
- `GET /api/payment/by-business-partner/:businessPartnerId` - By business partner
- `GET /api/payment/by-invoice/:invoiceId` - Payments for invoice
- `GET /api/payment/total/by-company/:companyId/by-type/:type` - Total by type
- `PATCH /api/payment/:id/status/:status` - Update status
- `PATCH /api/payment/:id` - Update payment
- `DELETE /api/payment/:id` - Soft delete payment

**Payment Types:** RECEIVED, SENT
**Payment Methods:** CASH, BANK_TRANSFER, CHECK, CREDIT_CARD, OTHER

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3000 |
| `API_PREFIX` | Global API prefix | api |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_USERNAME` | Database user | postgres |
| `DB_PASSWORD` | Database password | postgres |
| `DB_DATABASE` | Database name | erp_sage_x3_mvp |
| `LOG_LEVEL` | Logging level | debug |
| `CORS_ORIGINS` | Allowed CORS origins | * |

### TypeORM Configuration

```typescript
// src/config/database.config.ts
{
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // NEVER use true - use Liquibase
  logging: process.env.NODE_ENV === 'development',
}
```

**⚠️ IMPORTANT**: `synchronize: false` is critical for production. Database schema is managed by Liquibase migrations in `../liquibase/`.

## 🏛️ Project Structure

### Module Structure

Each module follows this structure:
```
module-name/
├── entity.ts              # TypeORM entity
├── dto/
│   ├── create-*.dto.ts    # Create DTO
│   └── update-*.dto.ts    # Update DTO
├── repository.ts          # Custom repository
├── service.ts             # Business logic
├── controller.ts          # REST endpoints
├── *.spec.ts              # Unit tests
├── module.ts              # NestJS module
└── README.md              # Module documentation
```

### Design Patterns

- **Repository Pattern**: Data access layer separation
- **Dependency Injection**: NestJS built-in DI
- **DTO Pattern**: Data transfer with validation
- **Service Layer**: Business logic separation
- **Exception Handling**: Centralized error management

## 📖 Development Guide

### Creating a New Module

```bash
# Generate module scaffold (optional)
nest g module modules/my-module
nest g controller modules/my-module
nest g service modules/my-module

# Or manually create files following the structure
```

### Adding Validation

```typescript
import { IsString, Length, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 50)
  name: string;

  @IsEmail()
  email: string;
}
```

### Custom Repository Methods

```typescript
@Injectable()
export class MyRepository extends Repository<MyEntity> {
  constructor(private dataSource: DataSource) {
    super(MyEntity, dataSource.createEntityManager());
  }

  async findCustom(): Promise<MyEntity[]> {
    return this.createQueryBuilder('alias')
      .where('alias.field = :value', { value: 'test' })
      .getMany();
  }
}
```

## 🧪 Testing Guidelines

### Service Tests

```typescript
describe('MyService', () => {
  let service: MyService;
  let repository: Repository<MyEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MyService,
        {
          provide: getRepositoryToken(MyEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MyService>(MyService);
    repository = module.get(getRepositoryToken(MyEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

## 📊 Database Schema

The database schema is managed by Liquibase. See `../liquibase/` for:
- Schema definition
- Migrations
- Test data

**Never use TypeORM synchronize in production!**

## 🔐 Security

- ✅ Input validation with class-validator
- ✅ SQL injection protection (TypeORM parameterized queries)
- ✅ CORS configuration
- ⏳ TODO: Authentication (JWT)
- ⏳ TODO: Authorization (RBAC)
- ⏳ TODO: Rate limiting
- ⏳ TODO: API versioning

## 🚦 Error Handling

The API uses standard HTTP status codes:

- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Success with no body
- `400 Bad Request` - Validation error
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource
- `500 Internal Server Error` - Server error

Error response format:
```json
{
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/company",
  "method": "POST",
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": ["code must be unique"]
}
```

## 📈 Performance

- ✅ Repository pattern for optimized queries
- ✅ Proper indexing in database (see Liquibase migrations)
- ✅ Pagination support (TODO: implement)
- ✅ Caching strategy (TODO: implement)

## 🤝 Contributing

1. Follow the existing module structure
2. Write comprehensive tests (aim for >80% coverage)
3. Update Swagger documentation
4. Follow TypeScript strict mode
5. Use ESLint and Prettier

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 📝 TODOs

### ✅ Completed Modules
- [x] Company module ✅ COMPLETE
- [x] Currency module ✅ COMPLETE
- [x] Fiscal Year module ✅ COMPLETE
- [x] Account module ✅ COMPLETE
- [x] Journal module ✅ COMPLETE
- [x] Tax Code module ✅ COMPLETE
- [x] Business Partner module ✅ COMPLETE
- [x] Product module ✅ COMPLETE
- [x] Warehouse module ✅ COMPLETE
- [x] Invoice module ✅ COMPLETE
- [x] Payment module ✅ COMPLETE

### High Priority
- [ ] GL Transaction module
- [ ] Stock Movement module
- [ ] Invoice Lines module

### Medium Priority
- [ ] Purchase Order module
- [ ] Sales Order module
- [ ] Delivery module
- [ ] Journal Entry module

### Low Priority
- [ ] Authentication & Authorization
- [ ] API versioning
- [ ] Rate limiting
- [ ] Pagination helpers
- [ ] Caching layer
- [ ] Audit logging
- [ ] File uploads
- [ ] Email notifications

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Class Validator](https://github.com/typestack/class-validator)
- [Swagger/OpenAPI](https://swagger.io/specification/)

## 📄 License

MIT

---

**Status**: 🟢 Active Development
**Version**: 1.0.0
**Last Updated**: 2025-11-01
