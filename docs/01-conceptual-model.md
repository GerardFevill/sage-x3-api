# Modèle Conceptuel - ERP Sage X3 MVP

## Vue d'ensemble

Ce document décrit le modèle de données conceptuel pour le MVP d'un ERP inspiré de Sage X3.
L'architecture respecte les principes comptables professionnels : **multi-société**, **multi-exercice**, **multi-devise**, et **partie double**.

---

## 🏗️ Architecture des Tables Fondations

### 1. **company** (Sociétés)
**Rôle** : Pivot central du système multi-société.

| Colonne | Type | Description |
|---------|------|-------------|
| id | BIGSERIAL | Clé primaire |
| code | VARCHAR(10) | Code unique société (ex: FR01, US01) |
| name | VARCHAR(100) | Raison sociale |
| legal_name | VARCHAR(200) | Dénomination légale |
| tax_id | VARCHAR(50) | N° identification fiscale (SIRET, VAT) |
| default_currency_id | BIGINT | Devise par défaut → `currency.id` |
| is_active | BOOLEAN | Société active |

**Relations** :
- 1 company → N fiscal_year
- 1 company → N account
- 1 company → N journal
- 1 company → N tax_code
- 1 company → 1 currency (default)

---

### 2. **currency** (Devises)
**Rôle** : Gestion multi-devise avec codes ISO 4217.

| Colonne | Type | Description |
|---------|------|-------------|
| id | BIGSERIAL | Clé primaire |
| code | VARCHAR(3) | Code ISO 4217 (EUR, USD, GBP) |
| name | VARCHAR(100) | Nom de la devise |
| symbol | VARCHAR(10) | Symbole (€, $, £) |
| decimal_places | INTEGER | Nombre de décimales (2) |

**Relations** :
- 1 currency → N exchange_rate (source)
- 1 currency → N exchange_rate (cible)

---

### 3. **exchange_rate** (Taux de change)
**Rôle** : Historique des taux de conversion.

| Colonne | Type | Description |
|---------|------|-------------|
| id | BIGSERIAL | Clé primaire |
| from_currency_id | BIGINT | Devise source → `currency.id` |
| to_currency_id | BIGINT | Devise cible → `currency.id` |
| rate_date | DATE | Date d'application |
| rate | NUMERIC(20,10) | Taux (ex: 1 USD = 0.92 EUR) |
| rate_type | VARCHAR(20) | OFFICIAL, CUSTOM, BUDGET |

**Contrainte unique** : `(from_currency_id, to_currency_id, rate_date, rate_type)`

---

### 4. **fiscal_year** (Exercices comptables)
**Rôle** : Support multi-exercice par société.

| Colonne | Type | Description |
|---------|------|-------------|
| id | BIGSERIAL | Clé primaire |
| company_id | BIGINT | Société → `company.id` |
| code | VARCHAR(10) | Code exercice (2024, FY24) |
| start_date | DATE | Date de début |
| end_date | DATE | Date de fin |
| status | VARCHAR(20) | OPEN, CLOSED, LOCKED |

**Contrainte** : `end_date > start_date`
**Contrainte unique** : `(company_id, code)`

---

### 5. **chart_of_accounts** (Plans comptables)
**Rôle** : Templates de plans (PCG français, IFRS, US GAAP).

| Colonne | Type | Description |
|---------|------|-------------|
| id | BIGSERIAL | Clé primaire |
| code | VARCHAR(20) | Code plan (PCG_FR, IFRS) |
| name | VARCHAR(100) | Nom du plan |
| country_code | VARCHAR(2) | Pays ISO 3166-1 |

**Exemples** : PCG_FR (Plan Comptable Général français), IFRS (international), GAAP_US

---

### 6. **account** (Comptes comptables)
**Rôle** : Instances de comptes par société.

