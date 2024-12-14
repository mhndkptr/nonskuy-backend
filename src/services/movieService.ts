import Movie from "../models/movieModel";
import errorHandler from "../middlewares/errorHandler";
import { IMovie } from "../interfaces/movieInterface";
import { $Enums, PrismaClient } from "@prisma/client";
import { createMovieSchema, updateMovieSchema, movieIdSchema, searchMovieSchema } from "../validation/movieSchema";

const NotFoundError = errorHandler.NotFoundError;
const ValidationError = errorHandler.ValidationError;
const prisma = new PrismaClient();

const movieService = {
  getAllMovies: async (page: number, limit: number) => {
    // const movies = await Movie.findAll();
    // if (movies.length === 0) {
    //   throw new NotFoundError("No movies found");
    // }

    const skip = (page - 1) * limit;
    const [movies, totalMovies] = await Promise.all([
      prisma.movie.findMany({
        skip,
        take: limit,
      }),
      prisma.movie.count(),
    ]);

    return { movies, totalMovies, totalPages: Math.ceil(totalMovies / limit) };
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

  createMovie: async (
    imdbId: string,
    title: string,
    originalTitle: string,
    overview: string | null,
    voteCount: number | null,
    voteAverage: number | null,
    budget: number | null,
    genre: string,
    popularity: number | null,
    revenue: number | null,
    runtime: number | null,
    spokenLang: string | null,
    originalLanguage: string | null,
    homepageUri: string,
    status: string | null,
    tagline: string | null,
    posterUri: string | null,
    backdropUri: string | null,
    trailerUri: string | null,
    releaseDate: string
  ) => {
    const { error } = createMovieSchema.validate({
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
      releaseDate: new Date(releaseDate),
    });

    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const data: {
      imdbId: string;
      title: string;
      originalTitle: string;
      overview?: string | null;
      voteCount?: number | null;
      voteAverage?: number | null;
      budget?: number | null;
      genre: string;
      popularity?: number | null;
      revenue?: number | null;
      runtime?: number | null;
      spokenLang?: string | null;
      originalLanguage?: string | null;
      homepageUri: string;
      status?: string | null;
      tagline?: string | null;
      posterUri?: string | null;
      backdropUri?: string | null;
      trailerUri?: string | null;
      releaseDate: Date;
    } = {
      imdbId,
      title,
      originalTitle,
      overview,
      voteCount,
      voteAverage,
      budget,
      genre: JSON.stringify(genre),
      spokenLang: JSON.stringify(spokenLang),
      popularity,
      revenue,
      runtime,
      originalLanguage,
      homepageUri,
      status,
      tagline,
      posterUri,
      backdropUri,
      trailerUri,
      releaseDate: new Date(releaseDate),
    };

    const newMovie = await Movie.create(data);

    return newMovie;
  },

  updateMovie: async (
    id: string,
    title?: string,
    originalTitle?: string,
    overview?: string | null,
    voteCount?: number | null,
    voteAverage?: number | null,
    budget?: number | null,
    genre?: string,
    popularity?: number | null,
    revenue?: number | null,
    runtime?: number | null,
    spokenLang?: string | null,
    originalLanguage?: string | null,
    homepageUri?: string,
    status?: string | null,
    tagline?: string | null,
    posterUri?: string | null,
    backdropUri?: string | null,
    trailerUri?: string | null,
    releaseDate?: Date,
    p0?: Date | undefined
  ) => {
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
      originalTitle,
      overview,
      voteCount,
      voteAverage,
      budget,
      genre: JSON.stringify(genre),
      spokenLang: JSON.stringify(spokenLang),
      popularity,
      revenue,
      runtime,
      originalLanguage,
      homepageUri,
      status,
      tagline,
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

  searchMovie: async (query: string, option: { totalRecordUse: number }) => {
    const { error } = searchMovieSchema.validate({ query, option });

    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    // Linear Search Iterative
    const linearSearchIterative = (movies: any[], searchTerm: string) => {
      const results = [];
      for (const movie of movies) {
        if (movie.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push(movie);
        }
      }
      return results;
    };

    // Linear Search Recursive
    const linearSearchRecursive = (movies: any[], searchTerm: string, index = 0, results: any[] = []) => {
      if (index >= movies.length) return results;
      if (movies[index].title.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push(movies[index]);
      }
      return linearSearchRecursive(movies, searchTerm, index + 1, results);
    };

    // Binary Search Iterative
    const binarySearchIterative = (movies: any[], searchTerm: string) => {
      let left = 0;
      let right = movies.length - 1;
      const results = [];

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const movie = movies[mid];

        if (movie.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push(movie);

          // Check matches on the left side
          let leftIndex = mid - 1;
          while (leftIndex >= 0 && movies[leftIndex].title.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push(movies[leftIndex]);
            leftIndex--;
          }

          // Check matches on the right side
          let rightIndex = mid + 1;
          while (rightIndex < movies.length && movies[rightIndex].title.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push(movies[rightIndex]);
            rightIndex++;
          }

          break; // Stop searching after finding all matches in this block
        } else if (movie.title.toLowerCase() < searchTerm.toLowerCase()) {
          left = mid + 1; // Narrow down to the right side
        } else {
          right = mid - 1; // Narrow down to the left side
        }
      }

      return results;
    };

    // Binary Search Recursive
    const binarySearchRecursive = (movies: any[], searchTerm: string, left = 0, right = movies.length - 1, results: any[] = []): any[] => {
      if (left > right) return results;
      const mid = Math.floor((left + right) / 2);
      const movie = movies[mid];

      if (movie.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push(movie);

        // Check matches on the left side
        let leftIndex = mid - 1;
        while (leftIndex >= 0 && movies[leftIndex].title.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push(movies[leftIndex]);
          leftIndex--;
        }

        // Check matches on the right side
        let rightIndex = mid + 1;
        while (rightIndex < movies.length && movies[rightIndex].title.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push(movies[rightIndex]);
          rightIndex++;
        }

        return results;
      } else if (movie.title.toLowerCase() < searchTerm.toLowerCase()) {
        return binarySearchRecursive(movies, searchTerm, mid + 1, right, results);
      } else {
        return binarySearchRecursive(movies, searchTerm, left, mid - 1, results);
      }
    };

    // Jump Search Iterative
    const jumpSearchIterative = (movies: any[], searchTerm: string) => {
      const n = movies.length;
      const step = Math.floor(Math.sqrt(n));
      let prev = 0;
      const results: any[] = [];

      while (prev < n && movies[Math.min(prev + step, n) - 1].title.toLowerCase() < searchTerm.toLowerCase()) {
        prev += step;
        if (prev >= n) return results; // Stop if step exceeds array length
      }

      // Linear search within the block
      for (let i = prev; i < Math.min(prev + step, n); i++) {
        if (movies[i].title.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push(movies[i]);
        }
      }

      return results;
    };

    // Jump Search Recursive
    const jumpSearchRecursive = (movies: any[], searchTerm: string, step: number, prev = 0, results: any[] = []): any[] => {
      if (prev >= movies.length) return results;

      const nextStep = Math.min(prev + step, movies.length);

      if (movies[nextStep - 1].title.toLowerCase() < searchTerm.toLowerCase()) {
        return jumpSearchRecursive(movies, searchTerm, step, nextStep, results);
      }

      for (let i = prev; i < nextStep; i++) {
        if (movies[i].title.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push(movies[i]);
        }
      }

      return results;
    };

    // Main function for analytics
    const analyzeSearchAlgorithms = (movies: any[], query: string, option: { totalRecordUse: number }) => {
      const step = Math.floor(Math.sqrt(movies.length));

      const analytics = {
        option,
        results: [
          {
            algorithm: "linear",
            iterative: {
              executionTime: 0,
              totalRecord: 0,
              complexityClass: "linear",
            },
            recursive: {
              executionTime: 0,
              totalRecord: 0,
              complexityClass: "linear",
            },
          },
          {
            algorithm: "binary",
            iterative: {
              executionTime: 0,
              totalRecord: 0,
              complexityClass: "logarithmic",
            },
            recursive: {
              executionTime: 0,
              totalRecord: 0,
              complexityClass: "logarithmic",
            },
          },
          {
            algorithm: "jump",
            iterative: {
              executionTime: 0,
              totalRecord: 0,
              complexityClass: "sqrt(n)",
            },
            recursive: {
              executionTime: 0,
              totalRecord: 0,
              complexityClass: "sqrt(n)",
            },
          },
        ],
      };

      // Measure execution time and count results for each algorithm
      const startLinearIterative = performance.now();
      const linearIterativeResults = linearSearchIterative(movies, query);
      analytics.results[0].iterative.executionTime = (performance.now() - startLinearIterative) / 1000;
      analytics.results[0].iterative.totalRecord = linearIterativeResults.length;

      const startLinearRecursive = performance.now();
      const linearRecursiveResults = linearSearchRecursive(movies, query);
      analytics.results[0].recursive.executionTime = (performance.now() - startLinearRecursive) / 1000;
      analytics.results[0].recursive.totalRecord = linearRecursiveResults.length;

      const startBinaryIterative = performance.now();
      const binaryIterativeResults = binarySearchIterative(movies, query);
      analytics.results[1].iterative.executionTime = (performance.now() - startBinaryIterative) / 1000;
      analytics.results[1].iterative.totalRecord = binaryIterativeResults.length;

      const startBinaryRecursive = performance.now();
      const binaryRecursiveResults = binarySearchRecursive(movies, query);
      analytics.results[1].recursive.executionTime = (performance.now() - startBinaryRecursive) / 1000;
      analytics.results[1].recursive.totalRecord = binaryRecursiveResults.length;

      const startJumpIterative = performance.now();
      const jumpIterativeResults = jumpSearchIterative(movies, query);
      analytics.results[2].iterative.executionTime = (performance.now() - startJumpIterative) / 1000;
      analytics.results[2].iterative.totalRecord = jumpIterativeResults.length;

      const startJumpRecursive = performance.now();
      const jumpRecursiveResults = jumpSearchRecursive(movies, query, step);
      analytics.results[2].recursive.executionTime = (performance.now() - startJumpRecursive) / 1000;
      analytics.results[2].recursive.totalRecord = jumpRecursiveResults.length;

      return { analytics, linearIterativeResults };
    };

    const movies = await prisma.movie.findMany({
      take: option.totalRecordUse,
    });

    movies.sort((a, b) => {
      const titleA = a.title || "";
      const titleB = b.title || "";
      return titleA.localeCompare(titleB);
    });

    const { analytics, linearIterativeResults } = analyzeSearchAlgorithms(movies, query, option);
    return { analytics: analytics, results: linearIterativeResults };
  },
};

export default movieService;
