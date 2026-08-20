/*
  Warnings:

  - You are about to drop the `point_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `timers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "point_logs" DROP CONSTRAINT "point_logs_study_id_fkey";

-- DropForeignKey
ALTER TABLE "timers" DROP CONSTRAINT "timers_study_id_fkey";

-- DropTable
DROP TABLE "point_logs";

-- DropTable
DROP TABLE "timers";

-- DropEnum
DROP TYPE "Status";