| Colonne | Type | Description |
|---------|------|-------------|
| id | BIGSERIAL | Clé primaire |
| company_id | BIGINT | Société → `company.id` |
| chart_of_accounts_id | BIGINT | Plan de référence → `chart_of_accounts.id` |
| account_number | VARCHAR(20) | N° compte (401000, 512000) |
| name | VARCHAR(200) | Libellé du compte |
| account_type | VARCHAR(30) | ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE |
| account_category | VARCHAR(50) | CURRENT_ASSET, FIXED_ASSET, etc. |
| parent_account_id | BIGINT | Compte parent (hiérarchie) |
| level | INTEGER | Niveau hiérarchique |
| is_header | BOOLEAN | Compte collectif |
| allow_posting | BOOLEAN | Autorise saisie directe |
| require_third_party | BOOLEAN | Exige un tiers (401xxx, 411xxx) |
| reconcilable | BOOLEAN | Compte lettrable |
| currency_id | BIGINT | Devise spécifique (optionnel) |

**Relations** :
- 1 company → N account
- 1 chart_of_accounts → N account
- 1 account → N account (hiérarchie parent-enfant)

**Contrainte unique** : `(company_id, account_number)`

**Types de comptes selon PCG** :
- **Classe 1** : EQUITY (Capitaux propres)
- **Classe 2** : ASSET (Immobilisations)
- **Classe 3** : ASSET (Stocks)
- **Classe 4** : ASSET/LIABILITY (Tiers - clients 41x, fournisseurs 40x)
- **Classe 5** : ASSET (Trésorerie)
- **Classe 6** : EXPENSE (Charges)
- **Classe 7** : REVENUE (Produits)

---

### 7. **journal** (Journaux comptables)
**Rôle** : Journaux de saisie par société.

| Colonne | Type | Description |
|---------|------|-------------|
| id | BIGSERIAL | Clé primaire |
| company_id | BIGINT | Société → `company.id` |
| code | VARCHAR(10) | Code journal (VTE, ACH, BQ, OD) |
| name | VARCHAR(100) | Libellé du journal |
| journal_type | VARCHAR(30) | SALES, PURCHASE, BANK, CASH, GENERAL, PAYROLL, OPENING, CLOSING |
| default_account_id | BIGINT | Compte de contrepartie → `account.id` |

**Contrainte unique** : `(company_id, code)`

**Exemples** :
- **VTE** : Journal des ventes
- **ACH** : Journal des achats
- **BQ** : Banque
- **CAISSE** : Caisse
- **OD** : Opérations diverses

---

### 8. **tax_code** (Codes TVA)
**Rôle** : Gestion des taxes (TVA, sales tax, etc.).

| Colonne | Type | Description |
|---------|------|-------------|
| id | BIGSERIAL | Clé primaire |
| company_id | BIGINT | Société → `company.id` |
| code | VARCHAR(20) | Code taxe (TVA20, TVA10, VATEX) |
| name | VARCHAR(100) | Libellé |
| tax_type | VARCHAR(30) | VAT, SALES_TAX, EXCISE, WITHHOLDING, NONE |
| rate | NUMERIC(10,4) | Taux en % (20.00 = 20%) |
| direction | VARCHAR(20) | INPUT (achats), OUTPUT (ventes) |
| tax_account_id | BIGINT | Compte d'imputation → `account.id` |
| effective_from | DATE | Date de début |
| effective_to | DATE | Date de fin |

**Contrainte** : `rate >= 0 AND rate <= 100`
**Contrainte unique** : `(company_id, code)`

**Exemples France** :
- TVA20 : 20% (taux normal)
- TVA10 : 10% (taux intermédiaire)
- TVA055 : 5.5% (taux réduit)
- TVA021 : 2.1% (super réduit)
- VATEX : Exonéré

---

### 9. **user_account** (Utilisateurs)
**Rôle** : Gestion des utilisateurs du système.

| Colonne | Type | Description |
|---------|------|-------------|
| id | BIGSERIAL | Clé primaire |
| username | VARCHAR(50) | Nom d'utilisateur unique |
| email | VARCHAR(255) | Email unique |
| password_hash | VARCHAR(255) | Hash sécurisé (bcrypt, argon2) |
| first_name | VARCHAR(100) | Prénom |
| last_name | VARCHAR(100) | Nom |
| is_active | BOOLEAN | Compte actif |
| is_locked | BOOLEAN | Compte verrouillé |
| failed_login_attempts | INTEGER | Tentatives échouées |
| last_login_at | TIMESTAMPTZ | Dernière connexion |

**Sécurité** :
- Hachage bcrypt/argon2 obligatoire
- Verrouillage après N tentatives
- Audit des connexions

---

