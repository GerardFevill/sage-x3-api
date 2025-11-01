# Invoice Module

Module de gestion des factures pour le système ERP.

## Fonctionnalités

- Création et gestion des factures (ventes, achats, avoirs, débits)
- Support multi-société (isolation par companyId)
- Numéros de facture uniques par société
- Gestion des paiements et soldes
- Suivi des factures en retard
- Filtrage par type, statut, dates
- Gestion des devises et taux de change
- Soft delete (suppression logique)
- Validation des données
- Documentation Swagger

## Structure

```
invoice/
├── dto/
│   ├── index.ts
│   ├── create-invoice.dto.ts
│   └── update-invoice.dto.ts
├── invoice.entity.ts
├── invoice.repository.ts
├── invoice.service.ts
├── invoice.controller.ts
├── invoice.service.spec.ts
├── invoice.module.ts
└── README.md
```

## Entity: Invoice

### Champs

| Champ | Type | Description |
|-------|------|-------------|
| id | bigint | Identifiant unique (PK) |
| companyId | bigint | Identifiant de la société (FK) |
| invoiceNumber | varchar(50) | Numéro de facture (unique par société) |
| invoiceType | varchar(20) | Type de facture (SALES, PURCHASE, CREDIT_NOTE, DEBIT_NOTE) |
| businessPartnerId | bigint | Identifiant du partenaire commercial (FK) |
| invoiceDate | date | Date de la facture |
| dueDate | date | Date d'échéance |
| currencyId | bigint | Identifiant de la devise (FK) |
| exchangeRate | decimal(15,6) | Taux de change (défaut: 1.0) |
| totalBeforeTax | decimal(18,2) | Total hors taxes |
| totalTax | decimal(18,2) | Total des taxes |
| totalAmount | decimal(18,2) | Total TTC |
| paidAmount | decimal(18,2) | Montant payé |
| balance | decimal(18,2) | Solde restant |
| status | varchar(20) | Statut (DRAFT, POSTED, PARTIALLY_PAID, PAID, CANCELLED) |
| fiscalYearId | bigint | Identifiant de l'exercice fiscal (FK) |
| notes | text | Notes (optionnel) |
| poReference | varchar(100) | Référence bon de commande (optionnel) |
| isActive | boolean | Statut actif/inactif (défaut: true) |
| createdAt | timestamp | Date de création |
| updatedAt | timestamp | Date de dernière modification |

### Relations

- `companyId` → `company.id` (Many-to-One)
- `businessPartnerId` → `business_partner.id` (Many-to-One)
- `currencyId` → `currency.id` (Many-to-One)
- `fiscalYearId` → `fiscal_year.id` (Many-to-One)

## DTOs

### CreateInvoiceDto

```typescript
{
  companyId: number;           // Requis, positif
  invoiceNumber: string;       // Requis, 1-50 caractères
  invoiceType: string;         // Requis, SALES|PURCHASE|CREDIT_NOTE|DEBIT_NOTE
  businessPartnerId: number;   // Requis, positif
  invoiceDate: string;         // Requis, ISO 8601
  dueDate: string;             // Requis, ISO 8601
  currencyId: number;          // Requis, positif
  exchangeRate?: number;       // Optionnel, défaut: 1.0
  totalBeforeTax: number;      // Requis, >= 0
  totalTax?: number;           // Optionnel, >= 0
  totalAmount: number;         // Requis, >= 0
  fiscalYearId: number;        // Requis, positif
  notes?: string;              // Optionnel
  poReference?: string;        // Optionnel, max 100 caractères
}
```

### UpdateInvoiceDto

Tous les champs optionnels (PartialType de CreateInvoiceDto).

## Repository

### Méthodes personnalisées

- `findByCompany(companyId: number)`: Liste des factures d'une société
- `findByBusinessPartner(businessPartnerId: number)`: Factures d'un partenaire
- `findByCompanyAndType(companyId: number, type: string)`: Factures par type
- `findByCompanyAndStatus(companyId: number, status: string)`: Factures par statut
- `findByCompanyAndDateRange(companyId: number, start: Date, end: Date)`: Factures par période
- `findOverdueByCompany(companyId: number)`: Factures en retard
- `findByCompanyAndNumber(companyId: number, number: string)`: Recherche par numéro
- `numberExistsForCompany(companyId: number, number: string, excludeId?: number)`: Vérification unicité
- `updateBalance(id: number, paidAmount: number)`: Mise à jour du solde
- `softDelete(id: number)`: Suppression logique

## Service

### Méthodes

- `create(dto: CreateInvoiceDto)`: Créer une facture
- `findAll()`: Lister toutes les factures
- `findByCompany(companyId: number)`: Factures par société
- `findByBusinessPartner(businessPartnerId: number)`: Factures par partenaire
- `findByCompanyAndType(companyId: number, type: string)`: Factures par type
- `findByCompanyAndStatus(companyId: number, status: string)`: Factures par statut
- `findByCompanyAndDateRange(companyId: number, start: string, end: string)`: Factures par période
- `findOverdueByCompany(companyId: number)`: Factures en retard
- `findOne(id: number)`: Trouver par ID
- `findByCompanyAndNumber(companyId: number, number: string)`: Trouver par numéro
- `update(id: number, dto: UpdateInvoiceDto)`: Mettre à jour
- `updateStatus(id: number, status: string)`: Changer le statut
- `recordPayment(id: number, amount: number)`: Enregistrer un paiement
- `remove(id: number)`: Supprimer (soft delete)

