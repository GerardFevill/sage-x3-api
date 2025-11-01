# Quick Start Guide - ERP Sage X3 MVP

## 🚀 Démarrage Rapide

### Installation en 3 étapes

#### 1. Installer Liquibase

**macOS :**
```bash
brew install liquibase
```

**Linux (Ubuntu/Debian) :**
```bash
wget -O- https://repo.liquibase.com/liquibase.asc | gpg --dearmor > liquibase-keyring.gpg
cat liquibase-keyring.gpg | sudo tee /usr/share/keyrings/liquibase-keyring.gpg > /dev/null
echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/liquibase-keyring.gpg] https://repo.liquibase.com stable main' | sudo tee /etc/apt/sources.list.d/liquibase.list
sudo apt-get update
sudo apt-get install liquibase
```

**Vérification :**
```bash
liquibase --version
```

#### 2. Créer la base de données

```bash
# Méthode 1 : Script automatique
./deploy.sh

# Méthode 2 : Manuel
createdb erp_sage_x3_mvp
cd liquibase
liquibase \
  --changelog-file=changelog-master.yaml \
  --url=jdbc:postgresql://localhost:5432/erp_sage_x3_mvp \
  --username=postgres \
  update
```

#### 3. Charger les données de test

```bash
psql -d erp_sage_x3_mvp -f test-data/001-test-data.sql
```

---

## 📊 Commandes Utiles

### Connexion à la base

```bash
psql -d erp_sage_x3_mvp
```

### Lister les tables

```sql
\dt

-- Résultat attendu : 36 tables
```

### Vérifier l'équilibre comptable

```sql
SELECT
  id,
  transaction_number,
  total_debit,
  total_credit,
  balance_check,
  status
FROM gl_transaction;

-- Tous les balance_check doivent être 0.00
```

### Consulter la balance comptable

```sql
SELECT
  a.account_number,
  a.name,
  SUM(l.debit_base_amount) - SUM(l.credit_base_amount) AS balance
FROM gl_transaction_line l
JOIN account a ON a.id = l.account_id
JOIN gl_transaction t ON t.id = l.gl_transaction_id
WHERE t.status = 'POSTED'
GROUP BY a.account_number, a.name
ORDER BY a.account_number;
```

### Voir les factures clients

```sql
SELECT
  si.invoice_number,
  bp.name AS customer,
  si.invoice_date,
  si.total_amount,
  si.paid_amount,
  si.balance_due,
  si.status
FROM sales_invoice si
JOIN business_partner bp ON bp.id = si.customer_id
ORDER BY si.invoice_date DESC;
```

### Situation TVA

```sql
SELECT
  (SELECT COALESCE(SUM(credit_base_amount), 0)
   FROM gl_transaction_line l
   JOIN gl_transaction t ON t.id = l.gl_transaction_id
   WHERE l.account_id = 10 AND t.status = 'POSTED') AS tva_collectee,
  (SELECT COALESCE(SUM(debit_base_amount), 0)
   FROM gl_transaction_line l
   JOIN gl_transaction t ON t.id = l.gl_transaction_id
   WHERE l.account_id = 9 AND t.status = 'POSTED') AS tva_deductible;
```

### Validation complète

```bash
psql -d erp_sage_x3_mvp -f test-data/002-validation-queries.sql | grep "PASS"
```

**Résultats attendus :**
```
✓ PASS - GL Balance Check
✓ PASS - Sales Invoice Totals Check
✓ PASS - Purchase Invoice Totals Check
✓ PASS - Payment Allocation Check
✓ PASS - Global Balance Check
✓ PASS - Accounting Equation Check
```

---

## 🧪 Scénarios de Test

### Créer une nouvelle facture client

