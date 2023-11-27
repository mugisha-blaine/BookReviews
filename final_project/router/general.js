const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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
  try {
    // Simulating fetching the list of books (from a local array in this case)
    const booksString = JSON.stringify(books, null, 2); // Convert books array/object to a nicely formatted string
    return res.status(200).send(`${booksString}`); // Send the formatted list of books
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).send('Error fetching books'); // Sending an error response if fetching fails
  }
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
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const requestedAuthor = req.params.author; // Retrieve the author from request parameters

  // Create a Promise to filter books by author
  const findBooksByAuthor = new Promise((resolve, reject) => {
    const booksByAuthor = books.filter(book => book.author === requestedAuthor);
    if (booksByAuthor.length === 0) {
      reject("Books by this author not found");
    } else {
      resolve(booksByAuthor);
    }
  });

  // Using Promise callbacks with Axios
  findBooksByAuthor
    .then(booksByAuthor => {
      return res.status(200).json({ books: booksByAuthor });
    })
    .catch(error => {
      return res.status(404).json({ message: error });
    });
});

  

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const requestedTitle = req.params.title.toLowerCase(); // Retrieve the title from request parameters

  // Create a Promise to filter books by title
  const findBooksByTitle = new Promise((resolve, reject) => {
    const booksByTitle = books.filter(book => book.title.toLowerCase().includes(requestedTitle));
    if (booksByTitle.length === 0) {
      reject("Books with this title not found");
    } else {
      resolve(booksByTitle);
    }
  });

  // Using Promise callbacks with Axios
  findBooksByTitle
    .then(booksByTitle => {
      return res.status(200).json({ books: booksByTitle });
    })
    .catch(error => {
      return res.status(404).json({ message1: error });
    });
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

