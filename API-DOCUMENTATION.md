# API Documentation - ERP Sage X3 MVP

Documentation complète de l'API REST pour le système ERP Sage X3 MVP.

## 📚 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Fichiers de documentation](#fichiers-de-documentation)
- [Modules disponibles](#modules-disponibles)
- [Authentification](#authentification)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Codes de statut HTTP](#codes-de-statut-http)
- [Gestion des erreurs](#gestion-des-erreurs)

## Vue d'ensemble

L'API ERP Sage X3 MVP fournit une interface RESTful complète pour gérer tous les aspects d'un système ERP :

- **Base URL (Dev)**: `http://localhost:3000/api`
- **Format**: JSON
- **Protocole**: HTTP/HTTPS
- **Documentation interactive**: http://localhost:3000/api/docs (Swagger UI)

## Fichiers de documentation

### 1. swagger.yaml

Spécification OpenAPI 3.0 complète de l'API.

**Utilisation:**
```bash
# Visualiser avec Swagger Editor en ligne
https://editor.swagger.io/

# Ou localement avec swagger-ui
npm install -g swagger-ui-watcher
swagger-ui-watcher swagger.yaml
```

**Contenu:**
- Tous les endpoints (100+)
- Schémas de données complets
- Exemples de requêtes/réponses
- Codes d'erreur
- Descriptions détaillées

### 2. postman-collection.json

Collection Postman complète pour tester l'API.

**Installation:**
1. Ouvrir Postman
2. Cliquer sur "Import"
3. Sélectionner `postman-collection.json`
4. La collection "ERP Sage X3 MVP API" apparaît dans la barre latérale

**Variables d'environnement:**
- `baseUrl`: http://localhost:3000/api
- `companyId`: ID de la société (par défaut: 1)
- `currencyId`: ID de la devise (par défaut: 1)
- `fiscalYearId`: ID de l'exercice fiscal (par défaut: 1)
- `invoiceId`: ID de la facture (par défaut: 1)
- `paymentId`: ID du paiement (par défaut: 1)

**Contenu:**
- 60+ requêtes pré-configurées
- Exemples de données pour chaque module
- Organisé par module

### 3. Documentation Swagger Interactive

Une fois l'application lancée, accédez à:
```
http://localhost:3000/api/docs
```

**Fonctionnalités:**
- Interface interactive pour tester les endpoints
- Documentation en temps réel
- Possibilité d'exécuter des requêtes directement
- Schémas de validation visibles

## Modules disponibles

### 1. Company (Société)

Gestion des sociétés multi-entités.

**Endpoints principaux:**
- `POST /api/company` - Créer une société
- `GET /api/company` - Lister les sociétés
- `GET /api/company/:id` - Détails d'une société
- `GET /api/company/by-code/:code` - Recherche par code
- `PATCH /api/company/:id` - Mise à jour
- `DELETE /api/company/:id` - Suppression (soft delete)

**Exemple de création:**
```json
POST /api/company
{
  "code": "FR01",
  "name": "ACME France",
  "legalName": "ACME France SAS",
  "taxId": "FR12345678901",
  "countryCode": "FR"
}
```

### 2. Currency (Devise)

Gestion des devises avec support ISO 4217.

**Endpoints principaux:**
- `POST /api/currency` - Créer une devise
- `GET /api/currency` - Lister les devises
- `GET /api/currency/by-code/:code` - Recherche par code ISO

**Exemple:**
```json
POST /api/currency
{
  "code": "EUR",
  "name": "Euro",
  "symbol": "€",
  "decimalPlaces": 2
}
```

### 3. Fiscal Year (Exercice Fiscal)

Gestion des périodes comptables.

**Endpoints principaux:**
- `POST /api/fiscal-year` - Créer un exercice
- `GET /api/fiscal-year/by-company/:companyId` - Par société
- `POST /api/fiscal-year/:id/close` - Clôturer
- `POST /api/fiscal-year/:id/reopen` - Réouvrir

**Exemple:**
```json
POST /api/fiscal-year
{
  "companyId": 1,
  "code": "FY2024",
  "name": "Exercice 2024",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "numberOfPeriods": 12
}
```

### 4. Account (Plan Comptable)

Gestion du plan comptable avec 5 types de comptes.

**Types de comptes:**
- `ASSET` - Actif
- `LIABILITY` - Passif
- `EQUITY` - Capitaux propres
- `REVENUE` - Revenus
- `EXPENSE` - Dépenses

**Endpoints principaux:**
- `POST /api/account` - Créer un compte
- `GET /api/account/by-company/:companyId` - Par société
- `GET /api/account/by-company/:companyId/by-type/:type` - Par type

### 5. Journal (Journaux Comptables)

Gestion des journaux comptables.

**Types de journaux:**
- `SALES` - Ventes
- `PURCHASE` - Achats
- `BANK` - Banque
- `CASH` - Caisse
- `GENERAL` - Opérations diverses

**Endpoints principaux:**
- `POST /api/journal` - Créer un journal
- `GET /api/journal/by-company/:companyId` - Par société

### 6. Tax Code (Codes de Taxe)

Gestion des taux de TVA et taxes.

**Endpoints principaux:**
- `POST /api/tax-code` - Créer un code taxe
- `GET /api/tax-code/by-company/:companyId` - Par société

**Exemple:**
```json
POST /api/tax-code
{
  "companyId": 1,
  "taxCode": "VAT20",
  "taxName": "TVA 20%",
  "taxRate": 20.00
}
```

### 7. Business Partner (Partenaires Commerciaux)

Gestion des clients, fournisseurs et partenaires.

**Types de partenaires:**
- `CUSTOMER` - Client
- `SUPPLIER` - Fournisseur
- `BOTH` - Client et fournisseur

**Endpoints principaux:**
- `POST /api/business-partner` - Créer un partenaire
- `GET /api/business-partner/by-company/:companyId` - Par société
- `GET /api/business-partner/search?q=query` - Recherche

### 8. Product (Produits)

Gestion du catalogue produits.

**Types de produits:**
- `GOODS` - Marchandises
- `SERVICE` - Services
- `CONSUMABLE` - Consommables

**Endpoints principaux:**
- `POST /api/product` - Créer un produit
- `GET /api/product/by-company/:companyId` - Par société
- `GET /api/product/search?q=query` - Recherche

**Exemple:**
```json
POST /api/product
{
  "companyId": 1,
  "productCode": "PROD001",
  "productName": "Laptop Computer",
  "productType": "GOODS",
  "unitPrice": 999.99,
  "costPrice": 750.00
}
```

### 9. Warehouse (Entrepôts)

Gestion des entrepôts et sites de stockage.

**Endpoints principaux:**
- `POST /api/warehouse` - Créer un entrepôt
- `GET /api/warehouse/by-company/:companyId` - Par société
- `GET /api/warehouse/by-company/:companyId?active=true` - Actifs uniquement

### 10. Invoice (Factures)

Gestion complète des factures avec suivi des paiements.

**Types de factures:**
- `SALES` - Vente
- `PURCHASE` - Achat
- `CREDIT_NOTE` - Avoir
- `DEBIT_NOTE` - Note de débit

**Statuts:**
- `DRAFT` - Brouillon
- `POSTED` - Comptabilisée
- `PARTIALLY_PAID` - Partiellement payée
- `PAID` - Payée
- `CANCELLED` - Annulée

**Endpoints principaux:**
- `POST /api/invoice` - Créer une facture
- `GET /api/invoice/by-company/:companyId` - Par société
- `GET /api/invoice/overdue/by-company/:companyId` - Factures en retard
- `POST /api/invoice/:id/payment` - Enregistrer un paiement
- `PATCH /api/invoice/:id/status/:status` - Changer le statut

**Exemple complet:**
```json
POST /api/invoice
{
  "companyId": 1,
  "invoiceNumber": "INV-2025-001",
  "invoiceType": "SALES",
  "businessPartnerId": 1,
  "invoiceDate": "2025-01-15",
  "dueDate": "2025-02-15",
  "currencyId": 1,
  "totalBeforeTax": 1000.00,
  "totalTax": 200.00,
  "totalAmount": 1200.00,
  "fiscalYearId": 1
}
```

**Enregistrer un paiement:**
```json
POST /api/invoice/1/payment
{
  "amount": 500.00
}
```

### 11. Payment (Paiements)

Gestion des paiements et encaissements.

**Types de paiements:**
- `RECEIVED` - Reçu (encaissement)
- `SENT` - Envoyé (décaissement)

**Méthodes de paiement:**
- `CASH` - Espèces
- `BANK_TRANSFER` - Virement
- `CHECK` - Chèque
- `CREDIT_CARD` - Carte de crédit
- `OTHER` - Autre

**Endpoints principaux:**
- `POST /api/payment` - Créer un paiement
- `GET /api/payment/by-company/:companyId` - Par société
- `GET /api/payment/by-invoice/:invoiceId` - Par facture
- `GET /api/payment/total/by-company/:companyId/by-type/:type` - Total par type

**Exemple:**
```json
POST /api/payment
{
  "companyId": 1,
  "paymentNumber": "PAY-2025-001",
  "paymentType": "RECEIVED",
  "businessPartnerId": 1,
  "invoiceId": 1,
  "paymentDate": "2025-01-20",
  "currencyId": 1,
  "amount": 500.00,
  "paymentMethod": "BANK_TRANSFER"
}
```

## Authentification

**⚠️ Note**: L'authentification n'est pas encore implémentée dans cette version MVP.

**Planifié pour v2.0:**
- JWT (JSON Web Tokens)
- Roles-based access control (RBAC)
- OAuth 2.0

## Codes de statut HTTP

| Code | Signification | Description |
|------|---------------|-------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée avec succès |
| 204 | No Content | Suppression réussie |
| 400 | Bad Request | Erreur de validation |
| 404 | Not Found | Ressource non trouvée |
| 409 | Conflict | Conflit (code dupliqué, etc.) |
| 500 | Internal Server Error | Erreur serveur |

## Gestion des erreurs

Format standard des erreurs:

```json
{
  "statusCode": 400,
  "timestamp": "2025-01-15T10:30:00Z",
  "path": "/api/company",
  "method": "POST",
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": [
    "code must be unique",
    "countryCode must be exactly 2 characters"
  ]
}
```

## Exemples d'utilisation

### Scénario complet: Créer une facture et enregistrer un paiement

```bash
# 1. Créer une société
curl -X POST http://localhost:3000/api/company \
  -H "Content-Type: application/json" \
  -d '{
    "code": "FR01",
    "name": "ACME France",
    "countryCode": "FR"
  }'
# Réponse: { "id": 1, ... }

# 2. Créer une devise
curl -X POST http://localhost:3000/api/currency \
  -H "Content-Type: application/json" \
  -d '{
    "code": "EUR",
    "name": "Euro",
    "symbol": "€",
    "decimalPlaces": 2
  }'
# Réponse: { "id": 1, ... }

# 3. Créer un exercice fiscal
curl -X POST http://localhost:3000/api/fiscal-year \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": 1,
    "code": "FY2025",
    "name": "Exercice 2025",
    "startDate": "2025-01-01",
    "endDate": "2025-12-31",
    "numberOfPeriods": 12
  }'
# Réponse: { "id": 1, ... }

# 4. Créer un client
curl -X POST http://localhost:3000/api/business-partner \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": 1,
    "partnerCode": "CUST001",
    "partnerName": "Client ABC",
    "partnerType": "CUSTOMER"
  }'
# Réponse: { "id": 1, ... }

# 5. Créer une facture
curl -X POST http://localhost:3000/api/invoice \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": 1,
    "invoiceNumber": "INV-2025-001",
    "invoiceType": "SALES",
    "businessPartnerId": 1,
    "invoiceDate": "2025-01-15",
    "dueDate": "2025-02-15",
    "currencyId": 1,
    "totalBeforeTax": 1000.00,
    "totalTax": 200.00,
    "totalAmount": 1200.00,
    "fiscalYearId": 1
  }'
# Réponse: { "id": 1, "balance": 1200.00, ... }

# 6. Enregistrer un paiement
curl -X POST http://localhost:3000/api/invoice/1/payment \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 600.00
  }'
# Réponse: { "id": 1, "paidAmount": 600.00, "balance": 600.00, ... }

# 7. Créer le paiement correspondant
curl -X POST http://localhost:3000/api/payment \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": 1,
    "paymentNumber": "PAY-2025-001",
    "paymentType": "RECEIVED",
    "businessPartnerId": 1,
    "invoiceId": 1,
    "paymentDate": "2025-01-20",
    "currencyId": 1,
    "amount": 600.00,
    "paymentMethod": "BANK_TRANSFER"
  }'
# Réponse: { "id": 1, ... }

# 8. Vérifier les factures en retard
curl http://localhost:3000/api/invoice/overdue/by-company/1

# 9. Obtenir le total des paiements reçus
curl http://localhost:3000/api/payment/total/by-company/1/by-type/RECEIVED
# Réponse: { "total": 600.00 }
```

## Bonnes pratiques

### 1. Isolation multi-société

Toujours filtrer par `companyId` pour garantir l'isolation des données:
```
GET /api/invoice/by-company/1
```

### 2. Codes uniques par société

Les codes sont uniques au sein d'une société, pas globalement:
- ✅ Société 1: Code "CUST001"
- ✅ Société 2: Code "CUST001"
- ❌ Société 1: Deux fois "CUST001"

### 3. Soft delete

Les suppressions sont logiques (soft delete). Les données restent en base avec `isActive = false`.

### 4. Validation des dates

- Date d'échéance >= Date de facture
- Périodes fiscales sans chevauchement
- Exercice fiscal doit être ouvert pour comptabiliser

### 5. Gestion des devises

- Toujours spécifier un `exchangeRate` (défaut: 1.0)
- Utiliser des codes ISO 4217 pour les devises

## Support et documentation additionnelle

- **README principal**: `backend/README.md`
- **Documentation des modules**: `backend/src/modules/*/README.md`
- **Swagger UI en direct**: http://localhost:3000/api/docs
- **Collection Postman**: `backend/postman-collection.json`
- **Spécification OpenAPI**: `backend/swagger.yaml`

---

**Version**: 1.0.0
**Dernière mise à jour**: 2025-11-01
**Contact**: gerard.nouglozeh@protonmail.com
