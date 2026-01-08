/*
  Warnings:

  - You are about to drop the column `message` on the `proposal_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `proposal_submissions` table. All the data in the column will be lost.
  - Added the required column `ipAddress` to the `contact_submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `contact_submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ipAddress` to the `newsletter_subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `newsletter_subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `proposal_submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `proposal_submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ipAddress` to the `proposal_submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `proposal_submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `proposal_submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectType` to the `proposal_submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `proposal_submissions` table without a default value. This is not possible if the table is not empty.
  - Made the column `company` on table `proposal_submissions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "contact_submissions" ADD COLUMN     "company" TEXT,
ADD COLUMN     "ipAddress" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "newsletter_subscriptions" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "ipAddress" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "proposal_submissions" DROP COLUMN "message",
DROP COLUMN "name",
ADD COLUMN     "budget" TEXT,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "ipAddress" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "projectType" TEXT NOT NULL,
ADD COLUMN     "resumeUrl" TEXT,
ADD COLUMN     "timeline" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userAgent" TEXT,
ALTER COLUMN "company" SET NOT NULL;
