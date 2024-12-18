export interface IMovie {
  id: string; // ID unik untuk film
  imdbId: string; // ID IMDb film
  title: string; // Judul film
  originalTitle: string; // Judul asli film
  overview?: string | null; // Deskripsi film (optional)
  voteCount?: number | null; // Jumlah suara (optional)
  voteAverage?: number | null; // Rata-rata suara (optional)
  budget?: number | null; // Anggaran film (optional)
  genre: string; // Genre film
  popularity?: number | null; // Popularitas film (optional)
  revenue?: number | null; // Pendapatan film (optional)
  runtime?: number | null; // Durasi film dalam menit (optional)
  spokenLang?: string | null; // Bahasa yang digunakan (optional)
  originalLanguage?: string | null; // Bahasa asli film (optional)
  homepageUri: string; // URL homepage film
  status?: string | null; // Status film (optional)
  tagline?: string | null; // Tagline film (optional)
  posterUri?: string | null; // URL poster film (optional)
  backdropUri?: string | null; // URL backdrop film (optional)
  trailerUri?: string | null; // URL trailer film (optional)
  releaseDate: Date; // Tanggal rilis film
  createdAt: Date; // Tanggal dibuat
  updatedAt: Date; // Tanggal diperbarui
  deletedAt?: Date | null; // Tanggal dihapus (optional untuk soft delete)
}

export interface IExecutionTimes {
  linearIterativeExecutionTime: number[];
  linearRecursiveExecutionTime: number[];
  binaryIterativeExecutionTime: number[];
  binaryRecursiveExecutionTime: number[];
  jumpIterativeExecutionTime: number[];
  jumpRecursiveExecutionTime: number[];
}
