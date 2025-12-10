require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

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

// Routes
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);

// Route simple de santé
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Middleware centralisé de gestion des erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
