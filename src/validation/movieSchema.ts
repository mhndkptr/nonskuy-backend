import Joi from "joi";

export const createMovieSchema = Joi.object({
  imdbId: Joi.string().required(), // ID IMDb film
  title: Joi.string().required().min(1).max(100),
  originalTitle: Joi.string().optional().max(100), // Judul asli film
  overview: Joi.string().optional().min(10).max(500), // Deskripsi film
  voteCount: Joi.number().optional().min(0), // Jumlah suara
  voteAverage: Joi.number().optional().min(0).max(10), // Rata-rata suara
  budget: Joi.number().optional().min(0), // Anggaran film
  genre: Joi.string().required(), // Genre film
  popularity: Joi.number().optional().min(0), // Popularitas film
  revenue: Joi.number().optional().min(0), // Pendapatan film
  runtime: Joi.number().optional().min(0), // Durasi film
  spokenLang: Joi.string().optional(), // Bahasa yang digunakan
  originalLanguage: Joi.string().optional(), // Bahasa asli film
  homepageUri: Joi.string().required().uri(), // URL homepage film
  status: Joi.string().optional(), // Status film
  tagline: Joi.string().optional(), // Tagline film
  posterUri: Joi.string().optional().uri(), // URL poster film
  backdropUri: Joi.string().optional().uri(), // URL backdrop film
  trailerUri: Joi.string().optional().uri(), // URL trailer film
  releaseDate: Joi.date().required(), // Tanggal rilis film
});

export const updateMovieSchema = Joi.object({
  title: Joi.string().optional().min(1).max(100),
  originalTitle: Joi.string().optional().max(100), // Judul asli film
  overview: Joi.string().optional().min(10).max(500), // Deskripsi film
  voteCount: Joi.number().optional().min(0), // Jumlah suara
  voteAverage: Joi.number().optional().min(0).max(10), // Rata-rata suara
  budget: Joi.number().optional().min(0), // Anggaran film
  genre: Joi.string().optional(), // Genre film
  popularity: Joi.number().optional().min(0), // Popularitas film
  revenue: Joi.number().optional().min(0), // Pendapatan film
  runtime: Joi.number().optional().min(0), // Durasi film
  spokenLang: Joi.string().optional(), // Bahasa yang digunakan
  originalLanguage: Joi.string().optional(), // Bahasa asli film
  homepageUri: Joi.string().optional().uri(), // URL homepage film
  status: Joi.string().optional(), // Status film
  tagline: Joi.string().optional(), // Tagline film
  posterUri: Joi.string().optional().uri(), // URL poster film
  backdropUri: Joi.string().optional().uri(), // URL backdrop film
  trailerUri: Joi.string().optional().uri(), // URL trailer film
  releaseDate: Joi.date().optional(), // Tanggal rilis film
});

export const movieIdSchema = Joi.object({
  id: Joi.string().required(), // ID film
});

export const searchMovieSchema = Joi.object({
  query: Joi.string().required(), // Query pencarian
  option: Joi.object({
    totalRecordUse: Joi.number().integer().min(0).required(), // Validasi untuk totalRecordUse
  }).required(), // Pastikan option juga diperlukan
});
