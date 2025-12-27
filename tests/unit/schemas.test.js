const { registerSchema, loginSchema } = require('../../schemas/authSchemas');
const { bookSchema, bookUpdateSchema } = require('../../schemas/bookSchemas');
const schemas = require('../../schemas');

describe('Schémas de validation', () => {
  describe('AuthSchemas', () => {
    describe('registerSchema', () => {
      it('devrait valider un utilisateur valide', () => {
        const validUser = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123',
        };
        const { error } = registerSchema.validate(validUser);
        expect(error).toBeUndefined();
      });

      it('devrait rejeter un nom trop court', () => {
        const invalidUser = {
          name: 'J',
          email: 'john@example.com',
          password: 'Password123',
        };
        const { error } = registerSchema.validate(invalidUser);
        expect(error).toBeDefined();
        expect(error.details[0].message).toContain('au moins 2 caractères');
      });

      it('devrait rejeter un email invalide', () => {
        const invalidUser = {
          name: 'John Doe',
          email: 'invalid-email',
          password: 'Password123',
        };
        const { error } = registerSchema.validate(invalidUser);
        expect(error).toBeDefined();
        expect(error.details[0].message).toContain('email valide');
      });

      it('devrait rejeter un mot de passe trop simple', () => {
        const invalidUser = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'simple',
        };
        const { error } = registerSchema.validate(invalidUser);
        expect(error).toBeDefined();
      });

      it('devrait rejeter un mot de passe sans majuscule', () => {
        const invalidUser = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        };
        const { error } = registerSchema.validate(invalidUser);
        expect(error).toBeDefined();
      });
    });

    describe('loginSchema', () => {
      it('devrait valider des identifiants valides', () => {
        const validLogin = {
          email: 'john@example.com',
          password: 'anypassword',
        };
        const { error } = loginSchema.validate(validLogin);
        expect(error).toBeUndefined();
      });

      it('devrait rejeter un email invalide', () => {
        const invalidLogin = {
          email: 'invalid-email',
          password: 'password',
        };
        const { error } = loginSchema.validate(invalidLogin);
        expect(error).toBeDefined();
      });

      it('devrait rejeter un email manquant', () => {
        const invalidLogin = {
          password: 'password',
        };
        const { error } = loginSchema.validate(invalidLogin);
        expect(error).toBeDefined();
      });
    });
  });

  describe('BookSchemas', () => {
    describe('bookSchema', () => {
      it('devrait valider un livre valide', () => {
        const validBook = {
          title: 'Test Book',
          author: 'Test Author',
          description: 'A test book',
          year: 2023,
          genre: 'Fiction',
        };
        const { error } = bookSchema.validate(validBook);
        expect(error).toBeUndefined();
      });

      it('devrait rejeter un titre vide', () => {
        const invalidBook = {
          title: '',
          author: 'Test Author',
        };
        const { error } = bookSchema.validate(invalidBook);
        expect(error).toBeDefined();
      });

      it('devrait rejeter une année future', () => {
        const invalidBook = {
          title: 'Test Book',
          author: 'Test Author',
          year: new Date().getFullYear() + 1,
        };
        const { error } = bookSchema.validate(invalidBook);
        expect(error).toBeDefined();
      });

      it('devrait accepter une description vide', () => {
        const validBook = {
          title: 'Test Book',
          author: 'Test Author',
          description: '',
        };
        const { error } = bookSchema.validate(validBook);
        expect(error).toBeUndefined();
      });
    });

    describe('bookUpdateSchema', () => {
      it('devrait valider une mise à jour avec un seul champ', () => {
        const validUpdate = {
          title: 'Updated Title',
        };
        const { error } = bookUpdateSchema.validate(validUpdate);
        expect(error).toBeUndefined();
      });

      it('devrait rejeter une mise à jour vide', () => {
        const invalidUpdate = {};
        const { error } = bookUpdateSchema.validate(invalidUpdate);
        expect(error).toBeDefined();
      });

      it('devrait valider une mise à jour avec plusieurs champs', () => {
        const validUpdate = {
          title: 'Updated Title',
          year: 2024,
        };
        const { error } = bookUpdateSchema.validate(validUpdate);
        expect(error).toBeUndefined();
      });
    });
  });

  describe('Schemas index', () => {
    it('devrait exporter tous les schémas', () => {
      expect(schemas.registerSchema).toBeDefined();
      expect(schemas.loginSchema).toBeDefined();
      expect(schemas.bookSchema).toBeDefined();
      expect(schemas.bookUpdateSchema).toBeDefined();
    });
  });
});

