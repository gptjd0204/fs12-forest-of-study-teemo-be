/*
  Warnings:

  - A unique constraint covering the columns `[nickname,title]` on the table `studies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "studies_nickname_title_key" ON "studies"("nickname", "title");
