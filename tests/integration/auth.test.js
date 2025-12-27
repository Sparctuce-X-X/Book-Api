// Charger la configuration de test avant d'importer l'app
require('./setup');

const request = require('supertest');
const app = require('../../index');
const { sequelize } = require('../../config/database');
const User = require('../../models/User');

describe('Routes d\'authentification', () => {
  beforeAll(async () => {
    // Synchroniser la base de données de test
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Nettoyer les données avant chaque test
    await User.destroy({ where: {}, truncate: true });
  });

  describe('POST /auth/register', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Utilisateur créé avec succès');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('devrait retourner 400 si les données sont invalides', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'A', // Trop court
          email: 'invalid-email',
          password: '123', // Trop court
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Données invalides');
      expect(response.body).toHaveProperty('details');
    });

    it('devrait retourner 409 si l\'email existe déjà', async () => {
      // Créer un utilisateur
      await User.create({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'hashedPassword',
      });

      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'New User',
          email: 'existing@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message', 'Email déjà utilisé');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Créer un utilisateur de test
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
      });
    });

    it('devrait connecter un utilisateur avec succès', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Connexion réussie');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('devrait retourner 401 si l\'email est incorrect', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Identifiants invalides');
    });

    it('devrait retourner 401 si le mot de passe est incorrect', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Identifiants invalides');
    });
  });
});

