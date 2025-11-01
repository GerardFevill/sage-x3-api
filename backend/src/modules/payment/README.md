# Payment Module

Module de gestion des paiements pour le système ERP.

## Fonctionnalités

- Création et gestion des paiements (reçus et envoyés)
- Support multi-société (isolation par companyId)
- Numéros de paiement uniques par société
- Liaison avec les factures (optionnelle)
- Suivi par méthode de paiement
- Filtrage par type, statut, dates, méthode
- Calcul des totaux par type
- Gestion des devises et taux de change
- Soft delete (suppression logique)
- Validation des données
- Documentation Swagger

## Structure

```
payment/
├── dto/
│   ├── index.ts
│   ├── create-payment.dto.ts
│   └── update-payment.dto.ts
├── payment.entity.ts
├── payment.repository.ts
├── payment.service.ts
├── payment.controller.ts
├── payment.service.spec.ts
├── payment.module.ts
└── README.md
```

## Entity: Payment

### Champs

| Champ | Type | Description |
|-------|------|-------------|
| id | bigint | Identifiant unique (PK) |
| companyId | bigint | Identifiant de la société (FK) |
| paymentNumber | varchar(50) | Numéro de paiement (unique par société) |
| paymentType | varchar(20) | Type de paiement (RECEIVED, SENT) |
| businessPartnerId | bigint | Identifiant du partenaire commercial (FK) |
| invoiceId | bigint | Identifiant de la facture (FK, optionnel) |
| paymentDate | date | Date du paiement |
| currencyId | bigint | Identifiant de la devise (FK) |
| exchangeRate | decimal(15,6) | Taux de change (défaut: 1.0) |
| amount | decimal(18,2) | Montant du paiement |
| paymentMethod | varchar(50) | Méthode de paiement (CASH, BANK_TRANSFER, CHECK, CREDIT_CARD, OTHER) |
| reference | varchar(100) | Référence du paiement (optionnel) |
| notes | text | Notes (optionnel) |
| status | varchar(20) | Statut (PENDING, COMPLETED, CANCELLED) |
| isActive | boolean | Statut actif/inactif (défaut: true) |
| createdAt | timestamp | Date de création |
| updatedAt | timestamp | Date de dernière modification |

### Relations

- `companyId` → `company.id` (Many-to-One)
- `businessPartnerId` → `business_partner.id` (Many-to-One)
- `currencyId` → `currency.id` (Many-to-One)
- `invoiceId` → `invoice.id` (Many-to-One, optionnel)

## DTOs

### CreatePaymentDto

```typescript
{
  companyId: number;           // Requis, positif
  paymentNumber: string;       // Requis, 1-50 caractères
  paymentType: string;         // Requis, RECEIVED|SENT
  businessPartnerId: number;   // Requis, positif
  invoiceId?: number;          // Optionnel, positif
  paymentDate: string;         // Requis, ISO 8601
  currencyId: number;          // Requis, positif
  exchangeRate?: number;       // Optionnel, défaut: 1.0
  amount: number;              // Requis, > 0
  paymentMethod: string;       // Requis, CASH|BANK_TRANSFER|CHECK|CREDIT_CARD|OTHER
  reference?: string;          // Optionnel, max 100 caractères
  notes?: string;              // Optionnel
}
```

### UpdatePaymentDto

Tous les champs optionnels (PartialType de CreatePaymentDto).

## Repository

### Méthodes personnalisées

- `findByCompany(companyId: number)`: Liste des paiements d'une société
- `findByBusinessPartner(businessPartnerId: number)`: Paiements d'un partenaire
- `findByInvoice(invoiceId: number)`: Paiements liés à une facture
- `findByCompanyAndType(companyId: number, type: string)`: Paiements par type
- `findByCompanyAndStatus(companyId: number, status: string)`: Paiements par statut
- `findByCompanyAndDateRange(companyId: number, start: Date, end: Date)`: Paiements par période
- `findByCompanyAndMethod(companyId: number, method: string)`: Paiements par méthode
- `findByCompanyAndNumber(companyId: number, number: string)`: Recherche par numéro
- `numberExistsForCompany(companyId: number, number: string, excludeId?: number)`: Vérification unicité
- `getTotalByCompanyAndType(companyId: number, type: string)`: Total par type
- `softDelete(id: number)`: Suppression logique

## Service

### Méthodes

- `create(dto: CreatePaymentDto)`: Créer un paiement
- `findAll()`: Lister tous les paiements
- `findByCompany(companyId: number)`: Paiements par société
- `findByBusinessPartner(businessPartnerId: number)`: Paiements par partenaire
- `findByInvoice(invoiceId: number)`: Paiements d'une facture
- `findByCompanyAndType(companyId: number, type: string)`: Paiements par type
- `findByCompanyAndStatus(companyId: number, status: string)`: Paiements par statut
- `findByCompanyAndDateRange(companyId: number, start: string, end: string)`: Paiements par période
- `findByCompanyAndMethod(companyId: number, method: string)`: Paiements par méthode
- `findOne(id: number)`: Trouver par ID
- `findByCompanyAndNumber(companyId: number, number: string)`: Trouver par numéro
- `update(id: number, dto: UpdatePaymentDto)`: Mettre à jour
- `updateStatus(id: number, status: string)`: Changer le statut
- `getTotalByCompanyAndType(companyId: number, type: string)`: Total par type
- `remove(id: number)`: Supprimer (soft delete)

