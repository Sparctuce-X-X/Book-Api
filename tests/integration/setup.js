// Configuration spécifique pour les tests d'intégration
require('dotenv').config({ path: '.env.test' });

// S'assurer que JWT_SECRET est défini pour les tests
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-secret-key-for-jwt-tokens';
}

