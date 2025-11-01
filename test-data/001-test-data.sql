-- =============================================================================
-- TEST DATA - ERP Sage X3 MVP
-- =============================================================================
-- Jeux de données de test pour valider le modèle
-- Inclut un scénario complet :
-- 1. Création société, exercice, devises
-- 2. Plan comptable simplifié
-- 3. Tiers (clients/fournisseurs)
-- 4. Produits
-- 5. Facture client et écriture comptable
-- 6. Facture fournisseur
-- 7. Règlements
-- 8. Validation équilibrage comptable
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. UTILISATEUR SYSTÈME (pour created_by/updated_by)
-- -----------------------------------------------------------------------------
INSERT INTO user_account (id, username, email, password_hash, first_name, last_name, is_active)
VALUES
  (1, 'admin', 'admin@erp-demo.com', '$2a$10$XYZ...', 'Admin', 'System', true),
  (2, 'comptable', 'comptable@erp-demo.com', '$2a$10$ABC...', 'Marie', 'Dupont', true);

SELECT setval('user_account_id_seq', 2);

-- -----------------------------------------------------------------------------
-- 2. DEVISES
-- -----------------------------------------------------------------------------
INSERT INTO currency (id, code, name, symbol, decimal_places, is_active, created_by, updated_by)
VALUES
  (1, 'EUR', 'Euro', '€', 2, true, 1, 1),
  (2, 'USD', 'US Dollar', '$', 2, true, 1, 1),
  (3, 'GBP', 'British Pound', '£', 2, true, 1, 1);

SELECT setval('currency_id_seq', 3);

-- -----------------------------------------------------------------------------
-- 3. TAUX DE CHANGE
-- -----------------------------------------------------------------------------
INSERT INTO exchange_rate (from_currency_id, to_currency_id, rate_date, rate, rate_type, created_by, updated_by)
VALUES
  (2, 1, '2024-01-01', 0.92, 'OFFICIAL', 1, 1),   -- 1 USD = 0.92 EUR
  (1, 2, '2024-01-01', 1.087, 'OFFICIAL', 1, 1),  -- 1 EUR = 1.087 USD
  (3, 1, '2024-01-01', 1.15, 'OFFICIAL', 1, 1),   -- 1 GBP = 1.15 EUR
  (1, 3, '2024-01-01', 0.87, 'OFFICIAL', 1, 1);   -- 1 EUR = 0.87 GBP

-- -----------------------------------------------------------------------------
-- 4. SOCIÉTÉ
-- -----------------------------------------------------------------------------
INSERT INTO company (id, code, name, legal_name, tax_id, registration_number,
                     address_line1, city, postal_code, country_code,
                     default_currency_id, is_active, created_by, updated_by)
VALUES
  (1, 'FR01', 'ACME France SAS', 'ACME France Société par Actions Simplifiée',
   '12345678901234', '123 456 789 RCS Paris',
   '123 Avenue des Champs-Élysées', 'Paris', '75008', 'FR',
   1, true, 1, 1);

SELECT setval('company_id_seq', 1);

-- -----------------------------------------------------------------------------
-- 5. EXERCICE COMPTABLE
-- -----------------------------------------------------------------------------
INSERT INTO fiscal_year (id, company_id, code, name, start_date, end_date, status, is_active, created_by, updated_by)
VALUES
  (1, 1, '2024', 'Exercice 2024', '2024-01-01', '2024-12-31', 'OPEN', true, 1, 1);

SELECT setval('fiscal_year_id_seq', 1);

-- -----------------------------------------------------------------------------
-- 6. PLAN COMPTABLE (PCG Français simplifié)
-- -----------------------------------------------------------------------------
INSERT INTO chart_of_accounts (id, code, name, description, country_code, is_active, created_by, updated_by)
VALUES
  (1, 'PCG_FR', 'Plan Comptable Général Français', 'Plan comptable conforme aux normes françaises', 'FR', true, 1, 1);

SELECT setval('chart_of_accounts_id_seq', 1);

