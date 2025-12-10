const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI non défini dans le fichier .env');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connecté');
  } catch (error) {
    console.error('Erreur de connexion MongoDB', error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
