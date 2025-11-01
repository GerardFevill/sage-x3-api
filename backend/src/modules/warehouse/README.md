# Warehouse Module

Module de gestion des entrepôts pour le système ERP.

## Fonctionnalités

- Création et gestion des entrepôts
- Support multi-société (isolation par companyId)
- Codes entrepôt uniques par société
- Recherche par société et code
- Filtrage des entrepôts actifs
- Soft delete (suppression logique)
- Validation des données
- Documentation Swagger

## Structure

```
warehouse/
├── dto/
│   ├── index.ts
│   ├── create-warehouse.dto.ts
│   └── update-warehouse.dto.ts
├── warehouse.entity.ts
├── warehouse.repository.ts
├── warehouse.service.ts
├── warehouse.controller.ts
├── warehouse.service.spec.ts
├── warehouse.module.ts
└── README.md
```

## Entity: Warehouse

### Champs

| Champ | Type | Description |
|-------|------|-------------|
| id | bigint | Identifiant unique (PK) |
| companyId | bigint | Identifiant de la société (FK) |
| warehouseCode | varchar(20) | Code de l'entrepôt (unique par société) |
| warehouseName | varchar(200) | Nom de l'entrepôt |
| address | varchar(500) | Adresse de l'entrepôt (optionnel) |
| city | varchar(100) | Ville (optionnel) |
| postalCode | varchar(20) | Code postal (optionnel) |
| country | varchar(100) | Pays (optionnel) |
| isActive | boolean | Statut actif/inactif (défaut: true) |
| createdAt | timestamp | Date de création |
| updatedAt | timestamp | Date de dernière modification |

### Relations

- `companyId` → `company.id` (Many-to-One)

## DTOs

### CreateWarehouseDto

```typescript
{
  companyId: number;        // Requis, positif
  warehouseCode: string;    // Requis, 1-20 caractères
  warehouseName: string;    // Requis, 2-200 caractères
  address?: string;         // Optionnel, max 500 caractères
  city?: string;            // Optionnel, max 100 caractères
  postalCode?: string;      // Optionnel, max 20 caractères
  country?: string;         // Optionnel, max 100 caractères
}
```

### UpdateWarehouseDto

Tous les champs optionnels (PartialType de CreateWarehouseDto).

## Repository

### Méthodes personnalisées

- `findByCompany(companyId: number)`: Liste des entrepôts d'une société
- `findActiveByCompany(companyId: number)`: Entrepôts actifs d'une société
- `findByCompanyAndCode(companyId: number, code: string)`: Recherche par société et code
- `codeExistsForCompany(companyId: number, code: string, excludeId?: number)`: Vérification unicité du code
- `softDelete(id: number)`: Suppression logique (isActive = false)

## Service

### Méthodes

- `create(dto: CreateWarehouseDto)`: Créer un entrepôt
- `findAll()`: Lister tous les entrepôts
- `findByCompany(companyId: number)`: Entrepôts par société
- `findActiveByCompany(companyId: number)`: Entrepôts actifs par société
- `findOne(id: number)`: Trouver par ID
- `findByCompanyAndCode(companyId: number, code: string)`: Trouver par société et code
- `update(id: number, dto: UpdateWarehouseDto)`: Mettre à jour
- `remove(id: number)`: Supprimer (soft delete)

### Validations

- Code entrepôt unique par société
- Validation des données via class-validator
- Vérification de l'existence lors de la mise à jour

### Gestion des erreurs

- `NotFoundException`: Entrepôt non trouvé
- `ConflictException`: Code entrepôt déjà existant pour la société

## Controller

### Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/warehouse` | Créer un entrepôt |
| GET | `/warehouse` | Lister tous les entrepôts |
| GET | `/warehouse/:id` | Obtenir un entrepôt par ID |
| GET | `/warehouse/by-company/:companyId` | Entrepôts par société |
| GET | `/warehouse/by-company/:companyId?active=true` | Entrepôts actifs par société |
| GET | `/warehouse/by-company/:companyId/by-code/:code` | Trouver par société et code |
| PATCH | `/warehouse/:id` | Mettre à jour un entrepôt |
| DELETE | `/warehouse/:id` | Supprimer (soft delete) |

### Exemples de requêtes

#### Créer un entrepôt

```bash
POST /warehouse
Content-Type: application/json

{
  "companyId": 1,
  "warehouseCode": "WH001",
  "warehouseName": "Entrepôt Principal Paris",
  "address": "123 Rue de la Logistique",
  "city": "Paris",
  "postalCode": "75001",
  "country": "France"
}
```

#### Lister les entrepôts actifs d'une société

```bash
GET /warehouse/by-company/1?active=true
```

#### Mettre à jour un entrepôt

```bash
PATCH /warehouse/1
Content-Type: application/json

{
  "warehouseName": "Entrepôt Principal Paris - Site Nord",
  "address": "456 Boulevard de la Supply Chain"
}
```

## Tests

### Couverture

- Test unitaire du service
- Mocks du repository
- Validation de la création
- Test de l'exception de conflit (code dupliqué)

### Exécution

```bash
# Tests unitaires du module warehouse
npm run test -- warehouse.service.spec

# Couverture de code
npm run test:cov -- warehouse.service.spec
```

## Utilisation dans d'autres modules

```typescript
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { WarehouseService } from './modules/warehouse/warehouse.service';

@Module({
  imports: [WarehouseModule],
})
export class SomeModule {
  constructor(private warehouseService: WarehouseService) {}
}
```

## Règles métier

1. **Unicité du code**: Le code entrepôt doit être unique au sein d'une société
2. **Isolation multi-société**: Chaque société gère ses propres entrepôts
3. **Soft delete**: Les entrepôts ne sont jamais supprimés physiquement
4. **Validation des données**: Tous les champs sont validés via class-validator
5. **Traçabilité**: Horodatage automatique (createdAt, updatedAt)

## Améliorations futures possibles

- Gestion des emplacements dans l'entrepôt (bins/locations)
- Capacité de stockage et occupation
- Association aux mouvements de stock
- Historique des transferts entre entrepôts
- Gestion des zones de picking
- Intégration avec module de gestion des stocks
