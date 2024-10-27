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
  
    // update: (id, bookData, callback) => {
    //   const { title, author, publishedDate, numberOfPages } = bookData;
    //   db.run(
    //     `UPDATE books SET title = ?, author = ?, publishedDate = ?, numberOfPages = ? WHERE id = ?`,
    //     [title, author, publishedDate, numberOfPages, id],
    //     function (err) {
    //       if (err) {
    //         console.error('Error updating book:', err);
    //         return callback(err);
    //       }
    //       callback(null, { id, ...bookData });
    //     }
    //   );
    // },
    update: (id, bookData, callback) => {
      const updates = [];
      const params = [];
    
      // Check if each property exists in bookData and build the updates array
      if (bookData.title) {
        updates.push('title = ?');
        params.push(bookData.title);
      }
      if (bookData.author) {
        updates.push('author = ?');
        params.push(bookData.author);
      }
      if (bookData.publishedDate) {
        updates.push('publishedDate = ?');
        params.push(bookData.publishedDate);
      }
      if (bookData.numberOfPages !== undefined) { // Check for undefined to allow 0
        updates.push('numberOfPages = ?');
        params.push(bookData.numberOfPages);
      }
    
      // If no updates are available, return an error
      if (updates.length === 0) {
        return callback(new Error('No valid fields to update'));
      }
    
      // Join the updates array to create the SET clause
      const sql = `UPDATE books SET ${updates.join(', ')} WHERE id = ?`;
      params.push(id); // Add id to the parameters
    
      db.run(sql, params, function (err) {
        if (err) {
          console.error('Error updating book:', err);
          return callback(err);
        }
        callback(null, { id, ...bookData });
      });
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
