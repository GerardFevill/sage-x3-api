# Guide Insomnia - ERP Sage X3 MVP API

Guide complet pour utiliser Insomnia avec l'API ERP Sage X3 MVP.

## 🚀 Méthode 1: Importer le fichier Insomnia (Recommandé)

### Étape 1: Importer la collection

1. Ouvrir Insomnia
2. Cliquer sur **Create** > **Import**
3. Sélectionner le fichier: `insomnia-workspace.json`
4. La workspace "ERP Sage X3 MVP API" sera créée

### Étape 2: Configurer les variables d'environnement

Les variables sont déjà pré-configurées:
- `baseUrl`: http://localhost:3000/api
- `companyId`: 1
- `currencyId`: 1
- `fiscalYearId`: 1
- `businessPartnerId`: 1
- `invoiceId`: 1
- `paymentId`: 1

Pour les modifier:
1. Cliquer sur l'icône d'environnement (en haut à gauche)
2. Sélectionner "Base Environment"
3. Modifier les valeurs selon vos besoins

### Étape 3: Tester l'API

La collection contient des requêtes prêtes à l'emploi pour tous les modules!

## 🔧 Méthode 2: Importer depuis Swagger/OpenAPI

### Option A: Depuis le fichier local

1. Ouvrir Insomnia
2. Cliquer sur **Create** > **Import**
3. Onglet **File**
4. Sélectionner: `swagger.yaml`
5. Insomnia créera automatiquement toutes les requêtes

### Option B: Depuis l'URL Swagger (avec serveur en cours d'exécution)

1. Démarrer le serveur: `npm run start:dev`
2. Ouvrir Insomnia
3. Cliquer sur **Create** > **Import**
4. Onglet **URL**
5. Entrer: `http://localhost:3000/api/docs-json`
6. Cliquer sur **Fetch and Import**

**Note**: Cette méthode synchronise automatiquement avec le Swagger en direct!

## 📁 Structure de la Collection

```
ERP Sage X3 MVP API/
├── 1. Company/
│   ├── Create Company
│   ├── Get All Companies
│   ├── Get Company by ID
│   ├── Get Company by Code
│   ├── Update Company
│   └── Delete Company
├── 2. Currency/
│   ├── Create Currency
│   ├── Get All Currencies
│   └── Get Currency by Code
├── 3. Fiscal Year/
│   ├── Create Fiscal Year
│   ├── Get Fiscal Years by Company
│   ├── Close Fiscal Year
│   └── Reopen Fiscal Year
├── 4. Account/
├── 5. Journal/
├── 6. Tax Code/
├── 7. Business Partner/
├── 8. Product/
├── 9. Warehouse/
├── 10. Invoice/
│   ├── Create Invoice
│   ├── Get All Invoices
│   ├── Get Invoices by Company
│   ├── Get Overdue Invoices
│   └── Record Payment on Invoice
└── 11. Payment/
    ├── Create Payment
    ├── Get All Payments
    └── Get Total Payments by Type
```

## 🎯 Scénario de Test Complet

### 1. Créer une société

**Requête**: `1. Company > Create Company`
```json
{
  "code": "FR01",
  "name": "ACME France",
  "legalName": "ACME France SAS",
  "taxId": "FR12345678901",
  "countryCode": "FR"
}
```

**Réponse**: Notez l'`id` retourné (ex: 1)

### 2. Mettre à jour la variable `companyId`

1. Ouvrir les environnements
2. Modifier `companyId` avec l'ID reçu

### 3. Créer une devise

**Requête**: `2. Currency > Create Currency`
```json
{
  "code": "EUR",
  "name": "Euro",
  "symbol": "€",
  "decimalPlaces": 2
}
```

**Réponse**: Notez l'`id` et mettez à jour `currencyId`

### 4. Créer un exercice fiscal

**Requête**: `3. Fiscal Year > Create Fiscal Year`

Les variables `{{ _.companyId }}` seront automatiquement remplacées!

### 5. Créer un client

**Requête**: `7. Business Partner > Create Business Partner`

### 6. Créer une facture

**Requête**: `10. Invoice > Create Invoice`

Toutes les variables seront injectées automatiquement.

### 7. Enregistrer un paiement

**Requête**: `10. Invoice > Record Payment on Invoice`

## 💡 Astuces Insomnia

### Variables d'environnement

Utiliser la syntaxe `{{ _.variableName }}` dans vos requêtes:

```json
{
  "companyId": {{ _.companyId }},
  "currencyId": {{ _.currencyId }}
}
```

### Créer des environnements multiples

Pour tester différents environnements (dev, staging, prod):

1. Cliquer sur l'icône d'environnement
2. Cliquer sur **+** pour créer un nouvel environnement
3. Nommer (ex: "Production")
4. Modifier le `baseUrl`:
   ```json
   {
     "baseUrl": "https://api.prod.example.com/api"
   }
   ```

### Chainer les requêtes

Extraire automatiquement les IDs des réponses:

1. Aller dans l'onglet **Tests** d'une requête
2. Ajouter du code pour extraire l'ID:
   ```javascript
   const response = JSON.parse(responseBody);
   insomnia.environment.set('companyId', response.id);
   ```

