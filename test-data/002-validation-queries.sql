-- =============================================================================
-- REQUÊTES DE VALIDATION - ERP Sage X3 MVP
-- =============================================================================
-- Requêtes pour valider l'intégrité et la cohérence du modèle de données
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. VALIDATION ÉQUILIBRE COMPTABLE
-- -----------------------------------------------------------------------------
-- Vérifier que toutes les écritures GL sont équilibrées (débit = crédit)
SELECT
  'GL Balance Check' AS validation_name,
  COUNT(*) AS total_transactions,
  COUNT(*) FILTER (WHERE ABS(balance_check) < 0.01) AS balanced,
  COUNT(*) FILTER (WHERE ABS(balance_check) >= 0.01) AS unbalanced,
  CASE
    WHEN COUNT(*) FILTER (WHERE ABS(balance_check) >= 0.01) = 0 THEN '✓ PASS'
    ELSE '✗ FAIL'
  END AS result
FROM gl_transaction
WHERE status IN ('POSTED', 'VALIDATED');

-- Détail des écritures déséquilibrées (si existe)
SELECT
  id,
  transaction_number,
  transaction_date,
  total_debit,
  total_credit,
  balance_check,
  status
FROM gl_transaction
WHERE ABS(balance_check) >= 0.01
  AND status IN ('POSTED', 'VALIDATED');

-- -----------------------------------------------------------------------------
-- 2. VALIDATION TOTAUX FACTURES
-- -----------------------------------------------------------------------------
-- Vérifier cohérence entre lignes et en-têtes de factures clients
SELECT
  'Sales Invoice Totals Check' AS validation_name,
  si.invoice_number,
  si.subtotal AS header_subtotal,
  SUM(sil.line_amount) AS lines_subtotal,
  si.tax_amount AS header_tax,
  SUM(sil.tax_amount) AS lines_tax,
  si.total_amount AS header_total,
  SUM(sil.line_total) AS lines_total,
  CASE
    WHEN ABS(si.total_amount - SUM(sil.line_total)) < 0.01 THEN '✓ PASS'
    ELSE '✗ FAIL'
  END AS result
FROM sales_invoice si
LEFT JOIN sales_invoice_line sil ON sil.sales_invoice_id = si.id
GROUP BY si.id, si.invoice_number, si.subtotal, si.tax_amount, si.total_amount;

-- Même vérification pour factures fournisseurs
SELECT
  'Purchase Invoice Totals Check' AS validation_name,
  pi.invoice_number,
  pi.subtotal AS header_subtotal,
  SUM(pil.line_amount) AS lines_subtotal,
  pi.tax_amount AS header_tax,
  SUM(pil.tax_amount) AS lines_tax,
  pi.total_amount AS header_total,
  SUM(pil.line_total) AS lines_total,
  CASE
    WHEN ABS(pi.total_amount - SUM(pil.line_total)) < 0.01 THEN '✓ PASS'
    ELSE '✗ FAIL'
  END AS result
FROM purchase_invoice pi
LEFT JOIN purchase_invoice_line pil ON pil.purchase_invoice_id = pi.id
GROUP BY pi.id, pi.invoice_number, pi.subtotal, pi.tax_amount, pi.total_amount;

-- -----------------------------------------------------------------------------
-- 3. VALIDATION PAIEMENTS
-- -----------------------------------------------------------------------------
-- Vérifier cohérence affectation paiements
SELECT
  'Payment Allocation Check' AS validation_name,
  p.payment_number,
  p.amount AS payment_amount,
  p.allocated_amount AS header_allocated,
  COALESCE(SUM(pa.allocated_amount), 0) AS lines_allocated,
  p.unallocated_amount,
  CASE
    WHEN ABS(p.allocated_amount - COALESCE(SUM(pa.allocated_amount), 0)) < 0.01 THEN '✓ PASS'
    ELSE '✗ FAIL'
  END AS result
FROM payment p
LEFT JOIN payment_allocation pa ON pa.payment_id = p.id
GROUP BY p.id, p.payment_number, p.amount, p.allocated_amount, p.unallocated_amount;

-- Vérifier montants payés sur factures
SELECT
  'Invoice Paid Amount Check' AS validation_name,
  si.invoice_number,
  si.paid_amount AS header_paid,
  COALESCE(SUM(pa.allocated_amount), 0) AS allocations_sum,
  si.balance_due,
  si.total_amount - si.paid_amount AS calculated_balance,
  CASE
    WHEN ABS(si.paid_amount - COALESCE(SUM(pa.allocated_amount), 0)) < 0.01
      AND ABS(si.balance_due - (si.total_amount - si.paid_amount)) < 0.01 THEN '✓ PASS'
    ELSE '✗ FAIL'
  END AS result
FROM sales_invoice si
LEFT JOIN payment_allocation pa ON pa.sales_invoice_id = si.id
GROUP BY si.id, si.invoice_number, si.paid_amount, si.balance_due, si.total_amount;

