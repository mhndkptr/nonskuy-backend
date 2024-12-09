import { $Enums } from "@prisma/client";

export interface IMovie {
  id: string;
  title: string;
  description?: string | null; // Optional field
  rating?: number | null; // Optional field
  genre: $Enums.Genre;
  posterUri?: string | null; // Optional field
  backdropUri?: string | null; // Optional field
  trailerUri?: string | null; // Optional field
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null; // Optional field for soft delete
}

export enum Genre {
  ACTION = "ACTION",
  COMEDY = "COMEDY",
  DRAMA = "DRAMA",
  HORROR = "HORROR",
  THRILLER = "THRILLER",
  SCIFI = "SCIFI",
  FANTASY = "FANTASY",
  ROMANCE = "ROMANCE",
  DOCUMENTARY = "DOCUMENTARY",
  ANIMATION = "ANIMATION",
  OTHER = "OTHER",
}
