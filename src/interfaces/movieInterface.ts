export interface IMovie {
  id: string;
  title: string;
  description?: string | null; // Optional field
  rating?: number | null; // Optional field
  genre: string;
  posterUri?: string | null; // Optional field
  backdropUri?: string | null; // Optional field
  trailerUri?: string | null; // Optional field
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null; // Optional field for soft delete
}
