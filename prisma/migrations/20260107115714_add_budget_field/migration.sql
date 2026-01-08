/*
  Warnings:

  - You are about to drop the column `createdAt` on the `proposal_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `proposal_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `proposal_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `proposal_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `projectType` on the `proposal_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUrl` on the `proposal_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `timeline` on the `proposal_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `proposal_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `proposal_submissions` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `proposal_submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `proposal_submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_type` to the `proposal_submissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "proposal_submissions" DROP COLUMN "createdAt",
DROP COLUMN "firstName",
DROP COLUMN "ipAddress",
DROP COLUMN "lastName",
DROP COLUMN "projectType",
DROP COLUMN "resumeUrl",
DROP COLUMN "timeline",
DROP COLUMN "updatedAt",
DROP COLUMN "userAgent",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "project_type" TEXT NOT NULL,
ADD COLUMN     "resume_url" TEXT,
ADD COLUMN     "user_agent" TEXT,
ALTER COLUMN "company" DROP NOT NULL;