-- -----------------------------------------------------------------------------
-- 7. COMPTES COMPTABLES (Sélection)
-- -----------------------------------------------------------------------------
INSERT INTO account (id, company_id, chart_of_accounts_id, account_number, name, account_type, account_category,
                     parent_account_id, level, is_header, allow_posting, require_third_party, reconcilable,
                     is_active, created_by, updated_by)
VALUES
  -- Classe 1 : Capitaux propres
  (1, 1, 1, '101000', 'Capital', 'EQUITY', 'CAPITAL', NULL, 1, false, true, false, false, true, 1, 1),
  (2, 1, 1, '120000', 'Résultat de l''exercice', 'EQUITY', 'RETAINED_EARNINGS', NULL, 1, false, true, false, false, true, 1, 1),

  -- Classe 2 : Immobilisations
  (3, 1, 1, '218000', 'Matériel de bureau', 'ASSET', 'FIXED_ASSET', NULL, 1, false, true, false, false, true, 1, 1),

  -- Classe 3 : Stocks
  (4, 1, 1, '370000', 'Stock de marchandises', 'ASSET', 'INVENTORY', NULL, 1, false, true, false, false, true, 1, 1),

  -- Classe 4 : Tiers
  (5, 1, 1, '401000', 'Fournisseurs', 'LIABILITY', 'ACCOUNTS_PAYABLE', NULL, 1, true, false, false, false, true, 1, 1),
  (6, 1, 1, '401100', 'Fournisseur TECH SUPPLIES', 'LIABILITY', 'ACCOUNTS_PAYABLE', 5, 2, false, true, true, true, true, 1, 1),
  (7, 1, 1, '411000', 'Clients', 'ASSET', 'ACCOUNTS_RECEIVABLE', NULL, 1, true, false, false, false, true, 1, 1),
  (8, 1, 1, '411100', 'Client MEGA CORP', 'ASSET', 'ACCOUNTS_RECEIVABLE', 7, 2, false, true, true, true, true, 1, 1),
  (9, 1, 1, '445660', 'TVA déductible', 'ASSET', 'VAT_RECEIVABLE', NULL, 1, false, true, false, false, true, 1, 1),
  (10, 1, 1, '445710', 'TVA collectée', 'LIABILITY', 'VAT_PAYABLE', NULL, 1, false, true, false, false, true, 1, 1),

  -- Classe 5 : Trésorerie
  (11, 1, 1, '512000', 'Banque BNP', 'ASSET', 'CASH', NULL, 1, false, true, false, false, true, 1, 1),
  (12, 1, 1, '530000', 'Caisse', 'ASSET', 'CASH', NULL, 1, false, true, false, false, true, 1, 1),

  -- Classe 6 : Charges
  (13, 1, 1, '607000', 'Achats de marchandises', 'EXPENSE', 'COST_OF_SALES', NULL, 1, false, true, false, false, true, 1, 1),
  (14, 1, 1, '626000', 'Frais postaux', 'EXPENSE', 'OPERATING_EXPENSE', NULL, 1, false, true, false, false, true, 1, 1),

  -- Classe 7 : Produits
  (15, 1, 1, '707000', 'Ventes de marchandises', 'REVENUE', 'SALES_REVENUE', NULL, 1, false, true, false, false, true, 1, 1);

SELECT setval('account_id_seq', 15);

-- -----------------------------------------------------------------------------
-- 8. JOURNAUX COMPTABLES
-- -----------------------------------------------------------------------------
INSERT INTO journal (id, company_id, code, name, journal_type, default_account_id, is_active, created_by, updated_by)
VALUES
  (1, 1, 'VTE', 'Journal des Ventes', 'SALES', 8, true, 1, 1),
  (2, 1, 'ACH', 'Journal des Achats', 'PURCHASE', 6, true, 1, 1),
  (3, 1, 'BQ', 'Banque BNP', 'BANK', 11, true, 1, 1),
  (4, 1, 'CAISSE', 'Caisse', 'CASH', 12, true, 1, 1),
  (5, 1, 'OD', 'Opérations Diverses', 'GENERAL', NULL, true, 1, 1);

SELECT setval('journal_id_seq', 5);

