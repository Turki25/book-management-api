const BookModel = require('../models/bookModel');

// Get all books
exports.getAll = (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const size = parseInt(req.query.size) || 20; // Default to size 20

    BookModel.getAll(page, size, (err, books) => {
        if (err) {
            return res.status(500).json({
                meta: {
                    timestamp: new Date().toISOString(),  // Include the timestamp,
                    status: "error"
                }, error: {
                    code: err.code,
                    message: err.message,
                }
            });
        }
        res.json({
            meta: {
                page: page,
                size: size,
                timestamp: new Date().toISOString(),
                status: "success"
            },
            data: books
        });
    });
};

// Get a book by ID
exports.getById = (req, res) => {
    const { id } = req.params;
    BookModel.getById(id, (err, book) => {
        if (err) {
            return res.status(500).json({
                meta: {
                    timestamp: new Date().toISOString(),
                    status: "error"
                },
                error: {
                    code: err.code,
                    message: err.message,
                }
            });
        }
        if (!book) {
            return res.status(404).json({
                meta: {
                    timestamp: new Date().toISOString(),
                    status: "error"
                },
                error: {
                    code: "BOOK_NOT_FOUND",  // Custom error code for book not found
                    message: "The requested book was not found in the database.",  // More specific message
                }
            });
        }
        res.json({
            meta: {
                timestamp: new Date().toISOString(),
                status: "success"
            },
            data: book
        });
    });
};

// Add a new book
exports.add = (req, res) => {
    const bookData = req.body;
    BookModel.add(bookData, (err, result) => {
        if (err) {
            // Check for unique constraint violation error
            if (err.message.includes("UNIQUE constraint failed")) {
                return res.status(409).json({
                    meta: {
                        timestamp: new Date().toISOString(),
                        status: "error"
                    }, error: {
                        code: "BOOK_ALREADY_EXISTS",
                        message: "This book already exists in the database.",
                        suggestion: "To update the existing entry, please use the PUT method with the book ID."
                    }
                })
            }
            if (err.message.includes("NOT NULL constraint failed")) {
                return res.status(400).json({
                    meta: {
                        timestamp: new Date().toISOString(),
                        status: "error"
                    },
                    error: { code: "REQUIRED_FIELD_MISSING", message: "A required field is missing.", }
                });
            }
            return res.status(500).json({
                meta: {
                    timestamp: new Date().toISOString(),
                    status: "error"
                }, error: { code: err.code, message: err.message, }
            });
        }
        res.status(201).json({
            meta: {
                timestamp: new Date().toISOString(),
                status: "success"
            },
            data: result
        });
    });
};

// Update an existing book
exports.update = (req, res) => {
    const { id } = req.params;
    const bookData = req.body;
    BookModel.update(id, bookData, (err, result , changes) => {
        if (err) {
            return res.status(500).json({
                meta: {
                    timestamp: new Date().toISOString(),
                    status: "error"
                }, error: {
                    code: err.code,
                    message: err.message,
                }
            });
        }

        if (changes === 0) {
            return res.status(404).json({
                meta: {
                    timestamp: new Date().toISOString(),
                    status: "error"
                },
                error: {
                    code: "BOOK_NOT_FOUND",
                    message: "The specified book could not be found. Please check the provided ID."
                }
            }
            );
        }
        
        res.json({
            meta: {
                timestamp: new Date().toISOString(),
                status: "success"
            },
            data: result
        });
    });
};

// Delete a book
exports.delete = (req, res) => {
    const { id } = req.params;
    BookModel.delete(id, (err, result) => {
        if (err) {
            return res.status(500).json(
                {
                    meta: {
                        timestamp: new Date().toISOString(),
                        status: "error"
                    },
                    error: {
                        code: err.code,
                        message: err.message,
                    }
                }
            );
        }
        if (result.changes === 0) {
            return res.status(404).json({
                meta: {
                    timestamp: new Date().toISOString(),
                    status: "error"
                },
                error: {
                    code: "BOOK_NOT_FOUND",
                    message: "The specified book could not be found. Please check the provided ID."
                }
            });
        }
        res.json({
            meta: {
                timestamp: new Date().toISOString(),
                status: "success"
            },
            data: {
                message: "Book deleted successfully",
                deletedBookId: id // the ID of the deleted book for reference
            }
        });
    });
};
