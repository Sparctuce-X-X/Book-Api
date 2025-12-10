const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');
const authMiddleware = require('../middlewares/authMiddleware');

// Toutes les routes livres sont protégées par JWT
router.use(authMiddleware);

router.post('/', bookController.createBook);
router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);
router.post('/:id/like', bookController.likeBook);

module.exports = router;
