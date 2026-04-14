-- DropForeignKey
ALTER TABLE "habit_records" DROP CONSTRAINT "habit_records_habit_id_fkey";

-- DropForeignKey
ALTER TABLE "habits" DROP CONSTRAINT "habits_study_id_fkey";

-- AddForeignKey
ALTER TABLE "habits" ADD CONSTRAINT "habits_study_id_fkey" FOREIGN KEY ("study_id") REFERENCES "studies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habit_records" ADD CONSTRAINT "habit_records_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
