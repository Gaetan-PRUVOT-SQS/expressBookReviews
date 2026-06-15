const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

// In-memory list of registered users.
let users = [];

// Returns true when the username is NOT already taken (i.e. it is valid to register).
const isValid = (username) => {
  return !users.some((user) => user.username === username);
};

// Returns true when a user with matching username AND password exists.
const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// Task 7: Login as a registered user.
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login. Check username and password." });
  }

  // Sign a JWT and store it (plus the username) in the session.
  const accessToken = jwt.sign({ username }, "access", { expiresIn: 60 * 60 });
  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: "User successfully logged in." });
});

// Task 8: Add or modify a book review (logged in users only).
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in." });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
  if (!review) {
    return res.status(400).json({ message: "A 'review' query parameter is required." });
  }

  // One review per user per book — re-submitting overwrites the previous one.
  const existed = Object.prototype.hasOwnProperty.call(books[isbn].reviews, username);
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: existed
      ? `Review for ISBN ${isbn} successfully modified.`
      : `Review for ISBN ${isbn} successfully added.`,
    reviews: books[isbn].reviews,
  });
});

// Task 9: Delete a book review (only the user's own review).
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in." });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "You have no review to delete for this book." });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: `Review for ISBN ${isbn} posted by ${username} deleted.`,
    reviews: books[isbn].reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
