/**
 * Point d'entrée centralisé pour tous les schémas de validation Joi
 */
const { registerSchema, loginSchema } = require('./authSchemas');
const { bookSchema, bookUpdateSchema } = require('./bookSchemas');

module.exports = {
  // Schémas d'authentification
  registerSchema,
  loginSchema,
  // Schémas de livres
  bookSchema,
  bookUpdateSchema,
};

