require('dotenv').config();
const logger = require('./config/logger');
const fs = require('fs');
const path = require('path');

// Créer le dossier logs s'il n'existe pas
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Vérification des variables d'environnement critiques (sauf en mode test)
if (!process.env.JWT_SECRET && process.env.NODE_ENV !== 'test') {
  logger.error('ERREUR: JWT_SECRET n\'est pas défini dans le fichier .env');
  process.exit(1);
}

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const connectDatabase = require('./config/database');
// Charger les associations Sequelize
require('./models');

// Logger au démarrage
logger.info('Démarrage de l\'application Book API');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const errorHandler = require('./middlewares/errorHandler');
const { generalLimiter } = require('./middlewares/rateLimiter');

const app = express();

// Middleware de sécurité basique
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting global
app.use(generalLimiter);

// Connexion à la base de données (sauf en mode test où c'est géré par les tests)
if (process.env.NODE_ENV !== 'test') {
  connectDatabase();
}

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Vérifier que l'API fonctionne
 *     responses:
 *       200:
 *         description: API en ligne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Middleware centralisé de gestion des erreurs
app.use(errorHandler);

// Export de l'app pour les tests
module.exports = app;

// Démarrer le serveur seulement si le fichier est exécuté directement
if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    logger.info(`Serveur démarré sur le port ${PORT}`);
  });
}
