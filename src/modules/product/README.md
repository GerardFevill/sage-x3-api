# Product Module

## Overview

The Product module manages products and services (articles) for each company. Supports goods and services with inventory tracking.

## Features

- ✅ Full CRUD operations
- ✅ Product types (GOODS, SERVICE)
- ✅ Inventory tracking flag
- ✅ Pricing (unit price, cost price)
- ✅ Unit of measure
- ✅ Categories
- ✅ Search functionality
- ✅ Soft delete

## Product Types

- **GOODS** - Physical products with inventory
- **SERVICE** - Services (no inventory)

## API Endpoints

- `POST /api/product` - Create product
- `GET /api/product` - List all products
- `GET /api/product/:id` - Get by ID
- `GET /api/product/by-company/:companyId` - By company
- `GET /api/product/by-company/:companyId/by-code/:code` - By code
- `GET /api/product/by-company/:companyId/by-type/:type` - By type
- `GET /api/product/by-company/:companyId/search?q=query` - Search
- `PATCH /api/product/:id` - Update
- `DELETE /api/product/:id` - Soft delete

---

**Status**: ✅ COMPLETE
**Version**: 1.0.0
