const { Sequelize } = require('sequelize');

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
    console.log('Base de données SQL connectée');

    // Synchronisation des modèles avec la base (crée les tables si elles n'existent pas)
    await sequelize.sync();
  } catch (error) {
    console.error('Erreur de connexion à la base de données', error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
module.exports.sequelize = sequelize;
