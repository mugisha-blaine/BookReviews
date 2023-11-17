const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required for registration" });
  }

  // Check if the username already exists in the users array
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists. Please choose a different username." });
  }

  // Add new user to the users array
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const booksString = JSON.stringify(books, null, 2); // Convert books array/object to a nicely formatted string
  return res.status(200).send(`${booksString}`); // Send the format
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const requestedISBN = req.params.isbn; // Retrieve the ISBN from request parameters
  const booksArray = Object.values(books);

  // Find the book with the matching ISBN in the 'books' array or database
  const bookWithISBN = booksArray.find(book => book.ISBN === requestedISBN);

  if (!bookWithISBN) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json({ book: bookWithISBN });
});

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const requestedAuthor = req.params.author; // Retrieve the author from request parameters
  const booksArray = Object.values(books); // Convert books object to an array of book objects
  const booksByAuthor = [];

  // Iterate through the books array to find books by the provided author
  booksArray.forEach(book => {
    if (book.author === requestedAuthor) {
      booksByAuthor.push(book);
    }
  });

  if (booksByAuthor.length === 0) {
    return res.status(404).json({ message: "Books by this author not found" });
  }

  return res.status(200).json({ books: booksByAuthor });
});
  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const requestedTitle = req.params.title; // Retrieve the title from request parameters
  const booksArray = Object.values(books); // Convert books object to an array of book objects
  const booksByTitle = [];

  // Iterate through the books array to find books with the provided title
  booksArray.forEach(book => {
    if (book.title.toLowerCase().includes(requestedTitle.toLowerCase())) {
      booksByTitle.push(book);
    }
  });

  if (booksByTitle.length === 0) {
    return res.status(404).json({ message: "Books with this title not found" });
  }

  return res.status(200).json({ books: booksByTitle });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const requestedISBN = req.params.isbn; // Retrieve the ISBN from request parameters
  const booksArray = Object.values(books); // Convert books object to an array of book objects
  const book = booksArray.find(book => book.ISBN === requestedISBN);

  if (!book || !book.reviews || book.reviews.length === 0) {
    return res.status(404).json({ message: "Book reviews not found for this ISBN" });
  }

  return res.status(200).json({ reviews: book.reviews });
});

module.exports.general = public_users;
