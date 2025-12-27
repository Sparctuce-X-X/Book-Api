# 📚 Book API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-blue.svg)](https://expressjs.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-6.37-blue.svg)](https://sequelize.org/)
[![Jest](https://img.shields.io/badge/Jest-29.7-red.svg)](https://jestjs.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

API REST complète de gestion de livres avec authentification JWT, développée avec Node.js, Express et SQLite. Cette API permet de créer, lire, modifier et supprimer des livres avec un système d'authentification sécurisé, de rôles utilisateurs, et de nombreuses fonctionnalités avancées.

## ✨ Fonctionnalités

- 🔐 **Authentification JWT** : Système d'authentification sécurisé avec tokens JWT
- 👥 **Gestion des rôles** : Système de permissions (user/admin)
- 📖 **CRUD complet** : Création, lecture, mise à jour et suppression de livres
- 🔍 **Filtres avancés** : Recherche par genre, année, auteur
- 📄 **Pagination** : Navigation efficace dans les grandes listes
- ❤️ **Système de likes** : Possibilité de liker des livres
- 🛡️ **Sécurité renforcée** : Rate limiting, validation, logging
- 📊 **Tests complets** : Tests unitaires et d'intégration avec couverture de code
- 📖 **Documentation Swagger** : Documentation interactive de l'API
- 📝 **Logging structuré** : Système de logs avec Winston

## 🚀 Démarrage rapide

### Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/Sparctuce-X-X/Book-Api.git
cd Book-Api

# Installer les dépendances
npm install

# Créer le fichier de configuration
cp .env.example .env
```

### Configuration

Éditez le fichier `.env` avec vos paramètres :

```env
PORT=4000
DB_FILE=database.sqlite
JWT_SECRET=votre_secret_tres_long_et_complexe_au_moins_32_caracteres
JWT_EXPIRES_IN=1h
LOG_LEVEL=info
NODE_ENV=development
```

**⚠️ Important** : Utilisez un `JWT_SECRET` fort et unique en production !

### Lancement

```bash
# Mode développement (avec rechargement automatique)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:4000` (ou le port configuré).

## 📖 Documentation API

### Documentation Swagger

Une documentation interactive est disponible à l'adresse :

```
http://localhost:4000/api-docs
```

Vous pouvez y tester toutes les routes directement depuis le navigateur.

### Routes disponibles

#### 🔐 Authentification

| Méthode | Route | Description | Auth requise |
|---------|-------|-------------|--------------|
| POST | `/auth/register` | Créer un nouveau compte utilisateur | ❌ |
| POST | `/auth/login` | Se connecter et obtenir un token JWT | ❌ |

#### 📚 Livres

| Méthode | Route | Description | Auth requise |
|---------|-------|-------------|--------------|
| GET | `/books` | Lister tous les livres (avec filtres et pagination) | ✅ |
| GET | `/books/:id` | Récupérer un livre par son ID | ✅ |
| POST | `/books` | Créer un nouveau livre | ✅ |
| PUT | `/books/:id` | Modifier un livre | ✅ (propriétaire ou admin) |
| DELETE | `/books/:id` | Supprimer un livre | ✅ (propriétaire ou admin) |
| POST | `/books/:id/like` | Liker un livre | ✅ |

#### 🏥 Santé

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/health` | Vérifier que l'API fonctionne |

### Filtres et pagination

L'endpoint `GET /books` supporte plusieurs paramètres de requête :

**Filtres :**
- `genre` : Filtrer par genre (ex: `SciFi`, `Fiction`)
- `year` : Filtrer par année de publication (ex: `2023`)
- `author` : Filtrer par auteur (ex: `Isaac Asimov`)

**Pagination :**
- `page` : Numéro de page (défaut: `1`)
- `limit` : Nombre d'éléments par page (défaut: `10`, max: `100`)

**Exemples :**

```bash
# Filtrer par genre
GET /books?genre=SciFi

# Filtrer par année et auteur
GET /books?year=2023&author=Asimov

# Pagination
GET /books?page=1&limit=20

# Combinaison
GET /books?genre=SciFi&year=2023&page=2&limit=10
```

### Exemples de requêtes

#### Inscription

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice",
    "email": "alice@example.com",
    "password": "motdepasse123"
  }'
```

**Réponse :**
```json
{
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Connexion

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "motdepasse123"
  }'
```

**Réponse :**
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "role": "user"
  }
}
```

#### Créer un livre

```bash
curl -X POST http://localhost:4000/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <votre_token>" \
  -d '{
    "title": "Fondation",
    "author": "Isaac Asimov",
    "description": "Premier tome de la saga Fondation",
    "year": 1951,
    "genre": "SciFi"
  }'
