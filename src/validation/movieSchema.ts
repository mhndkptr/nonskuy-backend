import Joi from "joi";

export const createMovieSchema = Joi.object({
  title: Joi.string().required().min(1).max(100),
  description: Joi.string().required().min(10).max(500),
  rating: Joi.number().required().min(0).max(10),
  genre: Joi.string().required(),
  posterUri: Joi.string().optional().uri(),
  backdropUri: Joi.string().optional().uri(),
  trailerUri: Joi.string().optional().uri(),
  releaseDate: Joi.date().required(),
});

export const updateMovieSchema = Joi.object({
  title: Joi.string().optional().min(1).max(100),
  description: Joi.string().optional().min(10).max(500),
  rating: Joi.number().optional().min(0).max(10),
  genre: Joi.string().optional(),
  posterUri: Joi.string().uri().optional(),
  backdropUri: Joi.string().uri().optional(),
  trailerUri: Joi.string().uri().optional(),
  releaseDate: Joi.date().optional(),
});

export const movieIdSchema = Joi.object({
  id: Joi.string().required(),
});

export const searchMovieSchema = Joi.object({
  query: Joi.string().required(),
});