```sql
-- 1. Créer en-tête
INSERT INTO sales_invoice (
  company_id, fiscal_year_id, invoice_number, invoice_date, due_date,
  customer_id, currency_id, status, created_by, updated_by
)
VALUES (1, 1, 'FC-2024-0002', CURRENT_DATE, CURRENT_DATE + 30, 1, 1, 'DRAFT', 1, 1)
RETURNING id;

-- Supposons id = 2

-- 2. Ajouter ligne (calcul automatique)
INSERT INTO sales_invoice_line (
  sales_invoice_id, line_number, product_id, description,
  quantity, unit_price, tax_code_id, tax_rate, account_id
)
VALUES (2, 1, 1, 'Ordinateur Portable Pro', 1, 1200.00, 1, 20.00, 15);

-- 3. Vérifier totaux (automatiquement calculés)
SELECT invoice_number, subtotal, tax_amount, total_amount
FROM sales_invoice WHERE id = 2;

-- Résultat : subtotal=1200, tax_amount=240, total=1440
```

### Créer un règlement

```sql
-- 1. Créer paiement
INSERT INTO payment (
  company_id, fiscal_year_id, payment_number, payment_date,
  payment_type, business_partner_id, currency_id, amount,
  payment_method, bank_account_id, status, created_by, updated_by
)
VALUES (1, 1, 'RGL-CLI-2024-0002', CURRENT_DATE, 'RECEIPT', 1, 1, 1440.00,
        'BANK_TRANSFER', 11, 'DRAFT', 1, 1)
RETURNING id;

-- Supposons id = 2

-- 2. Affecter à facture
INSERT INTO payment_allocation (
  payment_id, invoice_type, sales_invoice_id, allocated_amount, allocation_date, created_by
)
VALUES (2, 'SALES', 2, 1440.00, CURRENT_DATE, 1);

-- 3. Vérifier statut facture (automatiquement PAID)
SELECT invoice_number, status, balance_due FROM sales_invoice WHERE id = 2;
```

---

## 🔍 Requêtes d'Analyse

### Top 5 clients (CA)

```sql
SELECT
  bp.code,
  bp.name,
  COUNT(*) AS invoice_count,
  SUM(si.total_amount) AS total_revenue
FROM sales_invoice si
JOIN business_partner bp ON bp.id = si.customer_id
WHERE si.status IN ('POSTED', 'PAID')
GROUP BY bp.id, bp.code, bp.name
ORDER BY total_revenue DESC
LIMIT 5;
```

### Créances échues

```sql
SELECT
  bp.name AS customer,
  si.invoice_number,
  si.due_date,
  si.balance_due,
  CURRENT_DATE - si.due_date AS days_overdue
FROM sales_invoice si
JOIN business_partner bp ON bp.id = si.customer_id
WHERE si.balance_due > 0
  AND si.due_date < CURRENT_DATE
ORDER BY si.due_date;
```

### Journal des ventes du mois

```sql
SELECT
  si.invoice_date,
  si.invoice_number,
  bp.name AS customer,
  si.subtotal AS amount_ht,
  si.tax_amount AS tva,
  si.total_amount AS amount_ttc
FROM sales_invoice si
JOIN business_partner bp ON bp.id = si.customer_id
WHERE si.status = 'POSTED'
  AND EXTRACT(MONTH FROM si.invoice_date) = EXTRACT(MONTH FROM CURRENT_DATE)
  AND EXTRACT(YEAR FROM si.invoice_date) = EXTRACT(YEAR FROM CURRENT_DATE)
ORDER BY si.invoice_date;
```

### Grand livre d'un compte

```sql
-- Exemple : Grand livre du compte client MEGA CORP (account_id = 8)
SELECT
  t.transaction_date,
  t.transaction_number,
  l.description,
  l.debit_base_amount,
  l.credit_base_amount,
  SUM(l.debit_base_amount - l.credit_base_amount)
    OVER (ORDER BY t.transaction_date, t.id, l.line_number) AS balance
FROM gl_transaction_line l
JOIN gl_transaction t ON t.id = l.gl_transaction_id
WHERE l.account_id = 8
  AND t.status = 'POSTED'
ORDER BY t.transaction_date, t.id, l.line_number;
```

---

## 🛠️ Maintenance

### Sauvegarder la base

```bash
pg_dump erp_sage_x3_mvp > backup_$(date +%Y%m%d).sql
```

### Restaurer depuis sauvegarde

```bash
createdb erp_sage_x3_mvp_restore
psql -d erp_sage_x3_mvp_restore < backup_20240115.sql
```

### Vérifier intégrité