```

#### Lister les livres avec pagination

```bash
curl "http://localhost:4000/books?page=1&limit=10" \
  -H "Authorization: Bearer <votre_token>"
```

**Réponse :**
```json
{
  "message": "Liste des livres",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "books": [...]
}
```

## 🛡️ Sécurité

L'API implémente plusieurs mesures de sécurité :

### Authentification et autorisation

- **JWT (JSON Web Tokens)** : Tokens signés avec expiration configurable
- **Hashage des mots de passe** : Utilisation de bcrypt avec 10 rounds
- **Système de rôles** : Permissions granulaires (user/admin)
- **Protection des routes** : Middleware d'authentification sur toutes les routes sensibles

### Protection contre les abus

- **Rate Limiting** :
  - Routes générales : 100 requêtes par 15 minutes par IP
  - Routes d'authentification : 5 tentatives par 15 minutes par IP (protection contre brute force)

### Validation et sanitisation

- **Validation Joi** : Toutes les entrées utilisateur sont validées
- **Validation des paramètres** : Les IDs et paramètres d'URL sont validés
- **Sanitisation** : Nettoyage automatique des données (trim, lowercase pour emails)

### Headers de sécurité

- **Helmet** : Configuration sécurisée des headers HTTP
- **CORS** : Gestion des requêtes cross-origin

### Logging et monitoring

- **Winston** : Système de logging structuré
- **Logs d'erreurs** : Enregistrement détaillé des erreurs avec contexte
- **Logs d'activité** : Suivi des connexions et opérations importantes

## 👥 Système de rôles

L'API implémente un système de rôles avec des permissions spécifiques :

| Rôle | Permissions |
|------|-------------|
| **user** | CRUD sur ses propres livres uniquement |
| **admin** | CRUD sur tous les livres (peut modifier/supprimer n'importe quel livre) |

Par défaut, tous les nouveaux utilisateurs ont le rôle `user`. Seuls les administrateurs peuvent modifier ou supprimer des livres qui ne leur appartiennent pas.

## 🧪 Tests

Le projet inclut une suite de tests complète avec une couverture de code élevée.

### Exécution des tests

```bash
# Exécuter tous les tests avec couverture
npm test

