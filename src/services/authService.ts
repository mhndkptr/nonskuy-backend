import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IUser } from "../interfaces/userInterface";
import { ILoginData } from "../interfaces/authInterface";
import { loginSchema } from "../validation/authSchema";
import User from "../models/userModel";
const { ValidationError, AuthenticationError, InternalServerError } = require("../middlewares/errorHandler");
require("dotenv").config();

const generateUserToken = (user: IUser) => {
  const secret = process.env.APP_JWT_SECRET;

  if (!secret) {
    throw new InternalServerError("JWT secret is not defined in the environment variables");
  }

  return jwt.sign({ id: user.id }, secret, {
    expiresIn: "1h",
  });
};

const authService = {
  login: async (loginData: ILoginData) => {
    const { error } = loginSchema.validate(loginData);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const { email, password } = loginData;
    const user = await User.findByEmail(email);

    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new AuthenticationError("Invalid password");
    }

    const token = generateUserToken(user);

    return { token: token, user: user };
  },
};

export default authService;