-- -----------------------------------------------------------------------------
-- 4. VALIDATION INTÉGRITÉ RÉFÉRENTIELLE
-- -----------------------------------------------------------------------------
-- Vérifier que toutes les factures validées ont une écriture GL
SELECT
  'Invoice GL Link Check' AS validation_name,
  COUNT(*) AS total_validated_invoices,
  COUNT(gl_transaction_id) AS with_gl_transaction,
  COUNT(*) - COUNT(gl_transaction_id) AS missing_gl,
  CASE
    WHEN COUNT(*) = COUNT(gl_transaction_id) THEN '✓ PASS'
    ELSE '✗ FAIL'
  END AS result
FROM (
  SELECT id, gl_transaction_id FROM sales_invoice WHERE status IN ('POSTED', 'VALIDATED', 'PAID')
  UNION ALL
  SELECT id, gl_transaction_id FROM purchase_invoice WHERE status IN ('POSTED', 'VALIDATED', 'PAID')
) AS invoices;

-- -----------------------------------------------------------------------------
-- 5. BALANCE COMPTABLE GÉNÉRALE
-- -----------------------------------------------------------------------------
-- Grand livre par compte
SELECT
  a.account_number,
  a.name,
  a.account_type,
  SUM(l.debit_base_amount) AS total_debit,
  SUM(l.credit_base_amount) AS total_credit,
  SUM(l.debit_base_amount) - SUM(l.credit_base_amount) AS balance,
  CASE
    WHEN a.account_type IN ('ASSET', 'EXPENSE') THEN
      CASE WHEN SUM(l.debit_base_amount) >= SUM(l.credit_base_amount) THEN 'Débiteur' ELSE 'Créditeur' END
    WHEN a.account_type IN ('LIABILITY', 'EQUITY', 'REVENUE') THEN
      CASE WHEN SUM(l.credit_base_amount) >= SUM(l.debit_base_amount) THEN 'Créditeur' ELSE 'Débiteur' END
  END AS expected_balance_type
FROM account a
LEFT JOIN gl_transaction_line l ON l.account_id = a.id
LEFT JOIN gl_transaction t ON t.id = l.gl_transaction_id AND t.status = 'POSTED'
WHERE a.company_id = 1
GROUP BY a.id, a.account_number, a.name, a.account_type
HAVING SUM(l.debit_base_amount) > 0 OR SUM(l.credit_base_amount) > 0
ORDER BY a.account_number;

-- Vérification équilibre global (somme de tous les débits = somme de tous les crédits)
SELECT
  'Global Balance Check' AS validation_name,
  SUM(l.debit_base_amount) AS total_debit,
  SUM(l.credit_base_amount) AS total_credit,
  SUM(l.debit_base_amount) - SUM(l.credit_base_amount) AS difference,
  CASE
    WHEN ABS(SUM(l.debit_base_amount) - SUM(l.credit_base_amount)) < 0.01 THEN '✓ PASS'
    ELSE '✗ FAIL'
  END AS result
FROM gl_transaction_line l
JOIN gl_transaction t ON t.id = l.gl_transaction_id
WHERE t.status = 'POSTED';

-- -----------------------------------------------------------------------------
-- 6. BALANCE PAR TYPE DE COMPTE
-- -----------------------------------------------------------------------------
-- Agrégation par type (ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE)
SELECT
  a.account_type,
  SUM(l.debit_base_amount) AS total_debit,
  SUM(l.credit_base_amount) AS total_credit,
  SUM(l.debit_base_amount) - SUM(l.credit_base_amount) AS net_balance
FROM account a
LEFT JOIN gl_transaction_line l ON l.account_id = a.id
LEFT JOIN gl_transaction t ON t.id = l.gl_transaction_id AND t.status = 'POSTED'
GROUP BY a.account_type
ORDER BY a.account_type;

-- Validation équation comptable : ASSETS = LIABILITIES + EQUITY + (REVENUE - EXPENSE)
WITH balances AS (
  SELECT
    a.account_type,
    SUM(l.debit_base_amount) - SUM(l.credit_base_amount) AS balance
  FROM account a
  LEFT JOIN gl_transaction_line l ON l.account_id = a.id
  LEFT JOIN gl_transaction t ON t.id = l.gl_transaction_id AND t.status = 'POSTED'
  GROUP BY a.account_type
)
SELECT
  'Accounting Equation Check' AS validation_name,
  (SELECT balance FROM balances WHERE account_type = 'ASSET') AS assets,
  (SELECT balance FROM balances WHERE account_type = 'LIABILITY') AS liabilities,
  (SELECT balance FROM balances WHERE account_type = 'EQUITY') AS equity,
  (SELECT balance FROM balances WHERE account_type = 'REVENUE') AS revenue,
  (SELECT balance FROM balances WHERE account_type = 'EXPENSE') AS expenses,
  (SELECT balance FROM balances WHERE account_type = 'ASSET') -
  ((SELECT balance FROM balances WHERE account_type = 'LIABILITY') +
   (SELECT balance FROM balances WHERE account_type = 'EQUITY') +
   ((SELECT balance FROM balances WHERE account_type = 'REVENUE') -
    (SELECT balance FROM balances WHERE account_type = 'EXPENSE'))) AS difference,
  CASE
    WHEN ABS(
      (SELECT balance FROM balances WHERE account_type = 'ASSET') -
      ((SELECT balance FROM balances WHERE account_type = 'LIABILITY') +
       (SELECT balance FROM balances WHERE account_type = 'EQUITY') +
       ((SELECT balance FROM balances WHERE account_type = 'REVENUE') -
        (SELECT balance FROM balances WHERE account_type = 'EXPENSE')))
    ) < 0.01 THEN '✓ PASS'
    ELSE '✗ FAIL'
  END AS result;

