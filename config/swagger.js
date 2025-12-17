const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book API',
      version: '1.0.0',
      description: 'API REST de gestion de livres avec authentification JWT',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Alice' },
            email: { type: 'string', example: 'alice@example.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Book: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Fondation' },
            author: { type: 'string', example: 'Isaac Asimov' },
            description: { type: 'string', example: 'Premier tome de la saga' },
            year: { type: 'integer', example: 1951 },
            genre: { type: 'string', example: 'SciFi' },
            ownerId: { type: 'integer', example: 1 },
            likesCount: { type: 'integer', example: 0 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 100, example: 'Alice' },
            email: { type: 'string', format: 'email', example: 'alice@example.com' },
            password: { type: 'string', minLength: 8, example: 'motdepasse123' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'alice@example.com' },
            password: { type: 'string', minLength: 8, example: 'motdepasse123' },
          },
        },
        BookInput: {
          type: 'object',
          required: ['title', 'author'],
          properties: {
            title: { type: 'string', example: 'Fondation' },
            author: { type: 'string', example: 'Isaac Asimov' },
            description: { type: 'string', example: 'Premier tome de la saga' },
            year: { type: 'integer', example: 1951 },
            genre: { type: 'string', example: 'SciFi' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            details: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentification (register, login)' },
      { name: 'Books', description: 'Gestion des livres (CRUD)' },
      { name: 'Health', description: 'Vérification de l\'état de l\'API' },
    ],
  },
  apis: ['./routes/*.js', './index.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
