const express = require("express");
const cors = require("cors");
const { allowedOrigins } = require("./constants/allowOrigins")
const bodyParser = require("body-parser");
const routes = require("./routes");

const app = express();

// Middleware to handle Cross-Origin Resource Sharing (CORS)
const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
};
app.use(cors(corsOptions));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Body parser
app.use(bodyParser.json());

// Register API routes
app.use("/api", routes);

module.exports = app;
