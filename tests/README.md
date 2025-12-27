# Tests

Ce dossier contient les tests unitaires et d'intégration pour l'API Book.

## Structure

```
tests/
├── unit/              # Tests unitaires
│   ├── authController.test.js
│   └── bookController.test.js
├── integration/        # Tests d'intégration
│   ├── auth.test.js
│   └── books.test.js
├── setup.js           # Configuration globale pour les tests
└── README.md          # Ce fichier
```

## Exécution des tests

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch
npm run test:watch

# Exécuter avec couverture de code
npm test -- --coverage
```

## Configuration

Les tests utilisent une base de données SQLite séparée pour les tests. Assurez-vous d'avoir un fichier `.env.test` avec les variables nécessaires :

```env
JWT_SECRET=test-secret-key
DB_FILE=test-database.sqlite
NODE_ENV=test
```

## Notes

- Les tests d'intégration utilisent une base de données réelle (SQLite en mémoire ou fichier de test)
- Les tests unitaires mockent les dépendances (modèles, bcrypt, jwt)
- Le logger est mocké pour éviter les logs pendant les tests

