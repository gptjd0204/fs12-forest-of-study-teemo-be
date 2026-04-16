/*
  Warnings:

  - You are about to drop the column `started_at` on the `timers` table. All the data in the column will be lost.
  - The `status` column on the `timers` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "timers" DROP COLUMN "started_at",
ADD COLUMN     "first_started_at" TIMESTAMP(3),
ADD COLUMN     "last_started_at" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'CANCELED';

-- DropEnum
DROP TYPE "Status";
