const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/customer/login", (req, res) => {
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
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
