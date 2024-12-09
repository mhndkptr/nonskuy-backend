import movieService from "../services/movieService";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const movieController = {
  index: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movies = await movieService.getAllMovies();
      res.status(200).json({
        status: true,
        statusCode: res.statusCode,
        message: "Movies successfully found",
        data: {
          movies: movies,
        },
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

  show: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const movie = await movieService.getMovie(id);
      res.status(200).json({
        status: true,
        statusCode: res.statusCode,
        message: "Movie successfully found",
        data: {
          movie: movie,
        },
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

  store: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authToken = req.headers["authorization"];
      const token = authToken && authToken.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          status: false,
          statusCode: 401,
          message: "Authorization token is required",
        });
      }

      const decoded = jwt.verify(token, process.env.APP_JWT_SECRET as string);
      const { title, description, rating, genre, posterUri, backdropUri, trailerUri, releaseDate } = req.body;

      const newMovie = await movieService.createMovie(title, description, rating, genre, posterUri, backdropUri, trailerUri, releaseDate);

      res.status(201).json({
        status: true,
        statusCode: res.statusCode,
        message: "Movie successfully created",
        data: {
          movie: newMovie,
        },
      });
    } catch (error: any) {
      if (error.statusCode) {
        res.status(error.statusCode).json({
          status: false,
          statusCode: error.statusCode,
          message: error.message,
        });
      } else if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          status: false,
          statusCode: 401,
          message: "Invalid token",
        });
      } else {
        next(error);
      }
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authToken = req.headers["authorization"];
      const token = authToken && authToken.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          status: false,
          statusCode: 401,
          message: "Authorization token is required",
        });
      }

      const decoded = jwt.verify(token, process.env.APP_JWT_SECRET as string);
      const { id } = req.params;
      const { title, description, rating, genre, posterUri, backdropUri, trailerUri, releaseDate } = req.body;

      const updatedMovie = await movieService.updateMovie(id, title, description, rating, genre, posterUri, backdropUri, trailerUri, releaseDate);
      res.status(200).json({
        status: true,
        statusCode: res.statusCode,
        message: "Movie successfully updated",
        data: {
          movie: updatedMovie,
        },
      });
    } catch (error: any) {
      if (error.statusCode) {
        res.status(error.statusCode).json({
          status: false,
          statusCode: error.statusCode,
          message: error.message,
        });
      } else if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          status: false,
          statusCode: 401,
          message: "Invalid token",
        });
      } else {
        next(error);
      }
    }
  },

  destroy: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authToken = req.headers["authorization"];
      const token = authToken && authToken.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          status: false,
          statusCode: 401,
          message: "Authorization token is required",
        });
      }

      const decoded = jwt.verify(token, process.env.APP_JWT_SECRET as string);
      const { id } = req.params;

      await movieService.deleteMovie(id);
      res.status(200).json({
        status: true,
        statusCode: res.statusCode,
        message: "Movie successfully deleted",
      });
    } catch (error: any) {
      if (error.statusCode) {
        res.status(error.statusCode).json({
          status: false,
          statusCode: error.statusCode,
          message: error.message,
        });
      } else if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          status: false,
          statusCode: 401,
          message: "Invalid token",
        });
      } else {
        next(error);
      }
    }
  },
};

export default movieController;
