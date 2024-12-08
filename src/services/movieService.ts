import Movie from "../models/movieModel";
import errorHandler from "../middlewares/errorHandler";
import { IMovie } from "../interfaces/movieInterface";
import { $Enums } from "@prisma/client";
import { createMovieSchema, updateMovieSchema, movieIdSchema, searchMovieSchema } from "../validation/movieSchema";

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

  searchMovie: async (query: string) => {
    const { error } = searchMovieSchema.validate({ query });

    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const linearSearch = (movies: any[], searchTerm: string) => {
      const results = [];
      for (const movie of movies) {
        if (movie.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push(movie);
        }
      }
      return results;
    };

    // const binarySearch = (movies: any[], searchTerm: string) => {
    //   let left = 0;
    //   let right = movies.length - 1;
    //   const results = [];

    //   while (left <= right) {
    //     const mid = Math.floor((left + right) / 2);
    //     const movie = movies[mid];

    //     if (movie.title.toLowerCase().includes(searchTerm.toLowerCase())) {
    //       results.push(movie);
    //       break;
    //     } else if (movie.title.toLowerCase() < searchTerm.toLowerCase()) {
    //       left = mid + 1;
    //     } else {
    //       right = mid - 1;
    //     }
    //   }
    //   return results;
    // };

    // const jumpSearch = (movies: any[], searchTerm: string) => {
    //   const n = movies.length;
    //   let step = Math.floor(Math.sqrt(n));
    //   let prev = 0;

    //   while (movies[Math.min(step, n) - 1].title.toLowerCase() < searchTerm.toLowerCase()) {
    //     prev = step;
    //     step += Math.floor(Math.sqrt(n));
    //     if (prev >= n) return [];
    //   }

    //   while (movies[prev].title.toLowerCase() < searchTerm.toLowerCase()) {
    //     prev++;
    //     if (prev === Math.min(step, n)) return [];
    //   }

    //   if (movies[prev].title.toLowerCase().includes(searchTerm.toLowerCase())) {
    //     return [movies[prev]];
    //   }

    //   return [];
    // };

    const binarySearch = (movies: any[], searchTerm: string) => {
      let left = 0;
      let right = movies.length - 1;
      const results = [];

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const movie = movies[mid];

        if (movie.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push(movie);

          // Mencari kemungkinan duplikat di sebelah kiri
          let leftIndex = mid - 1;
          while (leftIndex >= 0 && movies[leftIndex].title.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push(movies[leftIndex]);
            leftIndex--;
          }

          // Mencari kemungkinan duplikat di sebelah kanan
          let rightIndex = mid + 1;
          while (rightIndex < movies.length && movies[rightIndex].title.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push(movies[rightIndex]);
            rightIndex++;
          }
          break; // Keluar dari loop setelah menemukan semua hasil
        } else if (movie.title.toLowerCase() < searchTerm.toLowerCase()) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
      return results;
    };

    const jumpSearch = (movies: any[], searchTerm: string) => {
      const n = movies.length;
      let step = Math.floor(Math.sqrt(n));
      let prev = 0;
      const results = [];

      // Mencari blok yang mungkin mengandung searchTerm
      while (movies[Math.min(step, n) - 1].title.toLowerCase() < searchTerm.toLowerCase()) {
        prev = step;
        step += Math.floor(Math.sqrt(n));
        if (prev >= n) return [];
      }

      // Melakukan pencarian linear di dalam blok
      while (movies[prev].title.toLowerCase() < searchTerm.toLowerCase()) {
        prev++;
        if (prev === Math.min(step, n)) return [];
      }

      // Mencari semua film yang cocok
      while (prev < n && movies[prev].title.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push(movies[prev]);
        prev++;
      }

      return results;
    };

    const movies = await Movie.findAll();

    movies.sort((a, b) => a.title.localeCompare(b.title));

    const startLinear = performance.now();
    const linearResults = linearSearch(movies, query);
    const endLinear = performance.now();

    const startBinary = performance.now();
    const binaryResults = binarySearch(movies, query);
    const endBinary = performance.now();

    const startJump = performance.now();
    const jumpResults = jumpSearch(movies, query);
    const endJump = performance.now();

    console.log(binaryResults);
    console.log(jumpResults);

    const analytics = {
      linear: {
        executionTime: (endLinear - startLinear) / 1000,
        totalRecord: linearResults.length,
      },
      binary: {
        executionTime: (endBinary - startBinary) / 1000,
        totalRecord: binaryResults.length,
      },
      jump: {
        executionTime: (endJump - startJump) / 1000,
        totalRecord: jumpResults.length,
      },
    };

    return { analytics: analytics, results: linearResults };
  },
};

export default movieService;
