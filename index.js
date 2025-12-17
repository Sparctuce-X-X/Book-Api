require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const connectDatabase = require('./config/database');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware de sécurité basique
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connexion à la base de données
connectDatabase();

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
