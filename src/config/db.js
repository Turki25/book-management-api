// src/config/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path for the database file
const dbPath = path.resolve(__dirname, '../../data/database.sqlite');

// Initialize and connect to the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');

    // Create the "books" table if it doesn't already exist
    db.run(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        publishedDate TEXT,
        numberOfPages INTEGER,
        UNIQUE(title, author)  -- Ensure unique combination of title and author
      )
    `, (err) => {
      if (err) {
        console.error('Error creating books table:', err.message);
      } else {
        console.log('Books table is ready.');
      }
    });
  }
});

module.exports = db;