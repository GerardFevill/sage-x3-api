#!/bin/bash
# =============================================================================
# Script de déploiement - ERP Sage X3 MVP
# =============================================================================
# Ce script déploie le modèle de données complet sur PostgreSQL
# Usage: ./deploy.sh [database_name] [host] [port] [user]
# =============================================================================

set -e  # Exit on error

# Configuration par défaut
DB_NAME="${1:-erp_sage_x3_mvp}"
DB_HOST="${2:-localhost}"
DB_PORT="${3:-5432}"
DB_USER="${4:-postgres}"

echo "==============================================="
echo "  ERP Sage X3 MVP - Database Deployment"
echo "==============================================="
echo ""
echo "Configuration:"
echo "  Database: $DB_NAME"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  User: $DB_USER"
echo ""

# Vérifier si PostgreSQL est accessible
echo "🔍 Checking PostgreSQL connection..."
if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c '\q' 2>/dev/null; then
  echo "❌ ERROR: Cannot connect to PostgreSQL"
  echo "   Please check your connection parameters"
  exit 1
fi
echo "✅ PostgreSQL connection OK"
echo ""

# Vérifier si la base existe
echo "🔍 Checking if database exists..."
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
  echo "⚠️  Database '$DB_NAME' already exists"
  read -p "   Do you want to DROP and recreate it? (yes/no): " -r
  echo
  if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "🗑️  Dropping existing database..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "DROP DATABASE IF EXISTS $DB_NAME;"
  else
    echo "❌ Deployment cancelled"
    exit 1
  fi
fi

# Créer la base de données
echo "📦 Creating database '$DB_NAME'..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "CREATE DATABASE $DB_NAME;"
echo "✅ Database created"
echo ""

# Option 1: Déploiement avec Liquibase (si disponible)
if command -v liquibase &> /dev/null; then
  echo "🚀 Deploying schema with Liquibase..."
  cd liquibase

  liquibase \
    --changelog-file=changelog-master.yaml \
    --url="jdbc:postgresql://$DB_HOST:$DB_PORT/$DB_NAME" \
    --username="$DB_USER" \
    --log-level=info \
    update

  cd ..
  echo "✅ Schema deployed via Liquibase"
else
  # Option 2: Déploiement SQL direct
  echo "⚠️  Liquibase not found, generating SQL..."

  echo "📝 Generating SQL from Liquibase changelogs..."

  # Générer SQL complet
  mkdir -p sql

  echo "-- =============================================================================" > sql/full-schema.sql
  echo "-- ERP Sage X3 MVP - Full Schema (Generated)" >> sql/full-schema.sql
  echo "-- =============================================================================" >> sql/full-schema.sql
  echo "" >> sql/full-schema.sql

  # Note: Pour production, utiliser Liquibase updateSQL
  # Ici on concat les fichiers pour simplification
  echo "⚠️  WARNING: Manual SQL generation - use Liquibase for production!"
  echo ""
  echo "❌ ERROR: Liquibase is required for proper deployment"
  echo "   Install Liquibase: https://www.liquibase.org/download"
  exit 1
fi

echo ""
echo "==============================================="

# Charger les données de test
read -p "📊 Load test data? (yes/no): " -r
echo
if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
  echo "📥 Loading test data..."
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f test-data/001-test-data.sql > /dev/null
  echo "✅ Test data loaded"
  echo ""

  # Exécuter les validations
  echo "🔍 Running validation queries..."
  echo ""
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f test-data/002-validation-queries.sql | grep -E "(PASS|FAIL|validation_name)"
  echo ""
fi

echo "==============================================="
echo "✅ Deployment completed successfully!"
echo ""
echo "📊 Database Statistics:"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
SELECT
  schemaname,
  COUNT(*) as table_count
FROM pg_tables
WHERE schemaname = 'public'
GROUP BY schemaname;
"

echo ""
echo "🔗 Connection string:"
echo "   postgresql://$DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
echo ""
echo "📚 Next steps:"
echo "   1. Connect: psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
echo "   2. Explore: \\dt to list tables"
echo "   3. Test: Run queries from test-data/002-validation-queries.sql"
echo ""
echo "==============================================="
