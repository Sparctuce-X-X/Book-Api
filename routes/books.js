const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');
const authMiddleware = require('../middlewares/authMiddleware');

// Toutes les routes livres sont protégées par JWT
router.use(authMiddleware);

/**
 * @openapi
 * /books:
 *   post:
 *     tags: [Books]
 *     summary: Créer un nouveau livre
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       201:
 *         description: Livre créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Token manquant ou invalide
 */
router.post('/', bookController.createBook);

/**
 * @openapi
 * /books:
 *   get:
 *     tags: [Books]
 *     summary: Lister tous les livres (avec filtres optionnels)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filtrer par genre
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filtrer par année
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filtrer par auteur
 *     responses:
 *       200:
 *         description: Liste des livres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       401:
 *         description: Token manquant ou invalide
 */
router.get('/', bookController.getBooks);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     tags: [Books]
 *     summary: Récupérer un livre par son ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du livre
 *     responses:
 *       200:
 *         description: Détails du livre
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Livre non trouvé
 */
router.get('/:id', bookController.getBookById);

/**
 * @openapi
 * /books/{id}:
 *   put:
 *     tags: [Books]
 *     summary: Modifier un livre (propriétaire ou admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du livre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       200:
 *         description: Livre modifié avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Non autorisé (pas le propriétaire)
 *       404:
 *         description: Livre non trouvé
 */
router.put('/:id', bookController.updateBook);

/**
 * @openapi
 * /books/{id}:
 *   delete:
 *     tags: [Books]
 *     summary: Supprimer un livre (propriétaire ou admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du livre
 *     responses:
 *       200:
 *         description: Livre supprimé avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Non autorisé (pas le propriétaire)
 *       404:
 *         description: Livre non trouvé
 */
router.delete('/:id', bookController.deleteBook);

/**
 * @openapi
 * /books/{id}/like:
 *   post:
 *     tags: [Books]
 *     summary: Liker un livre
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du livre
 *     responses:
 *       200:
 *         description: Like ajouté
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 likesCount:
 *                   type: integer
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Livre non trouvé
 */
router.post('/:id/like', bookController.likeBook);

module.exports = router;
