-- AlterTable
ALTER TABLE "CmsUser" ALTER COLUMN "role" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "value" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_value_key" ON "Role"("value");

-- CreateIndex
CREATE INDEX "CmsUser_role_idx" ON "CmsUser"("role");

-- AddForeignKey
ALTER TABLE "CmsUser" ADD CONSTRAINT "CmsUser_role_fkey" FOREIGN KEY ("role") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