### Validations

- Numéro de facture unique par société
- Date d'échéance >= date de facture
- Montant de paiement <= solde restant
- Validation des données via class-validator

### Gestion des erreurs

- `NotFoundException`: Facture non trouvée
- `ConflictException`: Numéro de facture déjà existant
- `BadRequestException`: Dates invalides ou paiement excédant le total

## Controller

### Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/invoice` | Créer une facture |
| GET | `/invoice` | Lister toutes les factures |
| GET | `/invoice/:id` | Obtenir une facture par ID |
| GET | `/invoice/by-company/:companyId` | Factures par société |
| GET | `/invoice/by-company/:companyId?type=SALES` | Factures par type |
| GET | `/invoice/by-company/:companyId?status=DRAFT` | Factures par statut |
| GET | `/invoice/by-company/:companyId?startDate=...&endDate=...` | Factures par période |
| GET | `/invoice/by-business-partner/:businessPartnerId` | Factures par partenaire |
| GET | `/invoice/overdue/by-company/:companyId` | Factures en retard |
| GET | `/invoice/by-company/:companyId/by-number/:number` | Trouver par numéro |
| PATCH | `/invoice/:id` | Mettre à jour une facture |
| PATCH | `/invoice/:id/status/:status` | Changer le statut |
| POST | `/invoice/:id/payment` | Enregistrer un paiement |
| DELETE | `/invoice/:id` | Supprimer (soft delete) |

### Exemples de requêtes

#### Créer une facture

```bash
POST /invoice
Content-Type: application/json

{
  "companyId": 1,
  "invoiceNumber": "INV-2025-001",
  "invoiceType": "SALES",
  "businessPartnerId": 1,
  "invoiceDate": "2025-01-15",
  "dueDate": "2025-02-15",
  "currencyId": 1,
  "exchangeRate": 1.0,
  "totalBeforeTax": 1000.00,
  "totalTax": 200.00,
  "totalAmount": 1200.00,
  "fiscalYearId": 1,
  "notes": "Facture pour services de conseil",
  "poReference": "PO-12345"
}
```

#### Enregistrer un paiement

```bash
POST /invoice/1/payment
Content-Type: application/json

{
  "amount": 500.00
}
```

#### Lister les factures en retard

```bash
GET /invoice/overdue/by-company/1
```

#### Filtrer par période

```bash
GET /invoice/by-company/1?startDate=2025-01-01&endDate=2025-01-31
```

## Tests

### Couverture

- Test unitaire du service
- Mocks du repository
- Validation de la création
- Test de l'exception de conflit (numéro dupliqué)
- Test de validation de dates
- Test d'enregistrement de paiement
- Test de dépassement de paiement

### Exécution

```bash
# Tests unitaires du module invoice
npm run test -- invoice.service.spec

# Couverture de code
npm run test:cov -- invoice.service.spec
```

## Utilisation dans d'autres modules

```typescript
import { InvoiceModule } from './modules/invoice/invoice.module';
import { InvoiceService } from './modules/invoice/invoice.service';

@Module({
  imports: [InvoiceModule],
})
export class SomeModule {
  constructor(private invoiceService: InvoiceService) {}
}
```

## Règles métier

1. **Unicité du numéro**: Le numéro de facture doit être unique au sein d'une société
2. **Isolation multi-société**: Chaque société gère ses propres factures
3. **Validation des dates**: La date d'échéance doit être >= à la date de facture
4. **Gestion des paiements**:
   - Le montant payé ne peut excéder le total de la facture
   - Le solde est calculé automatiquement (total - payé)
   - Le statut est mis à jour automatiquement selon les paiements
5. **Types de factures**:
   - `SALES`: Facture de vente
   - `PURCHASE`: Facture d'achat
   - `CREDIT_NOTE`: Avoir (réduction)
   - `DEBIT_NOTE`: Note de débit (supplément)
6. **Statuts**:
   - `DRAFT`: Brouillon
   - `POSTED`: Comptabilisée
   - `PARTIALLY_PAID`: Partiellement payée
   - `PAID`: Payée intégralement
   - `CANCELLED`: Annulée
7. **Soft delete**: Les factures ne sont jamais supprimées physiquement
8. **Traçabilité**: Horodatage automatique (createdAt, updatedAt)

## Améliorations futures possibles

- Lignes de facture (invoice_lines) avec produits et quantités
- Calcul automatique des taxes selon les codes de taxe
- Génération automatique de numéros de facture
- Workflow d'approbation (draft → approved → posted)
- Intégration avec module de comptabilité (écritures comptables)
- Export PDF des factures
- Envoi par email
- Lettrage avec les paiements
- Gestion des relances pour factures en retard
- Conversion de devises automatique
