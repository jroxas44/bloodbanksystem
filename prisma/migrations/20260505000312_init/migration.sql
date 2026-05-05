-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `hashedPassword` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'CLERK',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Donor` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `bloodType` VARCHAR(191) NOT NULL,
    `rhFactor` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `zipCode` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `lastDonation` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Donation` (
    `id` VARCHAR(191) NOT NULL,
    `donorId` VARCHAR(191) NOT NULL,
    `donationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `volumeMl` INTEGER NOT NULL DEFAULT 450,
    `bloodType` VARCHAR(191) NOT NULL,
    `rhFactor` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'COLLECTED',
    `hemoglobinLevel` DOUBLE NULL,
    `notes` TEXT NULL,
    `collectedBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Donation_donorId_idx`(`donorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BloodInventory` (
    `id` VARCHAR(191) NOT NULL,
    `bloodType` VARCHAR(191) NOT NULL,
    `rhFactor` VARCHAR(191) NOT NULL,
    `unitsAvailable` INTEGER NOT NULL DEFAULT 0,
    `minimumStock` INTEGER NOT NULL DEFAULT 5,
    `lastUpdated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BloodInventory_bloodType_rhFactor_key`(`bloodType`, `rhFactor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BloodRequest` (
    `id` VARCHAR(191) NOT NULL,
    `patientName` VARCHAR(191) NOT NULL,
    `patientAge` INTEGER NOT NULL,
    `bloodType` VARCHAR(191) NOT NULL,
    `rhFactor` VARCHAR(191) NOT NULL,
    `unitsRequested` INTEGER NOT NULL,
    `urgency` VARCHAR(191) NOT NULL DEFAULT 'NORMAL',
    `hospitalName` VARCHAR(191) NOT NULL,
    `doctorName` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `notes` TEXT NULL,
    `requestedBy` VARCHAR(191) NOT NULL,
    `processedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Donation` ADD CONSTRAINT `Donation_donorId_fkey` FOREIGN KEY (`donorId`) REFERENCES `Donor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
