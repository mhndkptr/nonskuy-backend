import Movie from "../models/movieModel";
import errorHandler from "../middlewares/errorHandler";
import { IExecutionTimes, IMovie } from "../interfaces/movieInterface";
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

  searchWithAnalyticsMovie: async (query: string, option: { totalRecordUse: number }) => {
    const { error } = searchMovieSchema.validate({ query, option });

    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    // Main function for analytics
    const analyzeSearchAlgorithms = (movies: any[], query: string, option: { totalRecordUse: number }, repetitions: number = 5) => {
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

      // Measure execution time and count results
      const linearIterative = averageExecutionTime(() => linearSearchIterative(movies, query), repetitions);
      analytics.results[0].iterative.executionTime = linearIterative.averageTime;
      analytics.results[0].iterative.totalRecord = linearIterative.results.length;

      const linearRecursive = averageExecutionTime(() => linearSearchRecursive(movies, query), repetitions);
      analytics.results[0].recursive.executionTime = linearRecursive.averageTime;
      analytics.results[0].recursive.totalRecord = linearRecursive.results.length;

      const binaryIterative = averageExecutionTime(() => binarySearchIterative(movies, query), repetitions);
      analytics.results[1].iterative.executionTime = binaryIterative.averageTime;
      analytics.results[1].iterative.totalRecord = binaryIterative.results.length;

      const binaryRecursive = averageExecutionTime(() => binarySearchRecursive(movies, query), repetitions);
      analytics.results[1].recursive.executionTime = binaryRecursive.averageTime;
      analytics.results[1].recursive.totalRecord = binaryRecursive.results.length;

      const jumpIterative = averageExecutionTime(() => jumpSearchIterative(movies, query), repetitions);
      analytics.results[2].iterative.executionTime = jumpIterative.averageTime;
      analytics.results[2].iterative.totalRecord = jumpIterative.results.length;

      const jumpRecursive = averageExecutionTime(() => jumpSearchRecursive(movies, query, step), repetitions);
      analytics.results[2].recursive.executionTime = jumpRecursive.averageTime;
      analytics.results[2].recursive.totalRecord = jumpRecursive.results.length;

      return { analytics, linearIterativeResults: linearIterative.results };
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

  getTrendingMovies: async (limit: number) => {
    const trendingMovies = await prisma.movie.findMany({
      orderBy: {
        popularity: "desc",
      },
      take: limit,
    });

    return trendingMovies;
  },

  getRelatedMovies: async (id: string) => {
    const movie = await Movie.findById(id);

    if (!movie) {
      throw new NotFoundError("Movie not found");
    }

    const titleKeywords = movie.title.split(" ");

    const relatedMovies = await prisma.movie.findMany({
      where: {
        id: { not: id },
        OR: [
          {
            genre: {
              contains: movie.genre[0],
            },
          },
        ],
      },
      take: 10,
    });

    return relatedMovies;
  },

  getAnalytics: async (query: string, option: { totalRecordUse: number }) => {
    // Ambil semua film dari database
    const movies = await prisma.movie.findMany();

    // Hitung total data
    const totalData = movies.length;

    // Interval
    const interval = 10;

    const totalExecutionTimeData: number = Math.ceil(option.totalRecordUse / interval);

    const repetitions = 2;

    // Array untuk menyimpan waktu eksekusi
    const executionTimes: IExecutionTimes = {
      linearIterativeExecutionTime: [],
      linearRecursiveExecutionTime: [],
      binaryIterativeExecutionTime: [],
      binaryRecursiveExecutionTime: [],
      jumpIterativeExecutionTime: [],
      jumpRecursiveExecutionTime: [],
    };

    // Menghitung waktu eksekusi untuk setiap interval
    for (let i = interval; i <= option.totalRecordUse; i += interval) {
      const currentMovies = movies.slice(0, i); // Ambil subset dari movies

      // Menjalankan pencarian dan mengukur waktu eksekusi
      const linearIterativeResults = averageExecutionTime(() => linearSearchIterative(currentMovies, query), repetitions);
      const linearRecursiveResults = averageExecutionTime(() => linearSearchRecursive(currentMovies, query), repetitions);
      const binaryIterativeResults = averageExecutionTime(() => binarySearchIterative(currentMovies, query), repetitions);
      const binaryRecursiveResults = averageExecutionTime(() => binarySearchRecursive(currentMovies, query), repetitions);
      const jumpIterativeResults = averageExecutionTime(() => jumpSearchIterative(currentMovies, query), repetitions);
      const jumpRecursiveResults = averageExecutionTime(() => jumpSearchRecursive(currentMovies, query, Math.floor(Math.sqrt(currentMovies.length))), repetitions);

      // Menyimpan waktu eksekusi ke dalam array
      executionTimes.linearIterativeExecutionTime.push(linearIterativeResults.averageTime);
      executionTimes.linearRecursiveExecutionTime.push(linearRecursiveResults.averageTime);
      executionTimes.binaryIterativeExecutionTime.push(binaryIterativeResults.averageTime);
      executionTimes.binaryRecursiveExecutionTime.push(binaryRecursiveResults.averageTime);
      executionTimes.jumpIterativeExecutionTime.push(jumpIterativeResults.averageTime);
      executionTimes.jumpRecursiveExecutionTime.push(jumpRecursiveResults.averageTime);
    }

    if (option.totalRecordUse % interval !== 0) {
      const currentMovies = movies.slice(0, option.totalRecordUse); // Ambil subset dari movies

      // Menjalankan pencarian dan mengukur waktu eksekusi
      const linearIterativeResults = averageExecutionTime(() => linearSearchIterative(currentMovies, query), repetitions);
      const linearRecursiveResults = averageExecutionTime(() => linearSearchRecursive(currentMovies, query), repetitions);
      const binaryIterativeResults = averageExecutionTime(() => binarySearchIterative(currentMovies, query), repetitions);
      const binaryRecursiveResults = averageExecutionTime(() => binarySearchRecursive(currentMovies, query), repetitions);
      const jumpIterativeResults = averageExecutionTime(() => jumpSearchIterative(currentMovies, query), repetitions);
      const jumpRecursiveResults = averageExecutionTime(() => jumpSearchRecursive(currentMovies, query, Math.floor(Math.sqrt(currentMovies.length))), repetitions);

      // Menyimpan waktu eksekusi ke dalam array
      executionTimes.linearIterativeExecutionTime.push(linearIterativeResults.averageTime);
      executionTimes.linearRecursiveExecutionTime.push(linearRecursiveResults.averageTime);
      executionTimes.binaryIterativeExecutionTime.push(binaryIterativeResults.averageTime);
      executionTimes.binaryRecursiveExecutionTime.push(binaryRecursiveResults.averageTime);
      executionTimes.jumpIterativeExecutionTime.push(jumpIterativeResults.averageTime);
      executionTimes.jumpRecursiveExecutionTime.push(jumpRecursiveResults.averageTime);
    }

    // Mengembalikan hasil analitik
    const analytics = {
      option: {
        query,
        totalData,
        totalExecutionTimeData,
        interval,
        totalRecordUse: option.totalRecordUse,
      },
      result: executionTimes,
    };

    return analytics;
  },
};

export default movieService;

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

// Helper function for measuring execution time
const measureExecutionTime = (fn: () => any) => {
  const start = performance.now();
  const result = fn();
  const executionTime = (performance.now() - start) / 1000; // Convert to seconds
  return { result, executionTime };
};

// Helper function to calculate average time over multiple repetitions
const averageExecutionTime = (fn: () => any, repetitions: number) => {
  let totalExecutionTime = 0;
  let results: any[] = [];
  for (let i = 0; i < repetitions; i++) {
    const { result, executionTime } = measureExecutionTime(fn);
    totalExecutionTime += executionTime;
    results = result; // Assume results are consistent across runs
  }
  return { averageTime: totalExecutionTime / repetitions, results };
};
