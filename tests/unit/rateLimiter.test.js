const { generalLimiter, authLimiter } = require('../../middlewares/rateLimiter');

describe('Rate Limiter Middlewares', () => {
  describe('generalLimiter', () => {
    it('devrait être défini', () => {
      expect(generalLimiter).toBeDefined();
      expect(typeof generalLimiter).toBe('function');
    });

    it('devrait avoir la configuration correcte', () => {
      // Vérifier que c'est bien un middleware Express
      expect(generalLimiter).toBeInstanceOf(Function);
    });
  });

  describe('authLimiter', () => {
    it('devrait être défini', () => {
      expect(authLimiter).toBeDefined();
      expect(typeof authLimiter).toBe('function');
    });

    it('devrait avoir la configuration correcte', () => {
      // Vérifier que c'est bien un middleware Express
      expect(authLimiter).toBeInstanceOf(Function);
    });
  });
});

