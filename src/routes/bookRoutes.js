const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/auth');

// Public routes
router.get('/books', bookController.getAll); // Allow unauthenticated access
router.get('/books/:id', bookController.getById); // Allow unauthenticated access

// Protected routes
router.post('/books', auth, bookController.add); // Require authentication
router.put('/books/:id', auth, bookController.update); // Require authentication
router.delete('/books/:id', auth, bookController.delete); // Require authentication

module.exports = router;