-- -----------------------------------------------------------------------------
-- 9. CODES TVA
-- -----------------------------------------------------------------------------
INSERT INTO tax_code (id, company_id, code, name, tax_type, rate, direction, tax_account_id,
                      is_active, effective_from, created_by, updated_by)
VALUES
  -- TVA sur ventes
  (1, 1, 'TVA20', 'TVA 20% (taux normal)', 'VAT', 20.00, 'OUTPUT', 10, true, '2024-01-01', 1, 1),
  (2, 1, 'TVA10', 'TVA 10% (taux intermédiaire)', 'VAT', 10.00, 'OUTPUT', 10, true, '2024-01-01', 1, 1),
  (3, 1, 'TVA055', 'TVA 5,5% (taux réduit)', 'VAT', 5.50, 'OUTPUT', 10, true, '2024-01-01', 1, 1),

  -- TVA sur achats
  (4, 1, 'TVAACH20', 'TVA déductible 20%', 'VAT', 20.00, 'INPUT', 9, true, '2024-01-01', 1, 1),
  (5, 1, 'TVAACH10', 'TVA déductible 10%', 'VAT', 10.00, 'INPUT', 9, true, '2024-01-01', 1, 1);

SELECT setval('tax_code_id_seq', 5);

-- -----------------------------------------------------------------------------
-- 10. TIERS (Business Partners)
-- -----------------------------------------------------------------------------
INSERT INTO business_partner (id, company_id, code, name, legal_name, partner_type,
                               is_customer, is_supplier, tax_id, email, phone,
                               customer_account_id, supplier_account_id, currency_id,
                               payment_terms_days, default_tax_code_id,
                               is_active, created_by, updated_by)
VALUES
  -- Client
  (1, 1, 'CLI001', 'MEGA CORP', 'MEGA CORP SAS', 'CUSTOMER',
   true, false, 'FR98765432109', 'contact@megacorp.fr', '+33 1 23 45 67 89',
   8, NULL, 1, 30, 1, true, 1, 1),

  -- Fournisseur
  (2, 1, 'FOU001', 'TECH SUPPLIES', 'TECH SUPPLIES SARL', 'SUPPLIER',
   false, true, 'FR11223344556', 'contact@techsupplies.fr', '+33 1 98 76 54 32',
   NULL, 6, 1, 30, 4, true, 1, 1);

SELECT setval('business_partner_id_seq', 2);

-- Adresses
INSERT INTO business_partner_address (business_partner_id, address_type, name, address_line1, city, postal_code, country_code, is_default)
VALUES
  (1, 'MAIN', 'Siège social MEGA CORP', '456 Boulevard Haussmann', 'Paris', '75009', 'FR', true),
  (2, 'MAIN', 'Siège TECH SUPPLIES', '789 Rue de la République', 'Lyon', '69002', 'FR', true);

-- -----------------------------------------------------------------------------
-- 11. ENTREPÔTS
-- -----------------------------------------------------------------------------
INSERT INTO warehouse (id, company_id, code, name, city, postal_code, country_code, is_active, created_by, updated_by)
VALUES
  (1, 1, 'DEP01', 'Dépôt Principal Paris', 'Paris', '75015', 'FR', true, 1, 1);

SELECT setval('warehouse_id_seq', 1);

-- Emplacements
INSERT INTO stock_location (warehouse_id, code, name)
VALUES
  (1, 'A-01', 'Allée A - Emplacement 01'),
  (1, 'A-02', 'Allée A - Emplacement 02'),
  (1, 'B-01', 'Allée B - Emplacement 01');

-- -----------------------------------------------------------------------------
-- 12. PRODUITS
-- -----------------------------------------------------------------------------
INSERT INTO product (id, company_id, code, name, description, product_type, category,
                     unit_of_measure, is_stockable, is_purchasable, is_sellable,
                     purchase_price, sale_price, standard_cost, currency_id,
                     purchase_account_id, sales_account_id, stock_account_id,
                     purchase_tax_code_id, sales_tax_code_id,
                     barcode, is_active, created_by, updated_by)
