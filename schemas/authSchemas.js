const Joi = require('joi');

/**
 * Schéma de validation pour l'inscription d'un utilisateur
 */
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required().messages({
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'string.max': 'Le nom ne peut pas dépasser 100 caractères',
    'any.required': 'Le nom est requis',
  }),
  email: Joi.string().email().trim().lowercase().required().messages({
    'string.email': 'L\'email doit être une adresse email valide',
    'any.required': 'L\'email est requis',
  }),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
      'string.max': 'Le mot de passe ne peut pas dépasser 128 caractères',
      'string.pattern.base': 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre',
      'any.required': 'Le mot de passe est requis',
    }),
});

/**
 * Schéma de validation pour la connexion d'un utilisateur
 */
const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    'string.email': 'L\'email doit être une adresse email valide',
    'any.required': 'L\'email est requis',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Le mot de passe est requis',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};

