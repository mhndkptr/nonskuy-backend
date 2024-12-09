import Movie from "../models/movieModel";
import errorHandler from "../middlewares/errorHandler";
import { IMovie } from "../interfaces/movieInterface";
import { $Enums } from "@prisma/client";
import { createMovieSchema, updateMovieSchema, movieIdSchema } from "../validation/movieSchema";

const NotFoundError = errorHandler.NotFoundError;
const ValidationError = errorHandler.ValidationError;

const movieService = {
  getAllMovies: async () => {
    const movies = await Movie.findAll();
    if (movies.length === 0) {
      throw new NotFoundError("No movies found");
    }
    return movies;
  },

  getMovie: async (id: string) => {
    const { error } = movieIdSchema.validate({ id });
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const movie = await Movie.findById(id);
    if (!movie) {
      throw new NotFoundError("Movie not found");
    }

    return movie;
  },

  createMovie: async (title: string, description: string, rating: string, genre: string, posterUri: string, backdropUri: string, trailerUri: string, releaseDate: string) => {
    const { error } = createMovieSchema.validate({
      title,
      description,
      rating: parseFloat(rating),
      genre,
      posterUri,
      backdropUri,
      trailerUri,
      releaseDate: new Date(releaseDate),
    });

    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const data: {
      title: string;
      description: string;
      rating: number;
      genre: string;
      posterUri: string;
      backdropUri: string;
      trailerUri: string;
      releaseDate: Date;
    } = {
      title,
      description,
      rating: parseFloat(rating),
      genre,
      posterUri,
      backdropUri,
      trailerUri,
      releaseDate: new Date(releaseDate),
    };

    const newMovie = await Movie.create(data);

    return newMovie;
  },

  updateMovie: async (id: string, title?: string, description?: string, rating?: number, genre?: string, posterUri?: string, backdropUri?: string, trailerUri?: string, releaseDate?: Date) => {
    const { error: idError } = movieIdSchema.validate({ id });
    if (idError) {
      throw new ValidationError(idError.details[0].message);
    }

    const movieData = await Movie.findById(id);
    if (!movieData) {
      throw new NotFoundError("Movie not found");
    }

    const { error } = updateMovieSchema.validate({
      title,
      description,
      rating,
      genre,
      posterUri,
      backdropUri,
      trailerUri,
      releaseDate,
    });
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const updatedData: Partial<IMovie> = {
      title,
      description,
      rating,
      genre,
      posterUri,
      backdropUri,
      trailerUri,
      releaseDate,
    };

    const updatedMovie = await Movie.update(id, updatedData);
    return updatedMovie;
  },

  deleteMovie: async (id: string) => {
    const { error } = movieIdSchema.validate({ id });
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const movie = await Movie.findById(id);
    if (!movie) {
      throw new NotFoundError("Movie not found");
    }

    await Movie.delete(id);
  },
};

export default movieService;
