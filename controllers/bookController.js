// CRUD complet pour les livres
const Joi = require('joi');
const Book = require('../models/Book');

// Schéma de validation pour créer un livre
const bookSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  author: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(2000).allow('', null),
  year: Joi.number().integer().min(0).max(new Date().getFullYear()),
  genre: Joi.string().max(100).allow('', null),
});

// Schéma pour la mise à jour (tous les champs optionnels)
const bookUpdateSchema = Joi.object({
  title: Joi.string().min(1).max(255),
  author: Joi.string().min(1).max(255),
  description: Joi.string().max(2000).allow('', null),
  year: Joi.number().integer().min(0).max(new Date().getFullYear()),
  genre: Joi.string().max(100).allow('', null),
}).min(1); // Au moins un champ doit être fourni

module.exports = {
  // ============================================
  // CREATE - Créer un nouveau livre
  // POST /books
  // ============================================
  createBook: async (req, res, next) => {
    try {
      const { error, value } = bookSchema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({
          message: 'Données invalides',
          details: error.details.map((d) => d.message),
        });
      }

      // req.user est défini par authMiddleware (contient id, email, role)
      const book = await Book.create({
        ...value,
        ownerId: req.user.id, // Le livre appartient à l'utilisateur connecté
      });

      return res.status(201).json({
        message: 'Livre créé avec succès',
        book,
      });
    } catch (err) {
      next(err);
    }
  },

  // ============================================
  // READ ALL - Lister tous les livres
  // GET /books
  // Supporte les filtres : ?genre=SciFi&year=2023&author=Asimov
  // ============================================
  getBooks: async (req, res, next) => {
    try {
      // Construction des filtres à partir des query params
      const where = {};

      if (req.query.genre) {
        where.genre = req.query.genre;
      }
      if (req.query.year) {
        where.year = parseInt(req.query.year, 10);
      }
      if (req.query.author) {
        where.author = req.query.author;
      }

      const books = await Book.findAll({
        where,
        order: [['createdAt', 'DESC']], // Les plus récents en premier
      });

      return res.status(200).json({
        message: 'Liste des livres',
        count: books.length,
        books,
      });
    } catch (err) {
      next(err);
    }
  },

  // ============================================
  // READ ONE - Récupérer un livre par son ID
  // GET /books/:id
  // ============================================
  getBookById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const book = await Book.findByPk(id);

      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      return res.status(200).json({ book });
    } catch (err) {
      next(err);
    }
  },

  // ============================================
  // UPDATE - Modifier un livre
  // PUT /books/:id
  // Seul le propriétaire peut modifier son livre
  // ============================================
  updateBook: async (req, res, next) => {
    try {
      const { id } = req.params;

      const { error, value } = bookUpdateSchema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({
          message: 'Données invalides',
          details: error.details.map((d) => d.message),
        });
      }

      const book = await Book.findByPk(id);

      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      // Vérification : seul le propriétaire OU un admin peut modifier
      if (book.ownerId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Vous ne pouvez modifier que vos propres livres' });
      }

      // Mise à jour des champs
      await book.update(value);

      return res.status(200).json({
        message: 'Livre modifié avec succès',
        book,
      });
    } catch (err) {
      next(err);
    }
  },

  // ============================================
  // DELETE - Supprimer un livre
  // DELETE /books/:id
  // Seul le propriétaire peut supprimer son livre
  // ============================================
  deleteBook: async (req, res, next) => {
    try {
      const { id } = req.params;

      const book = await Book.findByPk(id);

      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      // Vérification : seul le propriétaire OU un admin peut supprimer
      if (book.ownerId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Vous ne pouvez supprimer que vos propres livres' });
      }

      await book.destroy();

      return res.status(200).json({ message: 'Livre supprimé avec succès' });
    } catch (err) {
      next(err);
    }
  },

  // ============================================
  // LIKE - Liker un livre
  // POST /books/:id/like
  // Incrémente le compteur de likes
  // ============================================
  likeBook: async (req, res, next) => {
    try {
      const { id } = req.params;

      const book = await Book.findByPk(id);

      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      // Incrémente le compteur de likes
      book.likesCount += 1;
      await book.save();

      return res.status(200).json({
        message: 'Like ajouté',
        likesCount: book.likesCount,
      });
    } catch (err) {
      next(err);
    }
  },
};