-- -----------------------------------------------------------------------------
-- 7. STATISTIQUES GÉNÉRALES
-- -----------------------------------------------------------------------------
SELECT 'Database Statistics' AS report_name;

SELECT 'Companies' AS entity, COUNT(*) AS count FROM company
UNION ALL SELECT 'Fiscal Years', COUNT(*) FROM fiscal_year
UNION ALL SELECT 'Accounts', COUNT(*) FROM account
UNION ALL SELECT 'Business Partners', COUNT(*) FROM business_partner
UNION ALL SELECT 'Products', COUNT(*) FROM product
UNION ALL SELECT 'GL Transactions', COUNT(*) FROM gl_transaction
UNION ALL SELECT 'GL Lines', COUNT(*) FROM gl_transaction_line
UNION ALL SELECT 'Sales Invoices', COUNT(*) FROM sales_invoice
UNION ALL SELECT 'Purchase Invoices', COUNT(*) FROM purchase_invoice
UNION ALL SELECT 'Payments', COUNT(*) FROM payment
UNION ALL SELECT 'Stock Movements', COUNT(*) FROM stock_movement;

-- -----------------------------------------------------------------------------
-- 8. RAPPORTS MÉTIER
-- -----------------------------------------------------------------------------

-- Chiffre d'affaires par période
SELECT
  DATE_TRUNC('month', si.invoice_date) AS period,
  COUNT(*) AS invoice_count,
  SUM(si.subtotal) AS revenue_ht,
  SUM(si.tax_amount) AS vat,
  SUM(si.total_amount) AS revenue_ttc
FROM sales_invoice si
WHERE si.status IN ('POSTED', 'VALIDATED', 'PAID')
GROUP BY DATE_TRUNC('month', si.invoice_date)
ORDER BY period;

-- Achats par période
SELECT
  DATE_TRUNC('month', pi.invoice_date) AS period,
  COUNT(*) AS invoice_count,
  SUM(pi.subtotal) AS purchases_ht,
  SUM(pi.tax_amount) AS vat,
  SUM(pi.total_amount) AS purchases_ttc
FROM purchase_invoice pi
WHERE pi.status IN ('POSTED', 'VALIDATED', 'PAID')
GROUP BY DATE_TRUNC('month', pi.invoice_date)
ORDER BY period;

-- Situation TVA
SELECT
  'TVA Balance' AS report_name,
  (SELECT COALESCE(SUM(credit_base_amount), 0) FROM gl_transaction_line l
   JOIN gl_transaction t ON t.id = l.gl_transaction_id
   WHERE l.account_id = 10 AND t.status = 'POSTED') AS tva_collectee,
  (SELECT COALESCE(SUM(debit_base_amount), 0) FROM gl_transaction_line l
   JOIN gl_transaction t ON t.id = l.gl_transaction_id
   WHERE l.account_id = 9 AND t.status = 'POSTED') AS tva_deductible,
  (SELECT COALESCE(SUM(credit_base_amount), 0) FROM gl_transaction_line l
   JOIN gl_transaction t ON t.id = l.gl_transaction_id
   WHERE l.account_id = 10 AND t.status = 'POSTED') -
  (SELECT COALESCE(SUM(debit_base_amount), 0) FROM gl_transaction_line l
   JOIN gl_transaction t ON t.id = l.gl_transaction_id
   WHERE l.account_id = 9 AND t.status = 'POSTED') AS tva_a_payer;

-- Créances clients
SELECT
  bp.code,
  bp.name,
  SUM(si.balance_due) AS total_due,
  MIN(si.due_date) AS oldest_due_date,
  COUNT(*) AS invoice_count
FROM sales_invoice si
JOIN business_partner bp ON bp.id = si.customer_id
WHERE si.status IN ('POSTED', 'VALIDATED') AND si.balance_due > 0
GROUP BY bp.id, bp.code, bp.name
ORDER BY total_due DESC;

-- Dettes fournisseurs
SELECT
  bp.code,
  bp.name,
  SUM(pi.balance_due) AS total_due,
  MIN(pi.due_date) AS oldest_due_date,
  COUNT(*) AS invoice_count
FROM purchase_invoice pi
JOIN business_partner bp ON bp.id = pi.supplier_id
WHERE pi.status IN ('POSTED', 'VALIDATED') AND pi.balance_due > 0
GROUP BY bp.id, bp.code, bp.name
ORDER BY total_due DESC;

-- =============================================================================
-- FIN DES REQUÊTES DE VALIDATION
-- =============================================================================
