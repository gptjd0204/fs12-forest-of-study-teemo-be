/*
  Warnings:

  - You are about to drop the column `studyId` on the `point_logs` table. All the data in the column will be lost.
  - You are about to drop the column `studyId` on the `timers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[study_id]` on the table `timers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `study_id` to the `point_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `study_id` to the `timers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "point_logs" DROP CONSTRAINT "point_logs_studyId_fkey";

-- DropForeignKey
ALTER TABLE "timers" DROP CONSTRAINT "timers_studyId_fkey";

-- DropIndex
DROP INDEX "timers_studyId_key";

-- AlterTable
ALTER TABLE "point_logs" DROP COLUMN "studyId",
ADD COLUMN     "study_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "timers" DROP COLUMN "studyId",
ADD COLUMN     "study_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "timers_study_id_key" ON "timers"("study_id");

-- AddForeignKey
ALTER TABLE "point_logs" ADD CONSTRAINT "point_logs_study_id_fkey" FOREIGN KEY ("study_id") REFERENCES "studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timers" ADD CONSTRAINT "timers_study_id_fkey" FOREIGN KEY ("study_id") REFERENCES "studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
