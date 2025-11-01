# 🚀 Quick Start - ERP Sage X3 MVP API

Démarrage rapide pour utiliser l'API ERP Sage X3 MVP avec Insomnia, Postman ou Swagger.

## ⚡ Démarrage Express (5 minutes)

### 1. Démarrer le serveur

```bash
cd backend
npm install
npm run start:dev
```

L'API sera disponible sur: **http://localhost:3000/api**

### 2. Choisir votre outil de test

#### 🟣 Option A: Insomnia (Recommandé)

**Pourquoi Insomnia?**
- Interface moderne et rapide
- Support natif GraphQL (pour plus tard)
- Auto-sync avec Swagger
- Variables d'environnement puissantes

**Installation:**
1. Télécharger Insomnia: https://insomnia.rest/download
2. Ouvrir Insomnia
3. Create > Import > From File
4. Sélectionner: `insomnia-workspace.json`
5. ✅ Prêt à tester!

**Guide complet**: Voir `INSOMNIA-GUIDE.md`

#### 🟠 Option B: Postman

**Installation:**
1. Télécharger Postman: https://www.postman.com/downloads/
2. Ouvrir Postman
3. Import > Upload Files
4. Sélectionner: `postman-collection.json`
5. ✅ Prêt à tester!

#### 🔵 Option C: Swagger UI (Navigateur)

**Le plus simple - Aucune installation!**

1. Démarrer le serveur: `npm run start:dev`
2. Ouvrir: http://localhost:3000/api/docs
3. ✅ Interface interactive prête!

**Avantages:**
- Aucune installation requise
- Documentation auto-générée
- Toujours à jour avec le code

## 📁 Fichiers Disponibles

| Fichier | Description | Pour qui? |
|---------|-------------|-----------|
| `insomnia-workspace.json` | Collection Insomnia complète | Utilisateurs Insomnia |
| `postman-collection.json` | Collection Postman complète | Utilisateurs Postman |
| `swagger.yaml` | Spécification OpenAPI 3.0 | Swagger Editor/UI |
| `API-DOCUMENTATION.md` | Documentation complète | Tous (lecture) |
| `INSOMNIA-GUIDE.md` | Guide Insomnia détaillé | Utilisateurs Insomnia |

## 🎯 Premier Test Rapide

### Avec Insomnia/Postman

1. Importer la collection (voir ci-dessus)
2. Sélectionner la requête: **"1. Company > Create Company"**
3. Cliquer sur **Send**
4. ✅ Vous devriez recevoir une réponse avec status 201!

### Avec Swagger UI

1. Aller sur: http://localhost:3000/api/docs
2. Trouver la section **"company"**
3. Cliquer sur **POST /company**
4. Cliquer sur **"Try it out"**
5. Modifier le JSON si nécessaire
6. Cliquer sur **"Execute"**
7. ✅ Voir la réponse ci-dessous!

### Avec curl (Terminal)

```bash
curl -X POST http://localhost:3000/api/company \
  -H "Content-Type: application/json" \
  -d '{
    "code": "FR01",
    "name": "ACME France",
    "countryCode": "FR"
  }'
```

## 🔄 Scénario Complet (Test E2E)

### Avec Insomnia

Exécutez ces requêtes dans l'ordre:

1. **Create Company** → Récupérez l'ID
2. Mettez à jour la variable `companyId` avec l'ID reçu
3. **Create Currency** → Récupérez l'ID
4. Mettez à jour la variable `currencyId`
5. **Create Fiscal Year**
6. **Create Business Partner**
7. **Create Invoice**
8. **Record Payment on Invoice**
9. **Get Overdue Invoices** → Devrait être vide maintenant!

### Avec Swagger UI

Même scénario, mais en utilisant l'interface Swagger:
- Copier/coller les IDs entre les requêtes
- Swagger garde l'historique de vos requêtes

## 📊 Variables d'Environnement

