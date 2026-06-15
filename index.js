const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

// Session middleware applied to every route under /customer.
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

// JWT guard for the authenticated customer routes (anything under /customer/auth/*).
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    const token = req.session.authorization["accessToken"];
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated. Invalid token." });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in." });
  }
});

const PORT = process.env.PORT || 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
