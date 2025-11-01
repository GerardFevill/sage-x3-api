# Business Partner Module

## Overview

The Business Partner module manages business partners (tiers) - customers, suppliers, or both. It supports multi-company isolation.

## Features

- ✅ Full CRUD operations
- ✅ Partner types (CUSTOMER, SUPPLIER, BOTH)
- ✅ Code uniqueness per company
- ✅ Contact information (email, phone)
- ✅ Search functionality
- ✅ Soft delete

## Partner Types

- **CUSTOMER** - Client
- **SUPPLIER** - Fournisseur
- **BOTH** - Client et Fournisseur

## API Endpoints

- `POST /api/business-partner` - Create partner
- `GET /api/business-partner` - List all partners
- `GET /api/business-partner/:id` - Get by ID
- `GET /api/business-partner/by-company/:companyId` - By company
- `GET /api/business-partner/by-company/:companyId/by-code/:code` - By code
- `GET /api/business-partner/by-company/:companyId/by-type/:type` - By type
- `GET /api/business-partner/by-company/:companyId/search?q=query` - Search
- `PATCH /api/business-partner/:id` - Update
- `DELETE /api/business-partner/:id` - Soft delete

---

**Status**: ✅ COMPLETE
**Version**: 1.0.0
