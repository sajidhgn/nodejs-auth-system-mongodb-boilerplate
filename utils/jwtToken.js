const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};

const generateRefreshToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  });
};

const generateHashedPassword = async (password) => {
    const saltRounds = 10;
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error('Error hashing password');
    }
  };

  const generateRandomPassword = (length) => {
    const possibleChars = "0123456789";
    return Array.from({ length }, () =>
        possibleChars.charAt(Math.floor(Math.random() * possibleChars.length))
    ).join("");
};

module.exports = { generateHashedPassword, generateAccessToken, generateRefreshToken, generateRandomPassword };