VALUES
  (1, 1, 'PROD001', 'Ordinateur Portable Pro', 'PC portable haute performance 15 pouces', 'GOODS', 'Informatique',
   'PCE', true, true, true,
   800.00, 1200.00, 800.00, 1,
   13, 15, 4,
   4, 1,
   '3760123456789', true, 1, 1),

  (2, 1, 'PROD002', 'Clavier mécanique RGB', 'Clavier gamer avec rétro-éclairage', 'GOODS', 'Périphériques',
   'PCE', true, true, true,
   50.00, 89.00, 50.00, 1,
   13, 15, 4,
   4, 1,
   '3760123456790', true, 1, 1);

SELECT setval('product_id_seq', 2);

-- -----------------------------------------------------------------------------
-- 13. SCENARIO : FACTURE CLIENT
-- -----------------------------------------------------------------------------
-- Facture client n° FC-2024-0001 du 15/01/2024
INSERT INTO sales_invoice (id, company_id, fiscal_year_id, invoice_number, invoice_date, due_date,
                            customer_id, currency_id, exchange_rate,
                            status, payment_terms_days, reference,
                            created_by, updated_by)
VALUES
  (1, 1, 1, 'FC-2024-0001', '2024-01-15', '2024-02-14',
   1, 1, 1.0,
   'DRAFT', 30, 'Commande CLI001-2024-001',
   2, 2);

SELECT setval('sales_invoice_id_seq', 1);

-- Lignes de facture (calculs automatiques via trigger)
INSERT INTO sales_invoice_line (sales_invoice_id, line_number, product_id, description,
                                 quantity, unit_price, discount_percent, discount_amount,
                                 tax_code_id, tax_rate, account_id)
VALUES
  (1, 1, 1, 'Ordinateur Portable Pro', 2, 1200.00, 0, 0, 1, 20.00, 15),
  (1, 2, 2, 'Clavier mécanique RGB', 5, 89.00, 10, 44.50, 1, 20.00, 15);

-- Vérification totaux (triggers doivent avoir calculé)
-- Ligne 1: 2 × 1200 = 2400 HT, TVA 480, Total 2880
-- Ligne 2: 5 × 89 - 44.50 = 400.50 HT, TVA 80.10, Total 480.60
-- Total facture: 2800.50 HT, 560.10 TVA, 3360.60 TTC

-- -----------------------------------------------------------------------------
-- 14. VALIDATION ET COMPTABILISATION FACTURE CLIENT
-- -----------------------------------------------------------------------------
-- Passer statut à VALIDATED
UPDATE sales_invoice SET status = 'VALIDATED', validated_at = CURRENT_TIMESTAMP, validated_by = 2 WHERE id = 1;

-- Générer écriture comptable GL
INSERT INTO gl_transaction (id, company_id, fiscal_year_id, journal_id, transaction_number,
                             transaction_date, document_date, description, reference,
                             source_type, source_id, currency_id, exchange_rate, status,
                             created_by, updated_by)
VALUES
  (1, 1, 1, 1, 'VTE-2024-0001',
   '2024-01-15', '2024-01-15', 'Facture client FC-2024-0001', 'FC-2024-0001',
   'INVOICE', 1, 1, 1.0, 'DRAFT',
   2, 2);

SELECT setval('gl_transaction_id_seq', 1);

-- Lignes GL (partie double)
INSERT INTO gl_transaction_line (gl_transaction_id, line_number, account_id, description,
                                  debit_amount, credit_amount, debit_base_amount, credit_base_amount,
                                  third_party_type, third_party_id, tax_code_id, due_date)
VALUES
  -- Débit : Client
  (1, 1, 8, 'Client MEGA CORP - FC-2024-0001', 3360.60, 0, 3360.60, 0, 'CUSTOMER', 1, NULL, '2024-02-14'),
  -- Crédit : Ventes HT
  (1, 2, 15, 'Ventes de marchandises', 0, 2800.50, 0, 2800.50, NULL, NULL, 1, NULL),
  -- Crédit : TVA collectée
  (1, 3, 10, 'TVA collectée 20%', 0, 560.10, 0, 560.10, NULL, NULL, 1, NULL);

-- Vérification équilibre : Débit = 3360.60, Crédit = 3360.60 ✓

-- Comptabiliser (status = POSTED)
UPDATE gl_transaction SET status = 'POSTED', posting_date = '2024-01-15' WHERE id = 1;