### Dans Insomnia/Postman

Les variables sont pré-configurées:

```json
{
  "baseUrl": "http://localhost:3000/api",
  "companyId": "1",
  "currencyId": "1",
  "fiscalYearId": "1",
  "invoiceId": "1"
}
```

**Modifier les variables:**
- **Insomnia**: Icône environnement (en haut à gauche)
- **Postman**: Icône œil > Variables

## 🆘 Dépannage Rapide

### Erreur: "Cannot connect to server"

**Problème**: Le serveur n'est pas démarré

**Solution**:
```bash
cd backend
npm run start:dev
```

Attendez de voir: `Nest application successfully started`

### Erreur 404: "Cannot POST /api/company"

**Problème**: Mauvaise URL ou serveur non démarré

**Vérifications**:
1. Serveur démarré? → `npm run start:dev`
2. URL correcte? → `http://localhost:3000/api`
3. Port correct? → Vérifier le `.env` (PORT=3000)

### Erreur 400: "Validation failed"

**Problème**: Données invalides dans la requête

**Solution**:
- Vérifier le format JSON
- Vérifier les champs requis
- Consulter `API-DOCUMENTATION.md` pour les exemples

### Variables non remplacées dans Insomnia

**Problème**: `{{ _.companyId }}` apparaît tel quel

**Solution**:
1. Vérifier qu'un environnement est sélectionné (en haut à gauche)
2. Vérifier que la variable existe dans l'environnement
3. Syntaxe correcte: `{{ _.variableName }}`

## 📚 Documentation Complète

Pour aller plus loin:

- **API-DOCUMENTATION.md** - Guide complet de l'API
- **INSOMNIA-GUIDE.md** - Guide détaillé Insomnia
- **README.md** - Documentation technique du backend
- **Swagger UI Live**: http://localhost:3000/api/docs

## 🎓 Modules Disponibles

L'API propose 11 modules complets:

1. **Company** - Gestion multi-société
2. **Currency** - Devises (EUR, USD, etc.)
3. **Fiscal Year** - Exercices fiscaux
4. **Account** - Plan comptable
5. **Journal** - Journaux comptables
6. **Tax Code** - Codes de taxe/TVA
7. **Business Partner** - Clients/Fournisseurs
8. **Product** - Catalogue produits
9. **Warehouse** - Entrepôts
10. **Invoice** - Factures (vente/achat)
11. **Payment** - Paiements

## ✨ Fonctionnalités Clés

- ✅ Multi-société (isolation des données)
- ✅ Multi-devise avec taux de change
- ✅ Gestion des exercices fiscaux
- ✅ Factures avec suivi des paiements
- ✅ Factures en retard (overdue)
- ✅ Soft delete (suppression logique)
- ✅ Validation des données
- ✅ Documentation Swagger interactive

## 🔗 Liens Utiles

- **Documentation Insomnia**: https://docs.insomnia.rest/
- **Documentation Postman**: https://learning.postman.com/
- **Swagger Editor**: https://editor.swagger.io/
- **OpenAPI Specification**: https://swagger.io/specification/

## 💡 Pro Tips

### Insomnia

- `Cmd/Ctrl + Enter` → Envoyer la requête
- `Cmd/Ctrl + K` → Recherche rapide
- `Cmd/Ctrl + E` → Changer d'environnement

### Postman

- Créer des "Collections" pour organiser vos requêtes
- Utiliser "Pre-request Scripts" pour automatiser
- Activer "Auto-follow redirects"

### Swagger UI

- Cliquer sur "Models" pour voir les schémas complets
- Utiliser "Authorize" quand l'auth sera ajoutée
- Télécharger le spec: http://localhost:3000/api/docs-json

---

**Besoin d'aide?** Consultez les fichiers de documentation ou ouvrez une issue sur GitHub!

**Version**: 1.0.0
**Dernière mise à jour**: 2025-11-01
