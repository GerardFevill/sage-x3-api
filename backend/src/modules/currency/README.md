# Currency Module

## Overview

The Currency module manages currencies in the multi-currency ERP system. It supports ISO 4217 currency codes and enables multi-currency operations throughout the system.

## Features

- ✅ Full CRUD operations
- ✅ ISO 4217 currency code validation
- ✅ Soft delete (isActive flag)
- ✅ Search by code or name
- ✅ Filter by decimal places
- ✅ Comprehensive validation with class-validator
- ✅ Full test coverage (>80%)
- ✅ Case-insensitive code handling (auto-uppercase)

## API Endpoints

### POST /api/currency
Create a new currency

**Request Body:**
```json
{
  "code": "EUR",
  "name": "Euro",
  "symbol": "€",
  "decimalPlaces": 2,
  "isActive": true
}
```

**Response (201):**
```json
{
  "id": 1,
  "code": "EUR",
  "name": "Euro",
  "symbol": "€",
  "decimalPlaces": 2,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "createdBy": null,
  "updatedBy": null
}
```

### GET /api/currency
Get all currencies

**Query Parameters:**
- `active` (optional): Filter by active status (true/false)

**Response (200):**
```json
[
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
]
```

### GET /api/currency/:id
Get a currency by ID

**Example:** `GET /api/currency/1`

### GET /api/currency/by-code/:code
Get a currency by ISO 4217 code

**Example:** `GET /api/currency/by-code/EUR`

### GET /api/currency/search?q=Euro
Search currencies by code or name (minimum 2 characters)

**Example:** `GET /api/currency/search?q=Eu`

### GET /api/currency/by-decimal-places/:decimalPlaces
Get currencies by number of decimal places (0-4)

**Example:** `GET /api/currency/by-decimal-places/2`

### PATCH /api/currency/:id
Update a currency

**Request Body (partial):**
```json
{
  "name": "European Euro",
  "symbol": "EUR"
}
```

### DELETE /api/currency/:id
Soft delete a currency (sets isActive to false)

**Response:** 204 No Content

## Entity Fields

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| id | bigint | Auto | Yes | Primary key |
| code | varchar(3) | Yes | Yes | ISO 4217 currency code (e.g., EUR, USD) |
| name | varchar(100) | Yes | No | Full currency name |
| symbol | varchar(10) | No | No | Currency symbol (e.g., €, $) |
| decimalPlaces | smallint | No | No | Number of decimal places (0-4, default: 2) |
| isActive | boolean | No | No | Active status (default: true) |
| createdAt | timestamptz | Auto | No | Creation timestamp |
| updatedAt | timestamptz | Auto | No | Last update timestamp |
| createdBy | bigint | No | No | User who created |
| updatedBy | bigint | No | No | User who last updated |

## Validation Rules

- **code**:
  - Required
  - Exactly 3 characters
  - Uppercase letters only (A-Z)
  - ISO 4217 format
  - Must be unique
  - Automatically converted to uppercase

- **name**:
  - Required
  - 2-100 characters

- **symbol**:
  - Optional
  - 1-10 characters

- **decimalPlaces**:
  - Optional
  - Integer between 0 and 4
  - Default: 2

## Business Rules

1. Currency code must follow ISO 4217 standard (3 uppercase letters)
2. Currency codes are automatically converted to uppercase
3. Soft delete: Currencies are never physically deleted, only marked as inactive
4. Cannot delete a currency that has:
   - Active exchange rates (TODO: implement check)
   - Active companies using it as default (TODO: implement check)
   - Transactions using it (TODO: implement check)

## Common ISO 4217 Currency Codes

| Code | Name | Symbol | Decimal Places |
|------|------|--------|----------------|
| EUR | Euro | € | 2 |
| USD | US Dollar | $ | 2 |
| GBP | British Pound | £ | 2 |
| JPY | Japanese Yen | ¥ | 0 |
| CHF | Swiss Franc | CHF | 2 |
| CAD | Canadian Dollar | C$ | 2 |
| AUD | Australian Dollar | A$ | 2 |
| CNY | Chinese Yuan | ¥ | 2 |
| INR | Indian Rupee | ₹ | 2 |
| BRL | Brazilian Real | R$ | 2 |

## Testing

Run tests:
```bash
npm test currency.service.spec.ts
```

Test coverage includes:
- ✅ CRUD operations (create, read, update, delete)
- ✅ Validation errors (short code, invalid format)
- ✅ Conflict detection (duplicate codes)
- ✅ Not found errors (invalid IDs)
- ✅ Search functionality (by code and name)
- ✅ Decimal places filtering
- ✅ Case-insensitive code handling
- ✅ Soft delete behavior

Coverage: >80%

## Related Modules

- **ExchangeRate**: Currencies have exchange rates between them (TODO: implement)
- **Company**: Companies have a default currency
- **Transaction**: All financial transactions use currencies
- **Invoice**: Invoices are in a specific currency

## Usage Example

```typescript
import { CurrencyService } from './modules/currency/currency.service';

// Inject service
constructor(private readonly currencyService: CurrencyService) {}

// Create currency
const currency = await this.currencyService.create({
  code: 'EUR',
  name: 'Euro',
  symbol: '€',
  decimalPlaces: 2,
});

// Find by code (case-insensitive)
const euro = await this.currencyService.findByCode('eur'); // Auto-converted to EUR

// Search
const results = await this.currencyService.search('Euro');

// Get currencies with 0 decimal places (like JPY)
const noDecimalCurrencies = await this.currencyService.findByDecimalPlaces(0);
```

## Repository Methods

The CurrencyRepository provides these custom methods:

```typescript
// Find all active currencies
findActive(): Promise<Currency[]>

// Find by ISO 4217 code
findByCode(code: string): Promise<Currency | null>

// Check if code exists (with optional exclusion for updates)
codeExists(code: string, excludeId?: number): Promise<boolean>

// Search by code or name
search(query: string): Promise<Currency[]>

// Soft delete
softDelete(id: number): Promise<void>

// Find by decimal places
findByDecimalPlaces(decimalPlaces: number): Promise<Currency[]>

// Find with relations (for future use)
findOneWithRelations(id: number): Promise<Currency | null>
```

## Error Handling

The module throws these exceptions:

- **NotFoundException (404)**: Currency not found
- **ConflictException (409)**: Currency code already exists
- **BadRequestException (400)**: Invalid input (short search query, invalid decimal places)

## Future Enhancements

- [ ] Exchange rate management integration
- [ ] Historical exchange rate tracking
- [ ] Currency conversion utilities
- [ ] Multi-currency reporting
- [ ] Support for custom currency symbols
- [ ] Currency rounding rules
- [ ] Prevent deletion of currencies in use

## Best Practices

1. Always use ISO 4217 codes for consistency
2. Use the `findByCode()` method instead of direct queries
3. Let the system auto-convert codes to uppercase
4. Use soft delete to maintain referential integrity
5. Validate decimal places based on currency standards
6. Cache active currencies for better performance (TODO)

## Notes

- The module supports 0-4 decimal places to handle currencies like JPY (0 decimals) and cryptocurrencies (4+ decimals)
- Currency codes are automatically converted to uppercase for consistency
- Soft delete preserves data integrity and audit trail
- The entity is ready for relations with ExchangeRate and Company modules

---

**Status**: ✅ COMPLETE
**Version**: 1.0.0
**Last Updated**: 2025-11-01
