const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Use the session middleware before your route handlers
app.use(session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

app.use("/customer/auth/*", function auth(req, res, next) {
  // Write the authentication mechanism here
  if (req.session && req.session.user) {
    // If the session contains user data, the user is authenticated
    next(); // Proceed to the next middleware or route
  } else {
    // If session data is not present or invalid, send a 401 Unauthorized status
    res.status(401).json({ message: 'Unauthorized: Session authentication failed' });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
