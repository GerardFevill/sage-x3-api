# Journal Module

## Overview

The Journal module manages accounting journals (journaux comptables) for each company. Journals are used to categorize and organize accounting entries.

## Features

- ✅ Full CRUD operations
- ✅ Journal types (SALES, PURCHASE, GENERAL, CASH, BANK)
- ✅ Code uniqueness per company
- ✅ Soft delete

## Journal Types

- **SALES** - Sales journal (ventes)
- **PURCHASE** - Purchase journal (achats)
- **GENERAL** - General journal (opérations diverses)
- **CASH** - Cash journal (caisse)
- **BANK** - Bank journal (banque)

## API Endpoints

- `POST /api/journal` - Create journal
- `GET /api/journal` - List all journals
- `GET /api/journal/:id` - Get by ID
- `GET /api/journal/by-company/:companyId` - By company
- `GET /api/journal/by-company/:companyId/by-code/:code` - By code
- `GET /api/journal/by-company/:companyId/by-type/:type` - By type
- `PATCH /api/journal/:id` - Update
- `DELETE /api/journal/:id` - Soft delete

---

**Status**: ✅ COMPLETE
**Version**: 1.0.0
