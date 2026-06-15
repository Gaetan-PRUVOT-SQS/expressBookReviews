# Online Book Review — Express RESTful API

Final project for the IBM *Node.js & Express* course. A server-side RESTful web
service that stores, retrieves and manages book ratings and reviews, with
**JWT + session** authentication for protected operations.

> Forked from `ibm-developer-skills-network/expressBookReview`.

## Setup

```bash
npm install
npm start          # starts the server on http://localhost:5000
```

> macOS note: port 5000 is used by the AirPlay Receiver. Run on another port with
> `PORT=5001 npm start` (and `BASE_URL=http://localhost:5001 npm run tasks`).

## Endpoints

### Public (general users)

| Method | Route | Description | Task |
|--------|-------|-------------|------|
| GET  | `/`               | List all books                  | 1 |
| GET  | `/isbn/:isbn`     | Book details by ISBN            | 2 |
| GET  | `/author/:author` | Books by author                | 3 |
| GET  | `/title/:title`   | Books by title                 | 4 |
| GET  | `/review/:isbn`   | Reviews for a book             | 5 |
| POST | `/register`       | Register a new user            | 6 |

### Authenticated (registered users — under `/customer`)

| Method | Route | Description | Task |
|--------|-------|-------------|------|
| POST   | `/customer/login`              | Log in (returns JWT in session) | 7 |
| PUT    | `/customer/auth/review/:isbn`  | Add / modify own review (`?review=...`) | 8 |
| DELETE | `/customer/auth/review/:isbn`  | Delete own review | 9 |

## Axios client (Tasks 10–13)

`tasks.js` consumes the API from Node using **async/await** (get all books) and
**Promises** (search by ISBN / author / title).

```bash
npm start                  # terminal 1
npm run tasks              # terminal 2
```

## Sample cURL commands

```bash
# Task 1
curl http://localhost:5000/

# Task 2
curl http://localhost:5000/isbn/1

# Task 3
curl "http://localhost:5000/author/Jane%20Austen"

# Task 4
curl "http://localhost:5000/title/Fairy%20tales"

# Task 5
curl http://localhost:5000/review/1

# Task 6 — register
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"secret123"}'

# Task 7 — login (save session cookie)
curl -c cookies.txt -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"secret123"}'

# Task 8 — add / modify a review
curl -b cookies.txt -X PUT \
  "http://localhost:5000/customer/auth/review/1?review=An%20absolute%20classic."

# Task 9 — delete the review
curl -b cookies.txt -X DELETE http://localhost:5000/customer/auth/review/1
```

Saved command outputs for each task live in `outputs/`.

## Project structure

```
final_project/
├── index.js              # Express app, session + JWT middleware
├── tasks.js              # Axios client (Tasks 10–13)
├── package.json
├── router/
│   ├── booksdb.js        # preloaded book data
│   ├── general.js        # public routes (Tasks 1–6)
│   └── auth_users.js     # auth routes: login + review CRUD (Tasks 7–9)
└── outputs/              # saved cURL outputs per task
```
