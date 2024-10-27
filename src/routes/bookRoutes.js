const express = require('express');
const bookController = require('../controllers/bookController');
const router = express.Router();

router.get('/books', bookController.getAll);
router.get('/books/:id', bookController.getById);
router.post('/books', bookController.add);
router.put('/books/:id', bookController.update);
router.delete('/books/:id', bookController.delete);

module.exports = router;