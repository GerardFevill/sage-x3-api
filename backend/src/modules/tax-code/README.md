# Tax Code Module

## Overview

The Tax Code module manages tax codes (codes TVA) for each company. It supports different tax types and rates.

## Features

- ✅ Full CRUD operations
- ✅ Tax types (VAT, SALES_TAX, EXCISE, OTHER)
- ✅ Tax rate validation (0-100%)
- ✅ Code uniqueness per company
- ✅ Soft delete

## Tax Types

- **VAT** - Value Added Tax (TVA)
- **SALES_TAX** - Sales Tax
- **EXCISE** - Excise Tax
- **OTHER** - Other tax types

## API Endpoints

- `POST /api/tax-code` - Create tax code
- `GET /api/tax-code` - List all tax codes
- `GET /api/tax-code/:id` - Get by ID
- `GET /api/tax-code/by-company/:companyId` - By company
- `GET /api/tax-code/by-company/:companyId/by-code/:code` - By code
- `GET /api/tax-code/by-company/:companyId/by-type/:type` - By type
- `PATCH /api/tax-code/:id` - Update
- `DELETE /api/tax-code/:id` - Soft delete

---

**Status**: ✅ COMPLETE
**Version**: 1.0.0
