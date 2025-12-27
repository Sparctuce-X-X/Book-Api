const Joi = require('joi');

/**
 * Schéma de validation pour créer un livre
 */
const bookSchema = Joi.object({
  title: Joi.string().min(1).max(255).required().messages({
    'string.min': 'Le titre doit contenir au moins 1 caractère',
    'string.max': 'Le titre ne peut pas dépasser 255 caractères',
    'any.required': 'Le titre est requis',
  }),
  author: Joi.string().min(1).max(255).required().messages({
    'string.min': 'L\'auteur doit contenir au moins 1 caractère',
    'string.max': 'L\'auteur ne peut pas dépasser 255 caractères',
    'any.required': 'L\'auteur est requis',
  }),
  description: Joi.string().max(2000).allow('', null).messages({
    'string.max': 'La description ne peut pas dépasser 2000 caractères',
  }),
  year: Joi.number().integer().min(0).max(new Date().getFullYear()).messages({
    'number.base': 'L\'année doit être un nombre',
    'number.integer': 'L\'année doit être un entier',
    'number.min': 'L\'année doit être positive',
    'number.max': `L\'année ne peut pas dépasser ${new Date().getFullYear()}`,
  }),
  genre: Joi.string().max(100).allow('', null).messages({
    'string.max': 'Le genre ne peut pas dépasser 100 caractères',
  }),
});

/**
 * Schéma de validation pour mettre à jour un livre (tous les champs optionnels)
 */
const bookUpdateSchema = Joi.object({
  title: Joi.string().min(1).max(255).messages({
    'string.min': 'Le titre doit contenir au moins 1 caractère',
    'string.max': 'Le titre ne peut pas dépasser 255 caractères',
  }),
  author: Joi.string().min(1).max(255).messages({
    'string.min': 'L\'auteur doit contenir au moins 1 caractère',
    'string.max': 'L\'auteur ne peut pas dépasser 255 caractères',
  }),
  description: Joi.string().max(2000).allow('', null).messages({
    'string.max': 'La description ne peut pas dépasser 2000 caractères',
  }),
  year: Joi.number().integer().min(0).max(new Date().getFullYear()).messages({
    'number.base': 'L\'année doit être un nombre',
    'number.integer': 'L\'année doit être un entier',
    'number.min': 'L\'année doit être positive',
    'number.max': `L\'année ne peut pas dépasser ${new Date().getFullYear()}`,
  }),
  genre: Joi.string().max(100).allow('', null).messages({
    'string.max': 'Le genre ne peut pas dépasser 100 caractères',
  }),
}).min(1).messages({
  'object.min': 'Au moins un champ doit être fourni pour la mise à jour',
});

module.exports = {
  bookSchema,
  bookUpdateSchema,
};

