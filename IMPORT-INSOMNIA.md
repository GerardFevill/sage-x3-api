# 🟣 Importer dans Insomnia - Guide Rapide

Guide ultra-rapide pour importer l'API ERP Sage X3 MVP dans Insomnia 11.6.2.

## 📍 Votre Installation

**Chemin Insomnia**: `C:\Users\Relia\AppData\Local\insomnia\app-11.6.2`

## 🚀 Méthode 1: Import Direct (2 minutes)

### Étape 1: Ouvrir Insomnia

Double-cliquer sur l'icône Insomnia sur votre bureau ou dans le menu Démarrer.

### Étape 2: Créer/Importer

1. Dans Insomnia, cliquer sur le bouton **"Create"** (ou **"+"**) en haut à gauche
2. Sélectionner **"Import"**
3. Choisir l'onglet **"From File"**

### Étape 3: Sélectionner le fichier

1. Naviguer vers votre dossier projet:
   ```
   Votre dossier projet > api > erp-sage-x3-mvp > backend
   ```

2. Sélectionner le fichier: **`insomnia-workspace.json`**

3. Cliquer sur **"Open"** ou **"Ouvrir"**

### Étape 4: Confirmer l'import

1. Insomnia affichera un aperçu de ce qui sera importé
2. Cliquer sur **"Import"** pour confirmer

### ✅ Terminé!

Vous devriez maintenant voir:
- Une workspace nommée **"ERP Sage X3 MVP API"**
- 11 dossiers (Company, Currency, Fiscal Year, etc.)
- Des requêtes prêtes à l'emploi dans chaque dossier

## 🎯 Démarrer les Tests

### 1. Démarrer le serveur

Ouvrir un terminal dans le dossier `backend`:

```bash
npm run start:dev
```

Attendre de voir: `✓ Nest application successfully started`

### 2. Tester votre première requête

Dans Insomnia:

1. Ouvrir le dossier **"1. Company"**
2. Cliquer sur **"Create Company"**
3. Vérifier que l'URL est: `http://localhost:3000/api/company`
4. Cliquer sur le bouton **"Send"** (ou `Ctrl+Enter`)
5. ✅ Vous devriez voir une réponse avec status `201 Created`!

## 🔧 Configurer les Variables d'Environnement

### Voir les variables

1. Cliquer sur l'icône **d'environnement** (en haut à gauche, ressemble à un œil ou des lunettes)
2. Vous verrez **"Base Environment"** sélectionné
3. Les variables par défaut:
   ```json
   {
     "baseUrl": "http://localhost:3000/api",
     "companyId": "1",
     "currencyId": "1",
     "fiscalYearId": "1",
     "invoiceId": "1"
   }
   ```

### Modifier une variable

1. Cliquer sur **"Base Environment"**
2. Modifier la valeur (par exemple, changer `companyId` de `1` à `2`)
3. Cliquer à l'extérieur ou appuyer sur `Ctrl+S` pour sauvegarder

## 📊 Méthode 2: Import depuis Swagger (Alternative)

Si vous préférez importer directement depuis le Swagger:

### Avec le serveur démarré

1. Démarrer le serveur: `npm run start:dev`
2. Dans Insomnia: **Create** > **Import**
3. Onglet **"URL"**
4. Entrer: `http://localhost:3000/api/docs-json`
5. Cliquer sur **"Fetch and Import"**

### Avantages

- Toujours synchronisé avec la dernière version du code
- Crée automatiquement toutes les requêtes
- Pas besoin de fichier JSON

### Depuis le fichier Swagger

1. **Create** > **Import**
2. Onglet **"From File"**
3. Sélectionner: `swagger.yaml`
4. Import automatique de tous les endpoints

## 🎨 Organisation dans Insomnia

Après l'import, voici ce que vous verrez:

```
ERP Sage X3 MVP API/
│
├── 📁 1. Company
│   ├── Create Company
│   ├── Get All Companies
│   ├── Get Company by ID
│   └── ...
│
├── 📁 2. Currency
│   ├── Create Currency
│   └── ...
│
├── 📁 3. Fiscal Year
├── 📁 4. Account
├── 📁 5. Journal
├── 📁 6. Tax Code
├── 📁 7. Business Partner
├── 📁 8. Product
├── 📁 9. Warehouse
│
├── 📁 10. Invoice
│   ├── Create Invoice
│   ├── Get Invoices by Company
│   ├── Get Overdue Invoices
│   ├── Record Payment on Invoice
│   └── ...
│
└── 📁 11. Payment
    ├── Create Payment
    ├── Get Total Payments
    └── ...
```

