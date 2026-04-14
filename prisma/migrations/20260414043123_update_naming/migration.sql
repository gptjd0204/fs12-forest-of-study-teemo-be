/*
  Warnings:

  - You are about to drop the column `habitId` on the `habit_records` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `habit_records` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `habits` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `habits` table. All the data in the column will be lost.
  - You are about to drop the column `studyId` on the `habits` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[habit_id,date]` on the table `habit_records` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `habit_id` to the `habit_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `srart_date` to the `habits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `study_id` to the `habits` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "habit_records" DROP CONSTRAINT "habit_records_habitId_fkey";

-- DropForeignKey
ALTER TABLE "habits" DROP CONSTRAINT "habits_studyId_fkey";

-- DropIndex
DROP INDEX "habit_records_habitId_date_key";

-- AlterTable
ALTER TABLE "habit_records" DROP COLUMN "habitId",
DROP COLUMN "isCompleted",
ADD COLUMN     "habit_id" INTEGER NOT NULL,
ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "habits" DROP COLUMN "endDate",
DROP COLUMN "startDate",
DROP COLUMN "studyId",
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "srart_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "study_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "habit_records_habit_id_date_key" ON "habit_records"("habit_id", "date");

-- AddForeignKey
ALTER TABLE "habits" ADD CONSTRAINT "habits_study_id_fkey" FOREIGN KEY ("study_id") REFERENCES "studies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habit_records" ADD CONSTRAINT "habit_records_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
