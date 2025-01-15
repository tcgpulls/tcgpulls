/*
  Warnings:

  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CmsUser" DROP CONSTRAINT "CmsUser_role_fkey";

-- DropTable
DROP TABLE "Role";

-- CreateTable
CREATE TABLE "CmsRole" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "value" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "CmsRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CmsRole_value_key" ON "CmsRole"("value");

-- AddForeignKey
ALTER TABLE "CmsUser" ADD CONSTRAINT "CmsUser_role_fkey" FOREIGN KEY ("role") REFERENCES "CmsRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;
