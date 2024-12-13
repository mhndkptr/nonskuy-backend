/*
  Warnings:

  - You are about to drop the column `description` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `movie` table. All the data in the column will be lost.
  - Added the required column `homepageUri` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imdbId` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalTitle` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `movie` DROP COLUMN `description`,
    DROP COLUMN `rating`,
    ADD COLUMN `budget` DOUBLE NULL,
    ADD COLUMN `homepageUri` VARCHAR(191) NOT NULL,
    ADD COLUMN `imdbId` VARCHAR(191) NOT NULL,
    ADD COLUMN `originalLanguage` VARCHAR(191) NULL,
    ADD COLUMN `originalTitle` VARCHAR(191) NOT NULL,
    ADD COLUMN `overview` TEXT NULL,
    ADD COLUMN `popularity` DOUBLE NULL,
    ADD COLUMN `revenue` DOUBLE NULL,
    ADD COLUMN `runtime` DOUBLE NULL,
    ADD COLUMN `spokenLang` VARCHAR(191) NULL,
    ADD COLUMN `status` VARCHAR(191) NULL,
    ADD COLUMN `tagline` VARCHAR(191) NULL,
    ADD COLUMN `voteAverage` DOUBLE NULL,
    ADD COLUMN `voteCount` INTEGER NULL;
