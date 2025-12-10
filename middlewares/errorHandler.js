// Middleware centralisé de gestion des erreurs
module.exports = (err, req, res, next) => {
  console.error(err); // en prod on utiliserait un logger

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';

  res.status(statusCode).json({
    success: false,
    message,
  });
};
