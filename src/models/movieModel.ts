import { PrismaClient } from "@prisma/client";
import { IMovie } from "../interfaces/movieInterface";

const prisma = new PrismaClient();

const Movie = {
  findAll: async () => {
    return await prisma.movie.findMany();
  },
  findById: async (id: string) => {
    return await prisma.movie.findUnique({
      where: { id: id },
    });
  },
  create: async (data: {
    imdbId: string;
    title: string;
    originalTitle: string;
    overview?: string | null; // Optional
    voteCount?: number | null; // Optional
    voteAverage?: number | null; // Optional
    budget?: number | null; // Optional
    genre: string;
    popularity?: number | null; // Optional
    revenue?: number | null; // Optional
    runtime?: number | null; // Optional
    spokenLang?: string | null; // Optional
    originalLanguage?: string | null; // Optional
    homepageUri: string;
    status?: string | null; // Optional
    tagline?: string | null; // Optional
    posterUri?: string | null; // Optional
    backdropUri?: string | null; // Optional
    trailerUri?: string | null; // Optional
    releaseDate: Date;
  }) => {
    return await prisma.movie.create({ data });
  },
  update: async (id: string, data: Partial<IMovie>) => {
    return await prisma.movie.update({
      where: { id: id },
      data: data,
    });
  },
  delete: async (id: string) => {
    return await prisma.movie.delete({
      where: { id: id },
    });
  },
};

export default Movie;
