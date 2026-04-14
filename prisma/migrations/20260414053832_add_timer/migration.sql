-- CreateEnum
CREATE TYPE "Status" AS ENUM ('IN_PROGRESS', 'PAUSED', 'CANCELED', 'COMPLETED');

-- CreateTable
CREATE TABLE "timers" (
    "id" SERIAL NOT NULL,
    "studyId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'CANCELED',
    "target_duration" INTEGER NOT NULL DEFAULT 1500000,
    "elapsed_time" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "timers_studyId_key" ON "timers"("studyId");

-- AddForeignKey
ALTER TABLE "timers" ADD CONSTRAINT "timers_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
