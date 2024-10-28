const db = require('../config/db');

const Book = {

  getAll: (page, size, callback) => {
    const offset = (page - 1) * size; // Calculate offset

    db.all('SELECT * FROM books LIMIT ? OFFSET ?', [size, offset], (err, rows) => {
      if (err) {
        console.error('Error fetching books:', err);
        return callback(err);
      }
      callback(null, rows);
    });
  },

  getById: (id, callback) => {
    db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Error fetching book by ID:', err);
        return callback(err);
      }
      callback(null, row);
    });
  },
  
  add: (book, callback) => {
    const { title, author, publishedDate, numberOfPages } = book;
    db.run(
      `INSERT INTO books (title, author, publishedDate, numberOfPages) VALUES (?, ?, ?, ?)`,
      [title, author, publishedDate, numberOfPages],
      function (err) {
        if (err) {
          console.error('Error adding book:', err);
          return callback(err);
        }
        callback(null, { id: this.lastID, ...book });
      }
    );
  },
  
  update: (id, bookData, callback) => {
    const updates = [];
    const params = [];

    // Construct the update statement based on the provided fields
    for (const [key, value] of Object.entries(bookData)) {
      if (value !== undefined) { // Check for undefined to include the field
        updates.push(`${key} = ?`);
        params.push(value);
      }
    }

    // If there are no fields to update, return an error
    if (updates.length === 0) {
      return callback(new Error('No valid fields to update'));
    }

    // Construct the SQL query
    const sql = `UPDATE books SET ${updates.join(', ')} WHERE id = ?`;
    params.push(id); // Add the book ID to the parameters

    db.run(sql, params, function (err, row) {
      if (err) {
        console.error('Error updating book:', err);
        return callback(err);
      }

      // Retrieve the updated row
      const selectSql = `SELECT * FROM books WHERE id = ?`;
      db.get(selectSql, [id], (err, row) => {
        if (err) {
          console.error('Error retrieving updated book:', err);
          return callback(err);
        }

        // Pass the updated row to the callback
        callback(null, row, this.changes);

      });
    },
    )
  },

  delete: (id, callback) => {
    db.run(`DELETE FROM books WHERE id = ?`, [id], function (err) {
      if (err) {
        console.error('Error deleting book:', err);
        return callback(err);
      }
      callback(null, { deletedId: id });
    });
  }
};


module.exports = Book;
