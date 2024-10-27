const BookModel = require('../models/bookModel');

// Get all books
exports.getAll = (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const size = parseInt(req.query.size) || 20; // Default to size 20

    BookModel.getAll(page, size, (err, books) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ page: page, size: size, books });
    });
};

// Get a book by ID
exports.getById = (req, res) => {
    const { id } = req.params;
    BookModel.getById(id, (err, book) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ book });
    });
};

// Add a new book
exports.add = (req, res) => {
    const bookData = req.body;
    BookModel.add(bookData, (err, result) => {
        if (err) {
            // Check for unique constraint violation error
            if (err.message.includes("UNIQUE constraint failed")) {
                return res.status(409).json({ error: "This book already exists in the database. To update the existing entry, please use the PUT method with the book ID." });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ bookId: result.id });
    });
};

// Update an existing book
exports.update = (req, res) => {
    const { id } = req.params;
    const bookData = req.body;
    BookModel.update(id, bookData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.changes === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book updated successfully' });
    });
};

// Delete a book
exports.delete = (req, res) => {
    const { id } = req.params;
    BookModel.delete(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.changes === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    });
};
