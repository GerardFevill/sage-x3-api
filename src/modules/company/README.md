# Company Module

## Overview

The Company module manages companies in the multi-company ERP system. This is the central entity that all transactional data references.

## Features

- ✅ Full CRUD operations
- ✅ Soft delete (isActive flag)
- ✅ Search by name or code
- ✅ Filter by country
- ✅ Unique code validation
- ✅ Comprehensive validation with class-validator
- ✅ Full test coverage

## API Endpoints

### POST /api/company
Create a new company

**Request Body:**
```json
{
  "code": "FR01",
  "name": "ACME France",
  "legalName": "ACME France SAS",
  "taxId": "12345678901234",
  "addressLine1": "123 Avenue des Champs-Élysées",
  "city": "Paris",
  "postalCode": "75008",
  "countryCode": "FR",
  "isActive": true
}
```

### GET /api/company
Get all companies

**Query Parameters:**
- `active` (optional): Filter by active status (true/false)

### GET /api/company/:id
Get a company by ID

### GET /api/company/by-code/:code
Get a company by code

### GET /api/company/search?q=ACME
Search companies by name or code

### GET /api/company/by-country/FR
Get companies by country code

### PATCH /api/company/:id
Update a company

### DELETE /api/company/:id
Soft delete a company (sets isActive to false)

## Entity Fields

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| id | bigint | Auto | Yes | Primary key |
| code | varchar(10) | Yes | Yes | Company code (uppercase alphanumeric) |
| name | varchar(100) | Yes | No | Company name |
| legalName | varchar(200) | No | No | Legal company name |
| taxId | varchar(50) | No | No | Tax identification number |
| registrationNumber | varchar(50) | No | No | Registration number (RCS, etc.) |
| addressLine1 | varchar(200) | No | No | Address line 1 |
| addressLine2 | varchar(200) | No | No | Address line 2 |
| city | varchar(100) | No | No | City |
| stateProvince | varchar(100) | No | No | State or province |
| postalCode | varchar(20) | No | No | Postal code |
| countryCode | varchar(2) | No | No | ISO 3166-1 alpha-2 country code |
| defaultCurrencyId | bigint | No | No | Default currency reference |
| isActive | boolean | No | No | Active status (default: true) |
| createdAt | timestamptz | Auto | No | Creation timestamp |
| updatedAt | timestamptz | Auto | No | Last update timestamp |
| createdBy | bigint | No | No | User who created |
| updatedBy | bigint | No | No | User who last updated |

## Validation Rules

- **code**:
  - Required
  - 2-10 characters
  - Uppercase letters and numbers only
  - Must be unique

- **name**:
  - Required
  - 2-100 characters

- **countryCode**:
  - Optional
  - Exactly 2 uppercase letters
  - ISO 3166-1 alpha-2 format

## Business Rules

1. Company code must be unique across all companies
2. Soft delete: Companies are never physically deleted, only marked as inactive
3. Cannot delete a company that has:
   - Active fiscal years (TODO: implement check)
   - Posted transactions (TODO: implement check)

## Testing

Run tests:
```bash
npm test company.service.spec.ts
```

Test coverage:
- ✅ CRUD operations
- ✅ Validation errors
- ✅ Conflict detection (duplicate codes)
- ✅ Not found errors
- ✅ Search functionality

## Related Modules

- **Currency**: Companies have a default currency
- **FiscalYear**: Companies have multiple fiscal years
- **Account**: Chart of accounts is company-specific
- **Transaction**: All transactions reference a company

## Usage Example

```typescript
import { CompanyService } from './modules/company/company.service';

// Inject service
constructor(private readonly companyService: CompanyService) {}

// Create company
const company = await this.companyService.create({
  code: 'FR01',
  name: 'ACME France',
  countryCode: 'FR',
});

// Find by code
const acme = await this.companyService.findByCode('FR01');

// Search
const results = await this.companyService.search('ACME');
```

## Future Enhancements

- [ ] Multi-tenant isolation with Row Level Security
- [ ] Company hierarchy (parent/subsidiary relationships)
- [ ] Company settings/preferences
- [ ] Logo upload
- [ ] Integration with external systems
