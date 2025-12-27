const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// Schémas de validation Joi
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

const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    'string.email': 'L\'email doit être une adresse email valide',
    'any.required': 'L\'email est requis',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Le mot de passe est requis',
  }),
});

const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

module.exports = {
  register: async (req, res, next) => {
    try {
      const { error, value } = registerSchema.validate(req.body, { abortEarly: false }); //abortEarly: false permet de retourner tous les erreurs au lieu de la première

      if (error) {
        return res.status(400).json({
          message: 'Données invalides',
          details: error.details.map((d) => d.message),
        });
      }

      const { name, email, password } = value;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'Email déjà utilisé' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const userSafe = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      };

      return res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: userSafe,
      });
    } catch (err) {
      next(err);
    }
  },

  
  login: async (req, res, next) => {
    try {
      const { error, value } = loginSchema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({
          message: 'Données invalides',
          details: error.details.map((d) => d.message),
        });
      }

      const { email, password } = value;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Identifiants invalides' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Identifiants invalides' });
      }

      const token = generateToken(user);

      const userSafe = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      return res.status(200).json({
        message: 'Connexion réussie',
        token,
        user: userSafe,
      });
    } catch (err) {
      next(err);
    }
  },
};
