# Fiscal Year Module

## Overview

The Fiscal Year module manages accounting periods for companies in the multi-company ERP system. Each company can have multiple fiscal years, which define the accounting periods for financial reporting and transaction management.

## Features

- ✅ Full CRUD operations
- ✅ Multi-company support (isolated fiscal years per company)
- ✅ Date range validation (start < end)
- ✅ Overlap detection (prevents overlapping periods)
- ✅ Close/Reopen fiscal years
- ✅ Soft delete (isActive flag)
- ✅ Comprehensive validation with class-validator
- ✅ Full test coverage (>80%)
- ✅ Immutability protection (closed fiscal years cannot be modified)

## API Endpoints

### POST /api/fiscal-year
Create a new fiscal year

**Request Body:**
```json
{
  "companyId": 1,
  "code": "FY2024",
  "name": "Fiscal Year 2024",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "numberOfPeriods": 12,
  "isActive": true
}
```

**Response (201):**
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

### GET /api/fiscal-year
Get all fiscal years

### GET /api/fiscal-year/by-company/:companyId
Get all fiscal years for a specific company

**Query Parameters:**
- `active` (optional): Filter by active status (true/false)
- `closed` (optional): Filter by closed status (true=closed, false=open)

**Examples:**
- `GET /api/fiscal-year/by-company/1` - All fiscal years for company 1
- `GET /api/fiscal-year/by-company/1?active=true` - Active fiscal years
- `GET /api/fiscal-year/by-company/1?closed=false` - Open fiscal years

### GET /api/fiscal-year/:id
Get a fiscal year by ID

### GET /api/fiscal-year/by-company/:companyId/by-code/:code
Get a fiscal year by company and code

**Example:** `GET /api/fiscal-year/by-company/1/by-code/FY2024`

### GET /api/fiscal-year/by-company/:companyId/by-date/:date
Find the fiscal year that contains a specific date

**Example:** `GET /api/fiscal-year/by-company/1/by-date/2024-06-15`

### PATCH /api/fiscal-year/:id
Update a fiscal year

**Important:** Cannot update closed fiscal years. Reopen them first.

### POST /api/fiscal-year/:id/close
Close a fiscal year

This operation:
- Sets `isClosed` to `true`
- Sets `closedDate` to current date
- Prevents further modifications to the fiscal year
- Prevents posting of new transactions to this fiscal year

### POST /api/fiscal-year/:id/reopen
Reopen a closed fiscal year

This operation:
- Sets `isClosed` to `false`
- Clears `closedDate`
- Allows modifications again

### DELETE /api/fiscal-year/:id
Soft delete a fiscal year (sets isActive to false)

**Important:** Cannot delete closed fiscal years.

## Entity Fields

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| id | bigint | Auto | Yes | Primary key |
| companyId | bigint | Yes | No | Company this fiscal year belongs to |
| code | varchar(10) | Yes | Per Company | Fiscal year code (unique per company) |
| name | varchar(100) | Yes | No | Full name of the fiscal year |
| startDate | date | Yes | No | Start date of the fiscal year |
| endDate | date | Yes | No | End date of the fiscal year |
| isActive | boolean | No | No | Active status (default: true) |
| isClosed | boolean | No | No | Closed status (default: false) |
| closedDate | date | No | No | Date when the fiscal year was closed |
| numberOfPeriods | smallint | No | No | Number of periods (default: 12) |
| createdAt | timestamptz | Auto | No | Creation timestamp |
| updatedAt | timestamptz | Auto | No | Last update timestamp |
| createdBy | bigint | No | No | User who created |
| updatedBy | bigint | No | No | User who last updated |

## Validation Rules

- **companyId**:
  - Required
  - Must be a positive integer

- **code**:
  - Required
  - 2-10 characters
  - Must be unique per company

- **name**:
  - Required
  - 2-100 characters

- **startDate**:
  - Required
  - ISO 8601 format (YYYY-MM-DD)
  - Must be before endDate

- **endDate**:
  - Required
  - ISO 8601 format (YYYY-MM-DD)
  - Must be after startDate

- **numberOfPeriods**:
  - Optional
  - Integer between 1 and 24
  - Default: 12

## Business Rules

1. **Unique Code per Company**: Fiscal year codes must be unique within a company, but different companies can use the same code
2. **No Overlapping Dates**: Fiscal years for the same company cannot have overlapping date ranges
3. **Date Validation**: Start date must be before end date
4. **Closed Fiscal Year Protection**:
   - Cannot update a closed fiscal year (must reopen first)
   - Cannot delete a closed fiscal year
   - Cannot post transactions to a closed fiscal year (enforced in transaction modules)
5. **Soft Delete**: Fiscal years are never physically deleted, only marked as inactive

## Testing

Run tests:
```bash
npm test fiscal-year.service.spec.ts
```

Test coverage:
- ✅ CRUD operations
- ✅ Date validation
- ✅ Overlap detection
- ✅ Close/Reopen operations
- ✅ Validation errors
- ✅ Conflict detection (duplicate codes, overlapping dates)
- ✅ Not found errors
- ✅ Closed fiscal year protection

## Related Modules

- **Company**: Each fiscal year belongs to a company
- **GL Transaction**: Transactions are posted to fiscal years
- **Period**: Future module for managing periods within fiscal years

