import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(5).max(15).alphanum(),
});

export const changePasswordSchema = Joi.object({
  old_password: Joi.string().required().min(5).max(15).alphanum(),
  new_password: Joi.string().required().min(5).max(15).alphanum(),
});
