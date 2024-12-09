import { NextFunction, Request, Response } from "express";
import authService from "../services/authService";

const authController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, user } = await authService.login(req.body);
      res.status(200).json({
        status: true,
        statusCode: res.statusCode,
        message: "Login successful",
        data: { token, user: user },
      });
    } catch (error: any) {
      if (error.statusCode) {
        res.status(error.statusCode).json({
          status: false,
          statusCode: error.statusCode,
          message: error.message,
        });
      } else {
        next(error);
      }
    }
  },
};

export default authController;
