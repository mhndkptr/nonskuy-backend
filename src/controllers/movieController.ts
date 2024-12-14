import movieService from "../services/movieService";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const movieController = {
  index: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { movies, totalMovies, totalPages } = await movieService.getAllMovies(page, limit);

      const formattedMovies = movies.map((movie) => ({
        ...movie,
        genre: JSON.parse(movie.genre),
        spokenLang: movie.spokenLang ? JSON.parse(movie.spokenLang) : [],
      }));

      res.status(200).json({
        status: true,
        statusCode: res.statusCode,
        message: "Movies successfully found",
        data: {
          movies: formattedMovies,
          pagination: {
            totalMovies,
            totalPages,
            currentPage: page,
            limit,
          },
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
      const { imdbId, title, originalTitle, overview, voteCount, voteAverage, budget, genre, popularity, revenue, runtime, spokenLang, originalLanguage, homepageUri, status, tagline, posterUri, backdropUri, trailerUri, releaseDate } =
        req.body;

      const newMovie = await movieService.createMovie(
        imdbId,
        title,
        originalTitle,
        overview,
        voteCount,
        voteAverage,
        budget,
        genre,
        popularity,
        revenue,
        runtime,
        spokenLang,
        originalLanguage,
        homepageUri,
        status,
        tagline,
        posterUri,
        backdropUri,
        trailerUri,
        releaseDate
      );

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
      const { title, originalTitle, overview, voteCount, voteAverage, budget, genre, popularity, revenue, runtime, spokenLang, originalLanguage, homepageUri, status, tagline, posterUri, backdropUri, trailerUri, releaseDate } = req.body;

      const updatedMovie = await movieService.updateMovie(
        id,
        title,
        originalTitle,
        overview,
        voteCount,
        voteAverage,
        budget,
        genre,
        popularity,
        revenue,
        runtime,
        spokenLang,
        originalLanguage,
        homepageUri,
        status,
        tagline,
        posterUri,
        backdropUri,
        trailerUri,
        releaseDate
      );
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

  search: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query, totalRecordUse } = req.body;

      const option = {
        totalRecordUse: parseInt(totalRecordUse),
      };
      const { analytics, results } = await movieService.searchMovie(query, option);
      res.status(200).json({
        status: true,
        statusCode: res.statusCode,
        message: "Search Success",
        data: {
          movies: results,
          analytics: analytics,
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
};

export default movieController;