### 10. **audit_log** (Journal d'audit)
**Rôle** : Traçabilité complète (RGPD, ISO 27001).

| Colonne | Type | Description |
|---------|------|-------------|
| id | BIGSERIAL | Clé primaire |
| user_id | BIGINT | Utilisateur → `user_account.id` |
| company_id | BIGINT | Société → `company.id` |
| table_name | VARCHAR(100) | Table modifiée |
| record_id | BIGINT | ID de l'enregistrement |
| action | VARCHAR(20) | INSERT, UPDATE, DELETE, LOGIN, LOGOUT |
| old_values | JSONB | Valeurs avant |
| new_values | JSONB | Valeurs après |
| ip_address | VARCHAR(45) | IP source |
| user_agent | TEXT | User agent |
| created_at | TIMESTAMPTZ | Horodatage |

**Utilisation** :
- Audit trail complet
- Conformité RGPD
- Investigation forensique
- Restauration de données

---

## 📊 Diagramme de Relations (Phase 1)

```
┌─────────────┐
│   company   │◄─────────┐
└──────┬──────┘          │
       │                 │
       │ 1:N             │ N:1
       │                 │
┌──────▼──────────┐      │
│  fiscal_year    │      │
└─────────────────┘      │
                         │
┌──────────────┐         │
│   currency   │◄────────┤
└──────┬───────┘         │
       │                 │
       │ 1:N             │
       │                 │
┌──────▼──────────┐      │
│ exchange_rate   │      │
└─────────────────┘      │
                         │
┌─────────────────┐      │
│chart_of_accounts│      │
└────────┬────────┘      │
         │               │
         │ 1:N           │
         │               │
┌────────▼─────┐         │
│   account    │◄────────┤
└──────────────┘         │
                         │
┌──────────────┐         │
│   journal    │◄────────┤
└──────────────┘         │
                         │
┌──────────────┐         │
│  tax_code    │◄────────┘
└──────────────┘

┌───────────────┐
│ user_account  │
└───────┬───────┘
        │
        │ 1:N
        │
┌───────▼──────┐
│  audit_log   │
└──────────────┘
```

---

## ✅ Validation de Cohérence

### Règles métier implémentées :

1. **Multi-société** : Toute donnée transactionnelle DOIT avoir un `company_id`
2. **Multi-exercice** : Les transactions comptables DOIVENT référencer un `fiscal_year_id`
3. **Multi-devise** : Support natif via `currency` et `exchange_rate`
4. **Clés logiques** : Toutes les tables ont `created_at`, `updated_at`, `created_by`, `updated_by`
5. **Contraintes d'intégrité** :
   - Unicité : codes société, codes comptes par société, etc.
   - Checks : dates cohérentes, taux de taxe [0,100], statuts énumérés
   - FK : CASCADE ou RESTRICT selon logique métier
6. **Audit** : Table `audit_log` pour traçabilité complète

### Prochaines étapes (Phase 2) :

- Tables comptables : `gl_transaction`, `gl_transaction_line`
- Contraintes d'équilibrage : débit = crédit
- Séquençage des pièces comptables
- Statuts de validation

---

## 📝 Notes d'architecture

### Choix techniques :

- **BIGSERIAL** : Clés primaires auto-incrémentées 64 bits
- **NUMERIC** : Pour montants (précision exacte, pas de FLOAT)
- **TIMESTAMPTZ** : Horodatage avec fuseau horaire
- **JSONB** : Stockage flexible pour audit (indexable)
- **VARCHAR** vs **TEXT** : VARCHAR pour colonnes indexées, TEXT pour contenu long

### Conventions de nommage :

- Tables : `snake_case` au singulier
- FK : `{table}_id` (ex: `company_id`, `currency_id`)
- Contraintes :
  - PK : `pk_{table}`
  - FK : `fk_{table}_{referenced_table}`
  - UK : `uk_{table}_{columns}`
  - CK : `chk_{table}_{rule}`

### Performance :

- Index créés automatiquement sur PK et UK
- Index supplémentaires à créer en Phase 5
- Partitionnement à considérer pour `audit_log` (par date)

---

**Date de création** : 2025-11-01
**Auteur** : ERP Architect
**Version** : 1.0 - Phase 1 Foundation Tables