-- Lier facture à l'écriture
UPDATE sales_invoice SET gl_transaction_id = 1, status = 'POSTED', posted_at = CURRENT_TIMESTAMP, posted_by = 2 WHERE id = 1;

-- -----------------------------------------------------------------------------
-- 15. SCENARIO : FACTURE FOURNISSEUR
-- -----------------------------------------------------------------------------
INSERT INTO purchase_invoice (id, company_id, fiscal_year_id, invoice_number, supplier_invoice_number,
                               invoice_date, due_date, supplier_id, currency_id, exchange_rate,
                               status, payment_terms_days, reference,
                               created_by, updated_by)
VALUES
  (1, 1, 1, 'FA-2024-0001', 'TECH-INV-5678', '2024-01-10', '2024-02-09',
   2, 1, 1.0,
   'DRAFT', 30, 'Commande achat PO-001',
   2, 2);

SELECT setval('purchase_invoice_id_seq', 1);

-- Lignes facture fournisseur
INSERT INTO purchase_invoice_line (purchase_invoice_id, line_number, product_id, description,
                                    quantity, unit_price, discount_percent, discount_amount,
                                    tax_code_id, tax_rate, account_id)
VALUES
  (1, 1, 1, 'Ordinateur Portable Pro', 3, 800.00, 0, 0, 4, 20.00, 13);

-- Ligne : 3 × 800 = 2400 HT, TVA 480, Total 2880

UPDATE purchase_invoice SET status = 'VALIDATED', validated_at = CURRENT_TIMESTAMP, validated_by = 2 WHERE id = 1;

-- Écriture GL achat
INSERT INTO gl_transaction (id, company_id, fiscal_year_id, journal_id, transaction_number,
                             transaction_date, document_date, description, reference,
                             source_type, source_id, currency_id, exchange_rate, status,
                             created_by, updated_by)
VALUES
  (2, 1, 1, 2, 'ACH-2024-0001',
   '2024-01-10', '2024-01-10', 'Facture fournisseur FA-2024-0001', 'TECH-INV-5678',
   'INVOICE', 1, 1, 1.0, 'DRAFT',
   2, 2);

SELECT setval('gl_transaction_id_seq', 2);

-- Lignes GL
INSERT INTO gl_transaction_line (gl_transaction_id, line_number, account_id, description,
                                  debit_amount, credit_amount, debit_base_amount, credit_base_amount,
                                  third_party_type, third_party_id, tax_code_id, due_date)
VALUES
  -- Débit : Achats
  (2, 1, 13, 'Achats de marchandises', 2400.00, 0, 2400.00, 0, NULL, NULL, 4, NULL),
  -- Débit : TVA déductible
  (2, 2, 9, 'TVA déductible 20%', 480.00, 0, 480.00, 0, NULL, NULL, 4, NULL),
  -- Crédit : Fournisseur
  (2, 3, 6, 'Fournisseur TECH SUPPLIES - FA-2024-0001', 0, 2880.00, 0, 2880.00, 'SUPPLIER', 2, NULL, '2024-02-09');

UPDATE gl_transaction SET status = 'POSTED', posting_date = '2024-01-10' WHERE id = 2;
UPDATE purchase_invoice SET gl_transaction_id = 2, status = 'POSTED', posted_at = CURRENT_TIMESTAMP, posted_by = 2 WHERE id = 1;

-- -----------------------------------------------------------------------------
-- 16. SCENARIO : RÈGLEMENT CLIENT (Encaissement)
-- -----------------------------------------------------------------------------
INSERT INTO payment (id, company_id, fiscal_year_id, payment_number, payment_date, payment_type,
                     business_partner_id, currency_id, exchange_rate, amount,
                     payment_method, bank_account_id, reference, status,
                     created_by, updated_by)
VALUES
  (1, 1, 1, 'RGL-CLI-2024-0001', '2024-02-14', 'RECEIPT',
   1, 1, 1.0, 3360.60,
   'BANK_TRANSFER', 11, 'Virement MEGA CORP', 'DRAFT',
   2, 2);

SELECT setval('payment_id_seq', 1);

