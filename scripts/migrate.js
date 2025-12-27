require('dotenv').config();
const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');

const migrationsPath = path.join(__dirname, '../migrations');

const runMigrations = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie');

    const migrationFiles = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith('.js'))
      .sort();

    for (const file of migrationFiles) {
      console.log(`Exécution de la migration: ${file}`);
      const migration = require(path.join(migrationsPath, file));
      await migration.up(sequelize.getQueryInterface(), sequelize.constructor);
      console.log(`✓ Migration ${file} terminée`);
    }

    console.log('Toutes les migrations ont été exécutées avec succès');
    await sequelize.close();
  } catch (error) {
    console.error('Erreur lors de l\'exécution des migrations:', error);
    process.exit(1);
  }
};

runMigrations();