### Authentification (quand implémentée)

Quand l'auth sera ajoutée, configurer un Bearer Token:

1. Onglet **Auth** de la requête
2. Type: **Bearer Token**
3. Token: `{{ _.authToken }}`

## 🔄 Synchronisation automatique avec Swagger

### Activer la synchronisation en temps réel

1. Dans Insomnia, créer une nouvelle collection
2. **Import From** > **URL**
3. URL: `http://localhost:3000/api/docs-json`
4. Cocher **Enable Automatic Sync**
5. Intervalle: 30 secondes

Insomnia mettra à jour automatiquement les endpoints quand le serveur est modifié!

## 📊 Visualisation des réponses

### Format JSON

Insomnia formatte automatiquement le JSON. Vous pouvez:
- Cliquer sur les flèches pour expand/collapse
- Copier des valeurs avec clic droit
- Chercher dans la réponse avec Cmd/Ctrl+F

### Timeline

Voir le temps de réponse:
1. Onglet **Timeline** dans la réponse
2. Affiche les détails de la requête HTTP

### Cookies & Headers

Voir les headers de réponse:
1. Onglet **Headers** dans la réponse
2. Tous les headers HTTP sont affichés

## 🧪 Tests automatiques

Ajouter des tests pour valider les réponses:

```javascript
// Dans l'onglet Tests de la requête
const response = JSON.parse(responseBody);

// Vérifier le code de statut
insomnia.test('Status is 201', () => {
  insomnia.expect(response.status).to.equal(201);
});

// Vérifier la présence d'un champ
insomnia.test('Response has id', () => {
  insomnia.expect(response.id).to.exist;
});

// Vérifier une valeur
insomnia.test('Company code is FR01', () => {
  insomnia.expect(response.code).to.equal('FR01');
});
```

## 🎨 Organisation des requêtes

### Créer des dossiers

1. Clic droit sur la collection
2. **New Folder**
3. Nommer (ex: "Setup Requests", "Invoice Flow")

### Dupliquer des requêtes

1. Clic droit sur une requête
2. **Duplicate**
3. Modifier selon vos besoins

### Tags et couleurs

1. Clic droit sur un dossier
2. **Color Tag**
3. Choisir une couleur pour organiser visuellement

## 🚀 Plugins utiles

### Insomnia Plugin: GraphQL

Si vous ajoutez GraphQL plus tard:
```bash
npm install -g insomnia-plugin-graphql
```

### Insomnia Plugin: Faker

Générer des données de test automatiquement:
```bash
npm install -g insomnia-plugin-faker
```

Utilisation:
```json
{
  "name": "{{ _.faker.company.companyName }}",
  "email": "{{ _.faker.internet.email }}"
}
```

## 📝 Export et partage

### Exporter la collection

1. Clic droit sur la workspace
2. **Export**
3. Format: **Insomnia v4**
4. Partager le fichier JSON avec votre équipe

### Synchronisation Cloud (Insomnia Sync)

1. Créer un compte Insomnia
2. Activer la synchronisation
3. Accéder à vos collections sur tous vos appareils

## 🔍 Débogage

### Voir la requête brute

1. Onglet **Preview** dans la réponse
2. Sélectionner **Raw**
3. Voir exactement ce qui a été envoyé

### Proxy et capture de trafic

1. **Preferences** > **Proxy**
2. Activer le proxy
3. Capturer tout le trafic HTTP

### Logs de console

1. **View** > **Toggle DevTools**
2. Onglet **Console**
3. Voir les logs détaillés

## ⚡ Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| `Ctrl/Cmd + N` | Nouvelle requête |
| `Ctrl/Cmd + Enter` | Envoyer la requête |
| `Ctrl/Cmd + K` | Recherche rapide |
| `Ctrl/Cmd + E` | Basculer environnement |
| `Ctrl/Cmd + L` | Voir timeline |
| `Ctrl/Cmd + Shift + P` | Palette de commandes |

## 🆘 Dépannage

### Erreur de connexion

```
Error: connect ECONNREFUSED 127.0.0.1:3000
```

**Solution**: Vérifier que le serveur est démarré:
```bash
cd backend
npm run start:dev
```

### Variables non remplacées

Si `{{ _.companyId }}` apparaît tel quel dans la requête:

1. Vérifier que l'environnement est sélectionné
2. Vérifier que la variable existe dans l'environnement
3. Syntaxe correcte: `{{ _.variableName }}`

### Erreur 404 Not Found

Vérifier:
- Le serveur est démarré
- Le `baseUrl` est correct dans l'environnement
- Le chemin de l'endpoint est correct

## 📖 Ressources

- **Documentation Insomnia**: https://docs.insomnia.rest/
- **API Swagger local**: http://localhost:3000/api/docs
- **Fichier Swagger**: `backend/swagger.yaml`
- **Collection Postman** (alternative): `backend/postman-collection.json`

---

**Pro Tip**: Utilisez les environnements différents pour dev/staging/prod et basculez facilement entre eux!
