# 📚 Book API

API REST de gestion de livres avec authentification JWT, développée avec Node.js, Express et SQLite (Sequelize ORM).

## 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/Sparctuce-X-X/Book-Api.git
cd Book-Api

# Installer les dépendances
npm install

# Créer le fichier .env à partir de l'exemple
cp .env.example .env
```

## ⚙️ Configuration

Modifier le fichier `.env` selon vos besoins :

```env
PORT=4000
DB_FILE=database.sqlite
JWT_SECRET=votre_secret_tres_long_et_complexe
JWT_EXPIRES_IN=1h
```

## ▶️ Lancement

```bash
# Mode production
npm start

# Mode développement (avec rechargement automatique)
npm run dev
```

Le serveur démarre sur `http://localhost:4000`.

## 📖 Documentation Swagger

Une documentation interactive est disponible à l'adresse :

```
http://localhost:4000/api-docs
```

Vous pouvez y tester toutes les routes directement depuis le navigateur.

## 🔐 Authentification

L'API utilise des tokens JWT. Pour accéder aux routes protégées, ajoutez le header :

```
Authorization: Bearer <votre_token>
```

## 📋 Routes disponibles

### Auth

| Méthode | Route | Description | Auth requise |
|---------|-------|-------------|--------------|
| POST | `/auth/register` | Créer un compte | ❌ |
| POST | `/auth/login` | Se connecter | ❌ |

### Livres

| Méthode | Route | Description | Auth requise |
|---------|-------|-------------|--------------|
| GET | `/books` | Lister tous les livres | ✅ |
| GET | `/books/:id` | Voir un livre | ✅ |
| POST | `/books` | Créer un livre | ✅ |
| PUT | `/books/:id` | Modifier un livre | ✅ (propriétaire ou admin) |
| DELETE | `/books/:id` | Supprimer un livre | ✅ (propriétaire ou admin) |
| POST | `/books/:id/like` | Liker un livre | ✅ |

### Filtres disponibles (GET /books)

```
GET /books?genre=SciFi
GET /books?year=2023
GET /books?author=Asimov
GET /books?genre=SciFi&year=2023
```

### Santé

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/health` | Vérifier que l'API fonctionne |

## 📝 Exemples de requêtes

### Inscription

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice",
    "email": "alice@example.com",
    "password": "motdepasse123"
  }'
```

### Connexion

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "motdepasse123"
  }'
```

### Créer un livre

```bash
curl -X POST http://localhost:4000/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Fondation",
    "author": "Isaac Asimov",
    "description": "Premier tome de la saga Fondation",
    "year": 1951,
    "genre": "SciFi"
  }'
```

### Lister les livres

```bash
curl http://localhost:4000/books \
  -H "Authorization: Bearer <token>"
```

## 🛡️ Sécurité

- **Mots de passe** : hashés avec bcrypt (10 rounds)
- **JWT** : tokens signés avec expiration configurable
- **Validation** : toutes les entrées validées avec Joi
- **Headers** : sécurisés avec Helmet
- **CORS** : activé pour les requêtes cross-origin

## 👥 Système de rôles

| Rôle | Permissions |
|------|-------------|
| `user` | CRUD sur ses propres livres uniquement |
| `admin` | CRUD sur tous les livres |

## 📁 Structure du projet

```
Book-Api/
├── config/
│   └── database.js       # Configuration Sequelize/SQLite
├── controllers/
│   ├── authController.js # Logique auth (register, login)
│   └── bookController.js # Logique CRUD livres
├── middlewares/
│   ├── authMiddleware.js # Vérification JWT
│   └── errorHandler.js   # Gestion centralisée des erreurs
├── models/
│   ├── User.js           # Modèle utilisateur
│   └── Book.js           # Modèle livre
├── routes/
│   ├── auth.js           # Routes /auth
│   └── books.js          # Routes /books
├── .env.example          # Template des variables d'environnement
├── .gitignore
├── index.js              # Point d'entrée de l'application
├── package.json
└── README.md
```

## 🧪 Tester avec Postman

Une collection Postman est disponible dans le fichier `postman_collection.json`.

1. Importer le fichier dans Postman
2. Créer un environnement avec la variable `baseUrl` = `http://localhost:4000`
3. Exécuter les requêtes dans l'ordre : Register → Login → Books

## 📄 Licence

MIT