-- Écriture GL règlement
INSERT INTO gl_transaction (id, company_id, fiscal_year_id, journal_id, transaction_number,
                             transaction_date, description, reference,
                             source_type, source_id, currency_id, exchange_rate, status,
                             created_by, updated_by)
VALUES
  (3, 1, 1, 3, 'BQ-2024-0001',
   '2024-02-14', 'Encaissement client MEGA CORP', 'RGL-CLI-2024-0001',
   'PAYMENT', 1, 1, 1.0, 'DRAFT',
   2, 2);

SELECT setval('gl_transaction_id_seq', 3);

INSERT INTO gl_transaction_line (gl_transaction_id, line_number, account_id, description,
                                  debit_amount, credit_amount, debit_base_amount, credit_base_amount,
                                  third_party_type, third_party_id)
VALUES
  -- Débit : Banque
  (3, 1, 11, 'Virement MEGA CORP', 3360.60, 0, 3360.60, 0, NULL, NULL),
  -- Crédit : Client
  (3, 2, 8, 'Règlement FC-2024-0001', 0, 3360.60, 0, 3360.60, 'CUSTOMER', 1);

UPDATE gl_transaction SET status = 'POSTED', posting_date = '2024-02-14' WHERE id = 3;
UPDATE payment SET gl_transaction_id = 3, status = 'POSTED', posted_at = CURRENT_TIMESTAMP, posted_by = 2 WHERE id = 1;

-- Affectation paiement à facture
INSERT INTO payment_allocation (payment_id, invoice_type, sales_invoice_id, allocated_amount, allocation_date, created_by)
VALUES
  (1, 'SALES', 1, 3360.60, '2024-02-14', 2);

-- Statut facture devrait passer à PAID automatiquement via trigger

-- -----------------------------------------------------------------------------
-- 17. VÉRIFICATIONS / REQUÊTES DE VALIDATION
-- -----------------------------------------------------------------------------

-- Vérifier équilibre des écritures GL
SELECT
  id,
  transaction_number,
  total_debit,
  total_credit,
  balance_check,
  CASE
    WHEN ABS(balance_check) < 0.01 THEN '✓ ÉQUILIBRÉE'
    ELSE '✗ DÉSÉQUILIBRÉE'
  END AS status
FROM gl_transaction
ORDER BY id;

-- Balance comptable (totaux par compte)
SELECT
  a.account_number,
  a.name AS account_name,
  SUM(l.debit_base_amount) AS total_debit,
  SUM(l.credit_base_amount) AS total_credit,
  SUM(l.debit_base_amount) - SUM(l.credit_base_amount) AS balance
FROM gl_transaction_line l
JOIN account a ON a.id = l.account_id
JOIN gl_transaction t ON t.id = l.gl_transaction_id
WHERE t.status = 'POSTED'
GROUP BY a.account_number, a.name
ORDER BY a.account_number;

-- Factures clients en attente de règlement
SELECT
  si.invoice_number,
  bp.name AS customer,
  si.invoice_date,
  si.due_date,
  si.total_amount,
  si.paid_amount,
  si.balance_due,
  si.status,
  CASE
    WHEN si.balance_due = 0 THEN '✓ Soldée'
    WHEN si.due_date < CURRENT_DATE THEN '⚠ En retard'
    ELSE '◷ En cours'
  END AS payment_status
FROM sales_invoice si
JOIN business_partner bp ON bp.id = si.customer_id
ORDER BY si.invoice_date DESC;

-- Grand livre du compte client
SELECT
  t.transaction_date,
  t.transaction_number,
  l.description,
  l.debit_base_amount,
  l.credit_base_amount,
  l.debit_base_amount - l.credit_base_amount AS movement
FROM gl_transaction_line l
JOIN gl_transaction t ON t.id = l.gl_transaction_id
WHERE l.account_id = 8  -- Compte client MEGA CORP
  AND t.status = 'POSTED'
ORDER BY t.transaction_date, t.id, l.line_number;

-- =============================================================================
-- FIN DES DONNÉES DE TEST
-- =============================================================================

COMMENT ON TABLE company IS 'Données de test chargées avec succès - Société ACME France créée';
