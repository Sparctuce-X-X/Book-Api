const { Sequelize } = require('sequelize');
const logger = require('./logger');

// Utilisation de SQLite pour simplifier l'installation (fichier local)
// Le chemin du fichier peut être configuré via la variable d'environnement DB_FILE
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_FILE || 'database.sqlite',
  logging: false,
});

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Base de données SQL connectée avec succès');

    // Synchronisation des modèles avec la base (crée les tables si elles n'existent pas)
    await sequelize.sync();
    logger.info('Modèles synchronisés avec la base de données');
  } catch (error) {
    logger.error('Erreur de connexion à la base de données', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

module.exports = connectDatabase;
module.exports.sequelize = sequelize;