# Exécuter les tests en mode watch (re-exécution automatique)
npm run test:watch
```

### Résultats actuels

- ✅ **36 tests** (tous passent)
- 📊 **Couverture globale** : 79.54%
- 🧪 **Tests unitaires** : 12 tests (controllers)
- 🔗 **Tests d'intégration** : 24 tests (routes)

### Structure des tests

```
tests/
├── unit/              # Tests unitaires
│   ├── authController.test.js
│   └── bookController.test.js
├── integration/       # Tests d'intégration
│   ├── auth.test.js
│   └── books.test.js
└── setup.js          # Configuration globale
```

Voir [tests/README.md](tests/README.md) pour plus de détails.

## 📁 Architecture du projet

```
Book-Api/
├── config/                    # Configuration
│   ├── database.js            # Configuration Sequelize/SQLite
│   ├── logger.js               # Configuration Winston
│   └── swagger.js             # Configuration Swagger/OpenAPI
│
├── controllers/               # Logique métier
│   ├── authController.js      # Authentification (register, login)
│   └── bookController.js      # CRUD livres
│
├── middlewares/               # Middlewares Express
│   ├── authMiddleware.js     # Vérification JWT
│   ├── errorHandler.js        # Gestion centralisée des erreurs
│   ├── rateLimiter.js         # Rate limiting
│   └── validateParams.js      # Validation des paramètres
│
├── models/                    # Modèles Sequelize
│   ├── User.js                # Modèle utilisateur
│   ├── Book.js                # Modèle livre
│   └── index.js               # Associations Sequelize
│
├── routes/                    # Définition des routes
│   ├── auth.js                # Routes /auth
│   └── books.js               # Routes /books
│
├── tests/                     # Tests
│   ├── unit/                  # Tests unitaires
│   ├── integration/           # Tests d'intégration
│   └── setup.js               # Configuration des tests
│
├── logs/                      # Fichiers de logs (générés automatiquement)
│   ├── error.log              # Logs d'erreurs
│   └── combined.log           # Tous les logs
│
├── .env.example               # Template des variables d'environnement
├── .gitignore                 # Fichiers ignorés par Git
├── index.js                   # Point d'entrée de l'application
├── jest.config.js             # Configuration Jest
├── package.json               # Dépendances et scripts
└── README.md                  # Ce fichier
```

## 🔧 Technologies utilisées

### Backend

- **Node.js** : Runtime JavaScript
- **Express** : Framework web
- **Sequelize** : ORM pour SQL
- **SQLite** : Base de données

### Sécurité

- **jsonwebtoken** : Authentification JWT
- **bcryptjs** : Hashage des mots de passe
- **helmet** : Sécurisation des headers HTTP
- **express-rate-limit** : Protection contre les abus

### Validation et documentation

- **Joi** : Validation des schémas
- **swagger-jsdoc** : Documentation OpenAPI
- **swagger-ui-express** : Interface Swagger

### Logging et monitoring

- **winston** : Système de logging structuré

### Tests

- **Jest** : Framework de tests
- **supertest** : Tests HTTP

## 📝 Variables d'environnement

| Variable | Description | Défaut | Requis |
|----------|-------------|--------|--------|
| `PORT` | Port d'écoute du serveur | `4000` | ❌ |
| `DB_FILE` | Chemin du fichier SQLite | `database.sqlite` | ❌ |
| `JWT_SECRET` | Secret pour signer les tokens JWT | - | ✅ |
| `JWT_EXPIRES_IN` | Durée de validité des tokens | `1h` | ❌ |
| `LOG_LEVEL` | Niveau de logging (error, warn, info, debug) | `info` | ❌ |
| `NODE_ENV` | Environnement (development, production) | `development` | ❌ |

## 🚀 Déploiement

### Préparation

1. Assurez-vous que toutes les variables d'environnement sont configurées
2. Utilisez un `JWT_SECRET` fort et unique
3. Configurez `NODE_ENV=production`
4. Vérifiez que le dossier `logs/` est accessible en écriture

### Recommandations

- Utilisez un processus manager comme PM2
- Configurez un reverse proxy (Nginx) avec SSL/TLS
- Mettez en place une sauvegarde régulière de la base de données
- Configurez la rotation des logs
- Utilisez un monitoring (ex: PM2 Monitoring, New Relic)

## 🧪 Tester avec Postman

Une collection Postman est disponible dans le fichier `postman_collection.json`.

1. Importer le fichier dans Postman
2. Créer un environnement avec la variable `baseUrl` = `http://localhost:4000`
3. Exécuter les requêtes dans l'ordre : Register → Login → Books

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👤 Auteur

**Sparctuce-X-X**

- GitHub: [@Sparctuce-X-X](https://github.com/Sparctuce-X-X)

## 🙏 Remerciements

- Express.js pour le framework web
- Sequelize pour l'ORM
- Tous les contributeurs des packages open-source utilisés

---

⭐ Si ce projet vous a été utile, n'hésitez pas à lui donner une étoile !
