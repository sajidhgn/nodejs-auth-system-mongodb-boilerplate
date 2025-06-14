require('dotenv').config();

const env = process.env;

const config = {
  nodeEnv: env.NODE_ENV || 'development',
  port: env.PORT || 3050,
  mongoUri: env.MONGO_URI || 'mongodb://localhost:27017/oxcody_db',
};

module.exports = config;