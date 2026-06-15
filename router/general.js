const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Base URL used by the Axios methods below (Tasks 10–13). It points at this
// same server's public endpoints. Override with the BASE_URL env variable.
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// Task 6: Register a new user.
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: `User ${username} successfully registered. You can now log in.` });
});

// Task 1: Get the list of all books (uses an async/Promise wrapper).
public_users.get("/", async (req, res) => {
  try {
    const getBooks = () => new Promise((resolve) => resolve(books));
    const allBooks = await getBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books.", error: err.message });
  }
});

// Task 2: Get book details based on ISBN (Promise based).
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject(new Error(`Book with ISBN ${isbn} not found.`));
    }
  })
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(404).json({ message: err.message }));
});

// Task 3: Get book details based on author (Promise based).
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const matches = {};
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
        matches[isbn] = books[isbn];
      }
    });
    if (Object.keys(matches).length > 0) {
      resolve(matches);
    } else {
      reject(new Error(`No books found for author ${author}.`));
    }
  })
    .then((matches) => res.status(200).send(JSON.stringify({ booksbyauthor: matches }, null, 4)))
    .catch((err) => res.status(404).json({ message: err.message }));
});

// Task 4: Get all books based on title (Promise based).
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const matches = {};
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
        matches[isbn] = books[isbn];
      }
    });
    if (Object.keys(matches).length > 0) {
      resolve(matches);
    } else {
      reject(new Error(`No books found with title ${title}.`));
    }
  })
    .then((matches) => res.status(200).send(JSON.stringify({ booksbytitle: matches }, null, 4)))
    .catch((err) => res.status(404).json({ message: err.message }));
});

// Task 5: Get the book reviews for a given ISBN.
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
  return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});

// ===========================================================================
// Task 10: Retrieve all books and details by ISBN / author / title using
// Axios with async/await and Promise callbacks.
// Start the server (`npm start`), then call these from a Node client.
// ===========================================================================

// Task 10 — Get all books (async/await with Axios).
const getAllBooks = async () => {
  const response = await axios.get(`${BASE_URL}/`);
  return response.data;
};

// Task 11 — Get book details by ISBN (Promise callbacks with Axios).
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/isbn/${isbn}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

// Task 12 — Get book details by author (Promise callbacks with Axios).
const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/author/${encodeURIComponent(author)}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

// Task 13 — Get book details by title (Promise callbacks with Axios).
const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/title/${encodeURIComponent(title)}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