## Usage Example

```typescript
import { FiscalYearService } from './modules/fiscal-year/fiscal-year.service';

// Inject service
constructor(private readonly fiscalYearService: FiscalYearService) {}

// Create fiscal year
const fiscalYear = await this.fiscalYearService.create({
  companyId: 1,
  code: 'FY2024',
  name: 'Fiscal Year 2024',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  numberOfPeriods: 12,
});

// Find fiscal year for a specific date
const fy = await this.fiscalYearService.findByCompanyAndDate(1, '2024-06-15');

// Close fiscal year at year-end
await this.fiscalYearService.close(fiscalYear.id);

// Reopen if needed
await this.fiscalYearService.reopen(fiscalYear.id);
```

## Repository Methods

The FiscalYearRepository provides these custom methods:

```typescript
// Find all fiscal years for a company
findByCompany(companyId: number): Promise<FiscalYear[]>

// Find active fiscal years
findActiveByCompany(companyId: number): Promise<FiscalYear[]>

// Find by company and code
findByCompanyAndCode(companyId: number, code: string): Promise<FiscalYear | null>

// Check if code exists for company
codeExistsForCompany(companyId: number, code: string, excludeId?: number): Promise<boolean>

// Find fiscal year containing a date
findByCompanyAndDate(companyId: number, date: Date): Promise<FiscalYear | null>

// Find overlapping fiscal years
findOverlapping(companyId: number, startDate: Date, endDate: Date, excludeId?: number): Promise<FiscalYear[]>

// Find closed fiscal years
findClosedByCompany(companyId: number): Promise<FiscalYear[]>

// Find open fiscal years
findOpenByCompany(companyId: number): Promise<FiscalYear[]>

// Soft delete
softDelete(id: number): Promise<void>

// Close fiscal year
closeFiscalYear(id: number, closedDate: Date): Promise<void>

// Reopen fiscal year
reopenFiscalYear(id: number): Promise<void>

// Find with company relation
findOneWithCompany(id: number): Promise<FiscalYear | null>
```

## Error Handling

The module throws these exceptions:

- **NotFoundException (404)**: Fiscal year not found
- **ConflictException (409)**:
  - Fiscal year code already exists for company
  - Fiscal year dates overlap with existing fiscal year
- **BadRequestException (400)**:
  - Start date is not before end date
  - Trying to update a closed fiscal year
  - Trying to delete a closed fiscal year
  - Trying to close an already closed fiscal year
  - Trying to reopen a fiscal year that is not closed

## Common Scenarios

### Creating a Standard Calendar Year
```json
{
  "companyId": 1,
  "code": "FY2024",
  "name": "Fiscal Year 2024",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "numberOfPeriods": 12
}
```

### Creating a Non-Calendar Fiscal Year
```json
{
  "companyId": 1,
  "code": "FY2024-2025",
  "name": "Fiscal Year 2024-2025",
  "startDate": "2024-04-01",
  "endDate": "2025-03-31",
  "numberOfPeriods": 12
}
```

### Creating a Short Fiscal Year (Transition Period)
```json
{
  "companyId": 1,
  "code": "FY2024-SHORT",
  "name": "Transition Period 2024",
  "startDate": "2024-01-01",
  "endDate": "2024-03-31",
  "numberOfPeriods": 3
}
```

## Year-End Close Process

The typical year-end close process:

1. **Verify all transactions are posted**
2. **Run closing entries** (handled by GL Transaction module)
3. **Verify balances** (ensure all accounts balance)
4. **Close all periods** (future Period module)
5. **Close the fiscal year**:
   ```typescript
   await fiscalYearService.close(fiscalYearId);
   ```
6. **Create next fiscal year**:
   ```typescript
   await fiscalYearService.create({
     companyId: 1,
     code: 'FY2025',
     name: 'Fiscal Year 2025',
     startDate: '2025-01-01',
     endDate: '2025-12-31',
     numberOfPeriods: 12,
   });
   ```

## Future Enhancements

- [ ] Period management (monthly, quarterly periods within fiscal year)
- [ ] Budget integration per fiscal year
- [ ] Automatic period generation based on numberOfPeriods
- [ ] Year-end rollover automation
- [ ] Multi-level approval for closing
- [ ] Audit trail for close/reopen operations
- [ ] Fiscal year templates
- [ ] Prevent deletion if transactions exist

## Best Practices

1. **Always validate dates** before creating fiscal years
2. **Never allow overlapping periods** to avoid transaction confusion
3. **Close fiscal years** at year-end to prevent accidental postings
4. **Use meaningful codes** (e.g., FY2024, FY2024-2025)
5. **Plan fiscal year structure** before go-live (calendar vs non-calendar)
6. **Document close procedures** for year-end
7. **Test reopen scenarios** for audit adjustments

## Notes

- Fiscal years can span calendar years (e.g., April 1, 2024 to March 31, 2025)
- The `numberOfPeriods` field is informational; actual periods will be managed by a future Period module
- Closed fiscal years maintain data integrity by preventing modifications
- The system supports both calendar-year and non-calendar-year fiscal years

---

**Status**: ✅ COMPLETE
**Version**: 1.0.0
**Last Updated**: 2025-11-01
