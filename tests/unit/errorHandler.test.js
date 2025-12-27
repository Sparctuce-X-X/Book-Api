const errorHandler = require('../../middlewares/errorHandler');
const logger = require('../../config/logger');

// Mock du logger
jest.mock('../../config/logger', () => ({
  error: jest.fn(),
}));

describe('ErrorHandler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      method: 'GET',
      url: '/test',
      ip: '127.0.0.1',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('devrait gérer les erreurs SequelizeValidationError', () => {
    const err = {
      name: 'SequelizeValidationError',
      errors: [
        { message: 'Erreur de validation 1' },
        { message: 'Erreur de validation 2' },
      ],
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Erreur de validation',
      details: ['Erreur de validation 1', 'Erreur de validation 2'],
    });
    expect(logger.error).toHaveBeenCalled();
  });

  it('devrait gérer les erreurs SequelizeUniqueConstraintError', () => {
    const err = {
      name: 'SequelizeUniqueConstraintError',
      errors: [{ message: 'Email déjà utilisé' }],
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Violation de contrainte unique',
      details: ['Email déjà utilisé'],
    });
  });

  it('devrait gérer les erreurs SequelizeForeignKeyConstraintError', () => {
    const err = {
      name: 'SequelizeForeignKeyConstraintError',
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Référence invalide (clé étrangère)',
    });
  });

  it('devrait gérer les erreurs SequelizeDatabaseError', () => {
    const err = {
      name: 'SequelizeDatabaseError',
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Erreur de base de données',
    });
  });

  it('devrait gérer les erreurs JsonWebTokenError', () => {
    const err = {
      name: 'JsonWebTokenError',
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token invalide',
    });
  });

  it('devrait gérer les erreurs TokenExpiredError', () => {
    const err = {
      name: 'TokenExpiredError',
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token expiré',
    });
  });

  it('devrait gérer les erreurs génériques avec statusCode', () => {
    const err = {
      statusCode: 404,
      message: 'Ressource non trouvée',
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Ressource non trouvée',
    });
  });

  it('devrait gérer les erreurs génériques sans statusCode', () => {
    const err = {
      message: 'Erreur interne',
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Erreur interne',
    });
  });

  it('devrait logger les erreurs avec les détails de la requête', () => {
    req.user = { id: 1 };
    const err = {
      message: 'Test error',
      stack: 'Error stack trace',
    };

    errorHandler(err, req, res, next);

    expect(logger.error).toHaveBeenCalledWith('Erreur dans la requête', {
      error: 'Test error',
      stack: 'Error stack trace',
      method: 'GET',
      url: '/test',
      ip: '127.0.0.1',
      user: 1,
    });
  });
});

