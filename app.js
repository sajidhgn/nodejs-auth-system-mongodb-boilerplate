const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const { allowedOrigins } = require("./constants/allowOrigins");
const routes = require("./routes");

const app = express();

// MongoDB connection URI
const MONGO_URI = "mongodb://localhost:27017/oxcody_db";

// CORS setup
const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
};
app.use(cors(corsOptions));

// Body parsers
app.use(express.json());
app.use(bodyParser.json());

// Session setup
app.use(session({
    secret: "dbe21daea8832fe9dbeb2c5292721cafbbace3f4da15550a0047e8f89733eb04",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false,
    }
}));

// Register routes
app.use("/api", routes);

module.exports = app;
