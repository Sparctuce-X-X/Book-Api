/**
 * Middleware pour valider que les paramètres d'URL sont des entiers valides
 * Vérifie que l'ID est un entier positif et le parse automatiquement
 */
const validateIdParam = (req, res, next) => {
  const { id } = req.params;

  // Vérifier que l'ID est un entier positif
  const idNumber = parseInt(id, 10);
  if (isNaN(idNumber) || idNumber <= 0 || idNumber.toString() !== id) {
    return res.status(400).json({
      message: 'ID invalide. L\'ID doit être un entier positif.',
    });
  }

  // Remplacer le paramètre par la version parsée
  req.params.id = idNumber;
  next();
};

module.exports = validateIdParam;

