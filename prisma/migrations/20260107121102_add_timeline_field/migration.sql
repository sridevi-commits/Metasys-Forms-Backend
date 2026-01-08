/*
  Warnings:

  - You are about to drop the column `budget` on the `proposal_submissions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "proposal_submissions" DROP COLUMN "budget",
ADD COLUMN     "timeline" TEXT;
