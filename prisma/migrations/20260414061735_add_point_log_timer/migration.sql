-- CreateEnum
CREATE TYPE "Status" AS ENUM ('IN_PROGRESS', 'PAUSED', 'CANCELED', 'COMPLETED');

-- CreateTable
CREATE TABLE "point_logs" (
    "id" SERIAL NOT NULL,
    "study_id" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "focus_duration" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "point_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timers" (
    "id" SERIAL NOT NULL,
    "study_id" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'CANCELED',
    "target_duration" INTEGER NOT NULL DEFAULT 1500000,
    "elapsed_time" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "timers_study_id_key" ON "timers"("study_id");

-- AddForeignKey
ALTER TABLE "point_logs" ADD CONSTRAINT "point_logs_study_id_fkey" FOREIGN KEY ("study_id") REFERENCES "studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timers" ADD CONSTRAINT "timers_study_id_fkey" FOREIGN KEY ("study_id") REFERENCES "studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
