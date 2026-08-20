/*
  Warnings:

  - You are about to drop the column `srart_date` on the `habits` table. All the data in the column will be lost.
  - Added the required column `start_date` to the `habits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "habits" DROP COLUMN "srart_date",
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "point_logs" (
    "id" SERIAL NOT NULL,
    "studyId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "focus_duration" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "point_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "point_logs" ADD CONSTRAINT "point_logs_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
