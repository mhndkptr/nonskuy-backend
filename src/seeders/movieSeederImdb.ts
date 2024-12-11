import { PrismaClient } from "@prisma/client";
import fs from "fs";
import csv from "csv-parser";

// Command
// npx ts-node ./src/seeders/movieSeederImdb.ts

const prisma = new PrismaClient();

async function main() {
  const movies: any[] = [];

  function getBackdropPath(collectionString: string | null): string | null {
    if (!collectionString) {
      //   console.log("No belongs_to_collection data available.");
      return null;
    }

    try {
      const jsonString = collectionString.replace(/'/g, '"').replace(/None/g, "null");
      const collection = JSON.parse(jsonString);

      if (!collection.backdrop_path) {
        // console.log("backdrop_path not found in collection:", collection);
      }

      return collection.backdrop_path || null;
    } catch (error) {
      //   console.error("Error parsing belongs_to_collection:", error);
      return null;
    }
  }

  function getPosterPath(collectionString: string | null): string | null {
    if (!collectionString) {
      //   console.log("No belongs_to_collection data available.");
      return null;
    }

    try {
      const jsonString = collectionString.replace(/'/g, '"').replace(/None/g, "null");
      const collection = JSON.parse(jsonString);

      if (!collection.poster_path) {
        // console.log("poster_path not found in collection:", collection);
      }

      return collection.poster_path || null;
    } catch (error) {
      //   console.error("Error parsing belongs_to_collection:", error);
      return null;
    }
  }

  fs.createReadStream("../movies_metadata.csv")
    .pipe(csv())
    .on("data", (row) => {
      const backdrop_path = getBackdropPath(row.belongs_to_collection);
      const poster_path = getPosterPath(row.belongs_to_collection);
      if (row.imdb_id && row.title && row.overview && poster_path && row.genres && row.release_date) {
        const movie = {
          imdbId: row.imdb_id,
          title: row.title,
          originalTitle: row.original_title,
          overview: row.overview,
          voteCount: parseInt(row.vote_count) || 0,
          voteAverage: parseFloat(row.vote_average) || 0,
          budget: parseFloat(row.budget) || 0,
          genre: row.genres.replace(/'/g, '"'),
          popularity: parseFloat(row.popularity) || 0,
          revenue: parseFloat(row.revenue) || 0,
          runtime: parseInt(row.runtime) || 0,
          spokenLang: row.spoken_languages,
          originalLanguage: row.original_language,
          homepageUri: row.homepage,
          status: row.status,
          tagline: row.tagline,
          posterUri: poster_path ? `https://image.tmdb.org/t/p/original${poster_path}` : null,
          backdropUri: backdrop_path ? `https://image.tmdb.org/t/p/original${backdrop_path}` : null,
          trailerUri: null,
          releaseDate: new Date(row.release_date),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        movies.push(movie);
      }
    })
    .on("end", async () => {
      try {
        await prisma.movie.createMany({
          data: movies,
        });
        console.log("Movies seeded successfully!");
      } catch (error) {
        console.error("Error seeding movies:", error);
      } finally {
        await prisma.$disconnect();
      }
    });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