### Validations

- Numéro de paiement unique par société
- Montant positif (> 0)
- Validation des données via class-validator

### Gestion des erreurs

- `NotFoundException`: Paiement non trouvé
- `ConflictException`: Numéro de paiement déjà existant
- `BadRequestException`: Montant invalide

## Controller

### Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/payment` | Créer un paiement |
| GET | `/payment` | Lister tous les paiements |
| GET | `/payment/:id` | Obtenir un paiement par ID |
| GET | `/payment/by-company/:companyId` | Paiements par société |
| GET | `/payment/by-company/:companyId?type=RECEIVED` | Paiements par type |
| GET | `/payment/by-company/:companyId?status=COMPLETED` | Paiements par statut |
| GET | `/payment/by-company/:companyId?method=BANK_TRANSFER` | Paiements par méthode |
| GET | `/payment/by-company/:companyId?startDate=...&endDate=...` | Paiements par période |
| GET | `/payment/by-business-partner/:businessPartnerId` | Paiements par partenaire |
| GET | `/payment/by-invoice/:invoiceId` | Paiements d'une facture |
| GET | `/payment/total/by-company/:companyId/by-type/:type` | Total par type |
| GET | `/payment/by-company/:companyId/by-number/:number` | Trouver par numéro |
| PATCH | `/payment/:id` | Mettre à jour un paiement |
| PATCH | `/payment/:id/status/:status` | Changer le statut |
| DELETE | `/payment/:id` | Supprimer (soft delete) |

### Exemples de requêtes

#### Créer un paiement

```bash
POST /payment
Content-Type: application/json

{
  "companyId": 1,
  "paymentNumber": "PAY-2025-001",
  "paymentType": "RECEIVED",
  "businessPartnerId": 1,
  "invoiceId": 1,
  "paymentDate": "2025-01-20",
  "currencyId": 1,
  "exchangeRate": 1.0,
  "amount": 500.00,
  "paymentMethod": "BANK_TRANSFER",
  "reference": "REF123456",
  "notes": "Paiement reçu pour facture INV-2025-001"
}
```

#### Obtenir le total des paiements reçus

```bash
GET /payment/total/by-company/1/by-type/RECEIVED

Réponse:
{
  "total": 15000.00
}
```

#### Lister les paiements par carte de crédit

```bash
GET /payment/by-company/1?method=CREDIT_CARD
```

#### Filtrer par période

```bash
GET /payment/by-company/1?startDate=2025-01-01&endDate=2025-01-31
```

## Tests

### Couverture

- Test unitaire du service
- Mocks du repository
- Validation de la création
- Test de l'exception de conflit (numéro dupliqué)
- Test de validation de montant (zéro ou négatif)
- Test du calcul de total

### Exécution

```bash
# Tests unitaires du module payment
npm run test -- payment.service.spec

# Couverture de code
npm run test:cov -- payment.service.spec
```

## Utilisation dans d'autres modules

```typescript
import { PaymentModule } from './modules/payment/payment.module';
import { PaymentService } from './modules/payment/payment.service';

@Module({
  imports: [PaymentModule],
})
export class SomeModule {
  constructor(private paymentService: PaymentService) {}
}
```

## Règles métier

1. **Unicité du numéro**: Le numéro de paiement doit être unique au sein d'une société
2. **Isolation multi-société**: Chaque société gère ses propres paiements
3. **Validation du montant**: Le montant doit être strictement positif (> 0)
4. **Types de paiements**:
   - `RECEIVED`: Paiement reçu (encaissement)
   - `SENT`: Paiement envoyé (décaissement)
5. **Méthodes de paiement**:
   - `CASH`: Espèces
   - `BANK_TRANSFER`: Virement bancaire
   - `CHECK`: Chèque
   - `CREDIT_CARD`: Carte de crédit
   - `OTHER`: Autre
6. **Statuts**:
   - `PENDING`: En attente
   - `COMPLETED`: Complété
   - `CANCELLED`: Annulé
7. **Liaison avec factures**: Un paiement peut être lié à une facture (optionnel)
8. **Soft delete**: Les paiements ne sont jamais supprimés physiquement
9. **Traçabilité**: Horodatage automatique (createdAt, updatedAt)

## Améliorations futures possibles

- Allocation automatique des paiements sur plusieurs factures
- Gestion des acomptes (paiements sans facture)
- Rapprochement bancaire
- Génération automatique de numéros de paiement
- Intégration avec module de comptabilité (écritures comptables)
- Export des relevés de paiement
- Notifications par email
- Gestion des remises en banque
- Intégration avec passerelles de paiement
- Conversion de devises automatique
- Rapports de trésorerie
