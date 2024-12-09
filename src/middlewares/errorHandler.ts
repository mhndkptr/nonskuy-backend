import { NextFunction, Request, Response } from "express";

class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 422;
  }
}

class AuthenticationError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = 401;
  }
}

const errorHandler = (err: Error & { statusCode?: number }, req: Request, res: Response, next: NextFunction) => {
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || "Something went wrong";
  res.status(errStatus).json({
    status: false,
    statusCode: errStatus,
    message: errMsg,
  });
};

class AccountLockedError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "AccountLockedError";
    this.statusCode = 403;
  }
}

class InternalServerError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = 500;
  }
}

export default {
  NotFoundError,
  ValidationError,
  AuthenticationError,
  AccountLockedError,
  InternalServerError,
  errorHandler,
};
