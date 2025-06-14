const Joi = require('joi');

const registerValidation = (reqBody) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,30}$'))
      .message(
        'Password must be 8-30 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)'
      )
      .required(),
  });

  return schema.validate(reqBody);
};

module.exports = { registerValidation };