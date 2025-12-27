// Charger la configuration de test avant d'importer l'app
require('./setup');

const request = require('supertest');
const app = require('../../index');
const { sequelize } = require('../../config/database');
const User = require('../../models/User');
const Book = require('../../models/Book');
const BookLike = require('../../models/BookLike');
const jwt = require('jsonwebtoken');

describe('Routes de livres', () => {
  let authToken;
  let userId;
  let adminToken;
  let adminId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Nettoyer les données
    await BookLike.destroy({ where: {}, truncate: true });
    await Book.destroy({ where: {}, truncate: true });
    await User.destroy({ where: {}, truncate: true });

    // Créer un utilisateur normal
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('Password123', 10);
    const user = await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user',
    });
    userId = user.id;
    authToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );

    // Créer un admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });
    adminId = admin.id;
    adminToken = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  describe('POST /books', () => {
    it('devrait créer un livre avec authentification', async () => {
      const response = await request(app)
        .post('/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Book',
          author: 'Test Author',
          description: 'Test Description',
          year: 2023,
          genre: 'Fiction',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Livre créé avec succès');
      expect(response.body).toHaveProperty('book');
      expect(response.body.book.title).toBe('Test Book');
      expect(response.body.book.ownerId).toBe(userId);
    });

    it('devrait retourner 401 sans token', async () => {
      const response = await request(app)
        .post('/books')
        .send({
          title: 'Test Book',
          author: 'Test Author',
        });

      expect(response.status).toBe(401);
    });

    it('devrait retourner 400 si les données sont invalides', async () => {
      const response = await request(app)
        .post('/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '', // Vide
          author: '', // Vide
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /books', () => {
    beforeEach(async () => {
      // Créer quelques livres de test
      await Book.create({
        title: 'Book 1',
        author: 'Author 1',
        genre: 'SciFi',
        year: 2023,
        ownerId: userId,
      });
      await Book.create({
        title: 'Book 2',
        author: 'Author 2',
        genre: 'Fiction',
        year: 2022,
        ownerId: userId,
      });
    });

    it('devrait retourner la liste des livres avec pagination', async () => {
      const response = await request(app)
        .get('/books')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('books');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('page');
      expect(response.body.pagination).toHaveProperty('total');
    });

    it('devrait filtrer par genre', async () => {
      const response = await request(app)
        .get('/books?genre=SciFi')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.books.every((book) => book.genre === 'SciFi')).toBe(true);
    });

    it('devrait retourner 401 sans token', async () => {
      const response = await request(app).get('/books');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /books/:id', () => {
    let bookId;

    beforeEach(async () => {
      const book = await Book.create({
        title: 'Test Book',
        author: 'Test Author',
        ownerId: userId,
      });
      bookId = book.id;
    });

    it('devrait retourner un livre par son ID', async () => {
      const response = await request(app)
        .get(`/books/${bookId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('book');
      expect(response.body.book.id).toBe(bookId);
    });

    it('devrait retourner 404 si le livre n\'existe pas', async () => {
      const response = await request(app)
        .get('/books/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('devrait retourner 400 si l\'ID est invalide', async () => {
      const response = await request(app)
        .get('/books/invalid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /books/:id', () => {
    let bookId;

    beforeEach(async () => {
      const book = await Book.create({
        title: 'Original Title',
        author: 'Original Author',
        ownerId: userId,
      });
      bookId = book.id;
    });

    it('devrait mettre à jour un livre si l\'utilisateur est le propriétaire', async () => {
      const response = await request(app)
        .put(`/books/${bookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Livre modifié avec succès');
    });

    it('devrait permettre à un admin de modifier n\'importe quel livre', async () => {
      const response = await request(app)
        .put(`/books/${bookId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Admin Updated Title',
        });

      expect(response.status).toBe(200);
    });

    it('devrait retourner 403 si l\'utilisateur n\'est pas le propriétaire', async () => {
      // Créer un autre utilisateur
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('Password123', 10);
      const otherUser = await User.create({
        name: 'Other User',
        email: 'other@example.com',
        password: hashedPassword,
      });
      const otherToken = jwt.sign(
        { id: otherUser.id, email: otherUser.email, role: otherUser.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .put(`/books/${bookId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          title: 'Unauthorized Update',
        });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /books/:id', () => {
    let bookId;

    beforeEach(async () => {
      const book = await Book.create({
        title: 'Book to Delete',
        author: 'Author',
        ownerId: userId,
      });
      bookId = book.id;
    });

    it('devrait supprimer un livre si l\'utilisateur est le propriétaire', async () => {
      const response = await request(app)
        .delete(`/books/${bookId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Livre supprimé avec succès');
    });

    it('devrait permettre à un admin de supprimer n\'importe quel livre', async () => {
      const response = await request(app)
        .delete(`/books/${bookId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('POST /books/:id/like', () => {
    let bookId;

    beforeEach(async () => {
      const book = await Book.create({
        title: 'Book to Like',
        author: 'Author',
        ownerId: userId,
        likesCount: 0,
      });
      bookId = book.id;
    });

    it('devrait incrémenter le compteur de likes', async () => {
      const response = await request(app)
        .post(`/books/${bookId}/like`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('likesCount', 1);
      expect(response.body).toHaveProperty('message', 'Like ajouté');
    });

    it('devrait retourner 409 si l\'utilisateur a déjà liké le livre', async () => {
      // Premier like
      await request(app)
        .post(`/books/${bookId}/like`)
        .set('Authorization', `Bearer ${authToken}`);

      // Deuxième like (devrait échouer)
      const response = await request(app)
        .post(`/books/${bookId}/like`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message', 'Vous avez déjà liké ce livre');
    });
  });
});

