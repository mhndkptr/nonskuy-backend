import { PrismaClient } from "@prisma/client";
import fs from "fs";
import csv from "csv-parser";

const prisma = new PrismaClient();

const seedMovies = async () => {
  const movies: any[] = [];

  fs.createReadStream("./9000plus.csv")
    .pipe(csv({ separator: "," }))
    .on("data", (row) => {
      if (row.Title && row.Overview && row.Vote_Average && row.Poster_Url && row.Release_Date && row.Genre) {
        // const genres = row.Genre.split(",").map((genre: string) => genre.trim());
        const genres = row.Genre.split(",")
          .map((genre: string) => genre.trim())
          .join(",");
        movies.push({
          title: row.Title,
          description: row.Overview,
          rating: parseFloat(row.Vote_Average),
          genre: genres,
          posterUri: row.Poster_Url,
          releaseDate: new Date(row.Release_Date),
        });
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
};

seedMovies();
