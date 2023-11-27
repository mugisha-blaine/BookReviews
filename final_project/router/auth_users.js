const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    return username.trim().length > 0;
};

const authenticatedUser = (username, password) => {
    // Assuming users are stored in an array of objects with 'username' and 'password' properties
    const foundUser = users.find(user => user.username === username && user.password === password);
  
    return !!foundUser; // Returns true if user is found, false otherwise
  };
  
// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if the provided username is valid
  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid username" });
  }

  // Check if the provided username and password match the records
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Create a JWT token
  const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });

  // Save the user credentials for the session (for demonstration purposes)
  req.user = { username, token };

  // Return the token in the response
  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { username, token } = req.user; // Retrieve username and token from the session (assuming it exists)
  const { review } = req.query; // Get review from the request query
  const isbn = req.params.isbn; // Get ISBN from the URL parameters

  // Find the book by ISBN in the books database (assuming books is an array of objects)
  const bookIndex = books.findIndex(book => book.isbn === isbn);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has already posted a review for this ISBN
  const existingReviewIndex = books[bookIndex].reviews.findIndex(
    rev => rev.username === username
  );

  if (existingReviewIndex !== -1) {
    // If the user has already posted a review, modify the existing one
    books[bookIndex].reviews[existingReviewIndex].review = review;
    return res.status(200).json({ message: "Review modified successfully" });
  } else {
    // If the user has not posted a review for this ISBN, add a new review
    books[bookIndex].reviews.push({ username, review });
    return res.status(200).json({ message: "Review added successfully" });
  }
});
 
 

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;