-- CreateTable
CREATE TABLE "emojis" (
    "id" SERIAL NOT NULL,
    "study_id" INTEGER NOT NULL,
    "emoji" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emojis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "emojis" ADD CONSTRAINT "emojis_study_id_fkey" FOREIGN KEY ("study_id") REFERENCES "studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
