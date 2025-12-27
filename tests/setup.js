// Configuration globale pour les tests
require('dotenv').config({ path: '.env.test' });

// S'assurer que JWT_SECRET est défini pour les tests
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-secret-key-for-jwt-tokens';
}

// Mock du logger pour éviter les logs pendant les tests
jest.mock('../config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

