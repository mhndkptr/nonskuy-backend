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
  create: async (data: { title: string; description: string; rating: number; genre: string; posterUri: string; backdropUri: string; trailerUri: string; releaseDate: Date }) => {
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
