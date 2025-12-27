const rateLimit = require('express-rate-limit');

// En mode test, désactiver le rate limiting ou utiliser des limites très élevées
const isTestMode = process.env.NODE_ENV === 'test';

/**
 * Rate limiter général pour toutes les routes
 * Limite chaque IP à 100 requêtes par fenêtre de 15 minutes
 * En mode test, limite très élevée pour permettre tous les tests
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTestMode ? 10000 : 100, // Limite très élevée en mode test
  message: {
    success: false,
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  },
  standardHeaders: true, // Retourne les infos de limite dans les headers `RateLimit-*`
  legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
});

/**
 * Rate limiter strict pour les routes d'authentification
 * Protection contre les attaques par force brute
 * Limite à 5 tentatives par IP par fenêtre de 15 minutes
 * En mode test, limite très élevée pour permettre tous les tests
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTestMode ? 10000 : 5, // Limite très élevée en mode test
  message: {
    success: false,
    message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes.',
  },
  skipSuccessfulRequests: true, // Ne compte pas les requêtes réussies
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
};

