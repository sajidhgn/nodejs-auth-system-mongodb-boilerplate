const cors = require("cors");
const {allowedOrigins} = require("../constants/allowOrigins");

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Access denied by CORS policy for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

module.exports = cors(corsOptions);
