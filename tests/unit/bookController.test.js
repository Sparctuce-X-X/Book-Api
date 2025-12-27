const bookController = require('../../controllers/bookController');
const Book = require('../../models/Book');

jest.mock('../../models/Book');

describe('BookController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBook', () => {
    it('devrait créer un livre avec succès', async () => {
      const req = {
        user: { id: 1 },
        body: {
          title: 'Test Book',
          author: 'Test Author',
          description: 'Test Description',
          year: 2023,
          genre: 'Fiction',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const mockBook = {
        id: 1,
        ...req.body,
        ownerId: 1,
        createdAt: new Date(),
      };

      Book.create.mockResolvedValue(mockBook);

      await bookController.createBook(req, res, next);

      expect(Book.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Book',
          author: 'Test Author',
          ownerId: 1,
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Livre créé avec succès',
        })
      );
    });

    it('devrait retourner une erreur si les données sont invalides', async () => {
      const req = {
        user: { id: 1 },
        body: {
          title: '', // Vide
          author: '', // Vide
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await bookController.createBook(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Données invalides',
        })
      );
    });
  });

  describe('getBooks', () => {
    it('devrait retourner une liste de livres avec pagination', async () => {
      const req = {
        query: {
          page: '1',
          limit: '10',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const mockBooks = [
        { id: 1, title: 'Book 1', author: 'Author 1' },
        { id: 2, title: 'Book 2', author: 'Author 2' },
      ];

      Book.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockBooks,
      });

      await bookController.getBooks(req, res, next);

      expect(Book.findAndCountAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Liste des livres',
          pagination: expect.any(Object),
          books: mockBooks,
        })
      );
    });

    it('devrait appliquer les filtres correctement', async () => {
      const req = {
        query: {
          genre: 'SciFi',
          year: '2023',
          author: 'Asimov',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      Book.findAndCountAll.mockResolvedValue({
        count: 0,
        rows: [],
      });

      await bookController.getBooks(req, res, next);

      expect(Book.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            genre: 'SciFi',
            year: 2023,
            author: 'Asimov',
          },
        })
      );
    });
  });

  describe('getBookById', () => {
    it('devrait retourner un livre par son ID', async () => {
      const req = {
        params: { id: 1 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const mockBook = { id: 1, title: 'Test Book', author: 'Test Author' };
      Book.findByPk.mockResolvedValue(mockBook);

      await bookController.getBookById(req, res, next);

      expect(Book.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ book: mockBook });
    });

    it('devrait retourner 404 si le livre n\'existe pas', async () => {
      const req = {
        params: { id: 999 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      Book.findByPk.mockResolvedValue(null);

      await bookController.getBookById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Livre non trouvé' });
    });
  });

  describe('updateBook', () => {
    it('devrait mettre à jour un livre si l\'utilisateur est le propriétaire', async () => {
      const req = {
        user: { id: 1, role: 'user' },
        params: { id: 1 },
        body: {
          title: 'Updated Title',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const mockBook = {
        id: 1,
        title: 'Original Title',
        ownerId: 1,
        update: jest.fn().mockResolvedValue(true),
      };

      Book.findByPk.mockResolvedValue(mockBook);

      await bookController.updateBook(req, res, next);

      expect(mockBook.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('devrait retourner 403 si l\'utilisateur n\'est pas le propriétaire', async () => {
      const req = {
        user: { id: 2, role: 'user' },
        params: { id: 1 },
        body: {
          title: 'Updated Title',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const mockBook = {
        id: 1,
        ownerId: 1, // Propriétaire différent
      };

      Book.findByPk.mockResolvedValue(mockBook);

      await bookController.updateBook(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Vous ne pouvez modifier que vos propres livres',
      });
    });
  });

  describe('deleteBook', () => {
    it('devrait supprimer un livre si l\'utilisateur est admin', async () => {
      const req = {
        user: { id: 2, role: 'admin' },
        params: { id: 1 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const mockBook = {
        id: 1,
        ownerId: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };

      Book.findByPk.mockResolvedValue(mockBook);

      await bookController.deleteBook(req, res, next);

      expect(mockBook.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

