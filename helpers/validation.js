const Joi = require('@hapi/joi');

const signUpValidation = (data) => {
  const signUpSchema = Joi.object({
    username: Joi.string().min(6).required(),
    email: Joi.string().min(3).required().email(),
    password: Joi.string().min(6).required(),
    fullName: Joi.string(),
  });
  return signUpSchema.validate(data);
};

const signInValidation = (data) => {
  const loginSchema = Joi.object({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
  });

  return loginSchema.validate(data);
};

const passwordValidation = (data) => {
  const passwordSchema = Joi.object({
    password: Joi.string().min(6).required(),
  })

  return passwordSchema.validate(data);
}

const emailValidation = (data) => {
  const emailSchema = Joi.object({
    email: Joi.string().min(3).required().email(),
  })

  return emailSchema.validate(data);
}

module.exports = {
  signUpValidation: signUpValidation,
  signInValidation: signInValidation,
  passwordValidation: passwordValidation,
  emailValidation: emailValidation,
};
