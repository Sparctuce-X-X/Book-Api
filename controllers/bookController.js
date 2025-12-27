// CRUD complet pour les livres
const Book = require('../models/Book');
const BookLike = require('../models/BookLike');
const { bookSchema, bookUpdateSchema } = require('../schemas/bookSchemas');

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
      // Le livre appartient à l'utilisateur connecté
      const book = await Book.create({
        ...value,
        ownerId: req.user.id,
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
  // Supporte la pagination : ?page=1&limit=10
  // ============================================
  getBooks: async (req, res, next) => {
    try {
      // Construction des filtres à partir des query params
      const where = {};

      if (req.query.genre) {
        where.genre = req.query.genre;
      }
      if (req.query.year) {
        const year = parseInt(req.query.year, 10);
        if (!isNaN(year)) {
          where.year = year;
        }
      }
      if (req.query.author) {
        where.author = req.query.author;
      }

      // Pagination
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const offset = (page - 1) * limit;

      // Validation de la pagination
      if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json({
          message: 'Paramètres de pagination invalides. page >= 1, limit >= 1 et limit <= 100',
        });
      }

      // Les plus récents en premier
      const { count, rows: books } = await Book.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit);

      return res.status(200).json({
        message: 'Liste des livres',
        pagination: {
          page,
          limit,
          total: count,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
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
  // Ajoute un like si l'utilisateur ne l'a pas déjà liké
  // ============================================
  likeBook: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const book = await Book.findByPk(id);

      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      // Vérifier si l'utilisateur a déjà liké ce livre
      const existingLike = await BookLike.findOne({
        where: {
          userId,
          bookId: id,
        },
      });

      if (existingLike) {
        return res.status(409).json({
          message: 'Vous avez déjà liké ce livre',
          likesCount: book.likesCount,
        });
      }

      // Créer le like
      await BookLike.create({
        userId,
        bookId: id,
      });

      // Incrémenter le compteur de likes du livre
      book.likesCount += 1;
      await book.save();

      return res.status(200).json({
        message: 'Like ajouté',
        likesCount: book.likesCount,
      });
    } catch (err) {
      // Gérer l'erreur de contrainte unique (protection supplémentaire)
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          message: 'Vous avez déjà liké ce livre',
        });
      }
      next(err);
    }
  },
};
