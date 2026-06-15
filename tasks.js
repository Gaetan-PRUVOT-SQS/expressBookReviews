// Tasks 10-13: consume the Book Review REST API from Node.js using Axios.
// Start the server first (`npm start`) in another terminal, then run `node tasks.js`.
const axios = require("axios");

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// Task 10: Get all books – using an async callback function.
async function getAllBooks() {
  const response = await axios.get(`${BASE_URL}/`);
  return response.data;
}

// Task 11: Search by ISBN – using Promises.
function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/isbn/${isbn}`)
      .then((response) => resolve(response.data))
      .catch((err) => reject(err));
  });
}

// Task 12: Search by Author – using Promises.
function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/author/${encodeURIComponent(author)}`)
      .then((response) => resolve(response.data))
      .catch((err) => reject(err));
  });
}

// Task 13: Search by Title – using Promises.
function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/title/${encodeURIComponent(title)}`)
      .then((response) => resolve(response.data))
      .catch((err) => reject(err));
  });
}

// Demonstration runner.
(async () => {
  try {
    console.log("=== Task 10: Get all books (async/await) ===");
    console.log(await getAllBooks());

    console.log("\n=== Task 11: Get book by ISBN 1 (Promise) ===");
    console.log(await getBookByISBN(1));

    console.log("\n=== Task 12: Get books by author 'Jane Austen' (Promise) ===");
    console.log(await getBooksByAuthor("Jane Austen"));

    console.log("\n=== Task 13: Get books by title 'Fairy tales' (Promise) ===");
    console.log(await getBooksByTitle("Fairy tales"));
  } catch (err) {
    console.error("Error:", err.message);
  }
})();

module.exports = { getAllBooks, getBookByISBN, getBooksByAuthor, getBooksByTitle };
