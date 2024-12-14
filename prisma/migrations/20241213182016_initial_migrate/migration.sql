-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Movie` (
    `id` VARCHAR(191) NOT NULL,
    `imdbId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `originalTitle` VARCHAR(191) NOT NULL,
    `overview` TEXT NULL,
    `voteCount` INTEGER NULL,
    `voteAverage` DOUBLE NULL,
    `budget` DOUBLE NULL,
    `genre` TEXT NOT NULL,
    `popularity` DOUBLE NULL,
    `revenue` DOUBLE NULL,
    `runtime` INTEGER NULL,
    `spokenLang` TEXT NULL,
    `originalLanguage` VARCHAR(191) NULL,
    `homepageUri` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NULL,
    `tagline` TEXT NULL,
    `posterUri` VARCHAR(191) NULL,
    `backdropUri` VARCHAR(191) NULL,
    `trailerUri` VARCHAR(191) NULL,
    `releaseDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