## ✨ Utilisation des Variables

Les requêtes utilisent automatiquement les variables d'environnement:

**Exemple dans Create Invoice**:
```json
{
  "companyId": {{ _.companyId }},
  "currencyId": {{ _.currencyId }},
  "fiscalYearId": {{ _.fiscalYearId }},
  "businessPartnerId": {{ _.businessPartnerId }},
  ...
}
```

Insomnia remplacera automatiquement:
- `{{ _.companyId }}` par `1`
- `{{ _.currencyId }}` par `1`
- etc.

## 🔄 Workflow Recommandé

### Scénario: Créer une facture complète

1. **Create Company** → Copier l'`id` de la réponse
2. Mettre à jour `companyId` dans l'environnement
3. **Create Currency** → Copier l'`id`
4. Mettre à jour `currencyId`
5. **Create Fiscal Year** → Copier l'`id`
6. Mettre à jour `fiscalYearId`
7. **Create Business Partner** → Copier l'`id`
8. Mettre à jour `businessPartnerId`
9. **Create Invoice** → Toutes les variables seront remplacées!
10. **Record Payment** → Automatique avec l'`invoiceId`

## 🎯 Raccourcis Clavier Insomnia

| Raccourci | Action |
|-----------|--------|
| `Ctrl+Enter` | Envoyer la requête |
| `Ctrl+N` | Nouvelle requête |
| `Ctrl+K` | Recherche rapide |
| `Ctrl+E` | Changer d'environnement |
| `Ctrl+L` | Ouvrir la timeline |

## 🆘 Dépannage

### "Connection refused" ou "Cannot connect"

**Problème**: Le serveur n'est pas démarré

**Solution**:
```bash
cd backend
npm run start:dev
```

Attendez de voir le message de succès avant de tester dans Insomnia.

### Variables ne se remplacent pas

**Symptôme**: Vous voyez `{{ _.companyId }}` dans la requête envoyée

**Solutions**:
1. Vérifier qu'un environnement est sélectionné (icône en haut à gauche)
2. Vérifier l'orthographe de la variable
3. Syntaxe: `{{ _.nomVariable }}` (avec underscore et point)

### Erreur 400: Validation failed

**Problème**: Données invalides

**Solutions**:
1. Vérifier le format JSON (pas de virgule en trop)
2. Vérifier les champs requis
3. Consulter l'onglet **"Docs"** dans Insomnia pour voir les exemples

## 📖 Documentation Supplémentaire

- **QUICK-START.md** - Démarrage rapide général
- **INSOMNIA-GUIDE.md** - Guide détaillé Insomnia
- **API-DOCUMENTATION.md** - Documentation complète de l'API
- **Swagger UI**: http://localhost:3000/api/docs (avec serveur démarré)

## 💡 Astuces Pro

### Créer des environnements multiples

Pour tester dev/staging/prod:

1. Cliquer sur l'icône d'environnement
2. Cliquer sur **"+"** à côté de "Base Environment"
3. Nommer "Production"
4. Modifier `baseUrl` vers votre serveur de production

### Auto-sync avec Swagger

Pour synchroniser automatiquement:

1. Create > Import > URL
2. Entrer: `http://localhost:3000/api/docs-json`
3. Cocher **"Enable Automatic Sync"**
4. Intervalle: 30 secondes

Insomnia mettra à jour les endpoints automatiquement!

### Dupliquer une requête

1. Clic droit sur une requête
2. **"Duplicate"**
3. Modifier selon vos besoins

---

## 🎉 Vous êtes prêt!

Vous avez maintenant:
- ✅ Collection importée dans Insomnia
- ✅ Variables d'environnement configurées
- ✅ 60+ requêtes prêtes à l'emploi
- ✅ Exemples pour tous les modules

**Bon testing!** 🚀

---

**Besoin d'aide?** Consultez les autres guides ou ouvrez une issue sur GitHub.
