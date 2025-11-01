# Account Module (Chart of Accounts)

## Overview

The Account module manages the chart of accounts (plan comptable) for each company. It supports hierarchical account structures, account types, and comprehensive validation.

## Features

- ✅ Full CRUD operations
- ✅ Hierarchical account structure (parent-child)
- ✅ Account types (ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE)
- ✅ Control accounts and posting controls
- ✅ Search and filtering capabilities
- ✅ Soft delete (isActive flag)

## Account Types

- **ASSET** - Normal balance: DEBIT
- **LIABILITY** - Normal balance: CREDIT
- **EQUITY** - Normal balance: CREDIT
- **REVENUE** - Normal balance: CREDIT
- **EXPENSE** - Normal balance: DEBIT

## API Endpoints

- `POST /api/account` - Create account
- `GET /api/account` - List all accounts
- `GET /api/account/:id` - Get by ID
- `GET /api/account/by-company/:companyId` - By company
- `GET /api/account/by-company/:companyId/by-code/:code` - By company and code
- `GET /api/account/by-company/:companyId/by-type/:type` - By account type
- `GET /api/account/by-company/:companyId/search?q=query` - Search
- `PATCH /api/account/:id` - Update
- `DELETE /api/account/:id` - Soft delete

---

**Status**: ✅ COMPLETE
**Version**: 1.0.0