```bash
psql -d erp_sage_x3_mvp -c "
SELECT COUNT(*) AS unbalanced_transactions
FROM gl_transaction
WHERE status IN ('POSTED', 'VALIDATED')
  AND ABS(balance_check) >= 0.01;
"

-- Résultat attendu : 0
```

### Recalculer les soldes

```sql
-- Recalculer soldes d'une période donnée
DELETE FROM gl_balance WHERE period_year = 2024 AND period_month = 1;

INSERT INTO gl_balance (
  company_id, fiscal_year_id, account_id, period_year, period_month,
  period_debit, period_credit, currency_id
)
SELECT
  t.company_id,
  t.fiscal_year_id,
  l.account_id,
  EXTRACT(YEAR FROM t.transaction_date),
  EXTRACT(MONTH FROM t.transaction_date),
  SUM(l.debit_base_amount),
  SUM(l.credit_base_amount),
  1
FROM gl_transaction t
JOIN gl_transaction_line l ON l.gl_transaction_id = t.id
WHERE t.status = 'POSTED'
  AND EXTRACT(YEAR FROM t.transaction_date) = 2024
  AND EXTRACT(MONTH FROM t.transaction_date) = 1
GROUP BY t.company_id, t.fiscal_year_id, l.account_id,
         EXTRACT(YEAR FROM t.transaction_date),
         EXTRACT(MONTH FROM t.transaction_date);
```

---

## 📚 Ressources

### Documentation

- **Modèle conceptuel** : `docs/01-conceptual-model.md`
- **Récapitulatif schéma** : `docs/02-database-schema-summary.md`
- **README principal** : `README.md`

### Fichiers de test

- **Données de test** : `test-data/001-test-data.sql`
- **Validations** : `test-data/002-validation-queries.sql`

### Scripts

- **Déploiement automatique** : `./deploy.sh`
- **Liquibase master** : `liquibase/changelog-master.yaml`

---

## 🐛 Dépannage

### Erreur : "Cannot connect to PostgreSQL"

```bash
# Vérifier que PostgreSQL est démarré
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# Démarrer si nécessaire
sudo systemctl start postgresql  # Linux
brew services start postgresql  # macOS
```

### Erreur : "Database already exists"

```bash
# Supprimer et recréer
dropdb erp_sage_x3_mvp
./deploy.sh
```

### Erreur : "balance_check constraint violation"

```sql
-- Vérifier l'écriture déséquilibrée
SELECT * FROM gl_transaction WHERE ABS(balance_check) >= 0.01;

-- Corriger en ajoutant/supprimant lignes
-- puis recalculer
SELECT calculate_gl_transaction_balance();
```

### Performances lentes

```sql
-- Analyser les index
ANALYZE;

-- Vérifier statistiques
SELECT schemaname, tablename, n_live_tup
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;

-- Reconstruire index si nécessaire
REINDEX DATABASE erp_sage_x3_mvp;
```

---

## ✅ Checklist de Validation

Après installation, vérifier :

- [ ] 36 tables créées (`\dt`)
- [ ] Utilisateurs créés (2+)
- [ ] Devises créées (3+)
- [ ] Société ACME France créée
- [ ] Plan comptable chargé (15+ comptes)
- [ ] Écritures équilibrées (balance_check = 0)
- [ ] Factures avec totaux corrects
- [ ] Paiements affectés correctement
- [ ] Toutes validations PASS ✓

---

## 🎓 Prochaines Étapes

1. **Explorer les données de test**
   ```bash
   psql -d erp_sage_x3_mvp
   \dt
   SELECT * FROM company;
   ```

2. **Tester les triggers**
   - Créer une facture
   - Vérifier calculs automatiques
   - Valider équilibre GL

3. **Personnaliser**
   - Ajouter votre société
   - Importer votre plan comptable
   - Créer vos produits

4. **Intégrer à une API**
   - Node.js + TypeORM
   - Python + SQLAlchemy
   - Java + Hibernate

---

**Support** : Pour questions, voir `README.md` ou créer une issue GitHub.

**Documentation complète** : Consulter `docs/`

**Bonne utilisation ! 🚀**
